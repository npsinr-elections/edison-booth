import express = require("express");
import fs = require("fs");
import ip = require("ip");
import Datastore = require("nedb");
import path = require("path");
import request = require("request");
import rp = require("request-promise");
import shortid = require("shortid");

import { config } from "../../config";
import { db, unzipElection } from "../model/elections";
import { asyncMiddleware } from "../utils/asyncMiddleware";
import { dbRemove } from "../utils/database";
import { ERRORS, JSONResponse } from "../utils/JSONResponse";
import { zipFile } from "../utils/zipAndUnzip";

export const router = express.Router();

router.get("/import/select", asyncMiddleware(async (req, res) => {
  const serverIP = req.query.serverIP;
  const URL = "http://" + serverIP + ":3000";

  let resp;
  try {
    resp = await rp(URL + "/identity");
  } catch (err) {
    console.log(err);
    return JSONResponse.Error(res, ERRORS.ResourceError.NotFound);
  }
  let identity: any;
  try {
    identity = JSON.parse(resp);
  } catch (err) {
    return JSONResponse.Error(res, ERRORS.ResourceError.NotFound);
  }
  if (identity.name === "edison-central") {
    const electionData = JSON.parse(await rp(URL + "/external/getElections"));
    res.render("election-select.html", {
      appName: config.appName,
      lanIP: ip.address(),
      serverURL: URL,
      pageTitle: "Select Elections",
      currentURL: req.url,
      formURL: "/external/import/download",
      elections: electionData,
      submitBtnText: "Begin voting",
      submitBtnIcon: "fas fa-angle-double-right"
    });

  } else {
    return JSONResponse.Error(res, ERRORS.ResourceError.NotFound);
  }
}));

router.get("/import/download", asyncMiddleware(async (req, res) => {
  const electionID = req.query.electionID;
  const URL = req.query.serverURL;
  const downloadPath = path.join(
    config.database.temp,
    shortid.generate() + ".zip");
  const r = request(
    URL + `/external/elections/${electionID}/export?all=true`);
  r
    .on("error", () => {
      JSONResponse.Error(res, ERRORS.ResourceError.NotFound);
    })
    .pipe(fs.createWriteStream(downloadPath))
    .on("finish", () => {
      unzipElection(downloadPath).then(() => res.redirect("/vote"));
    });
}));

router.get("/export", asyncMiddleware(async (_REQ, res) => {
  const oldDB = db.loadDB();
  if (oldDB === undefined) {
    return JSONResponse.Error(res, ERRORS.ResourceError.NotFound);
  }
  const dbCopy = path.join(config.database.temp, shortid.generate() + ".db");
  fs.copyFileSync(oldDB, dbCopy);
  const newDB = new Datastore({
    filename: dbCopy,
    autoload: true
  });

  // Don't include unselected candidates
  await dbRemove(newDB, { show: false }, { multi: true});

  const zipPath = zipFile(dbCopy, config.database.temp);
  res.download(zipPath, () => {
    fs.unlinkSync(zipPath);
    fs.unlinkSync(dbCopy);
  });
}));
