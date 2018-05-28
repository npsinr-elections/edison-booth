import express = require("express");
import fs = require("fs");
import ip = require("ip");
import multer = require("multer");
import path = require("path");
import rimraf = require("rimraf");
import shortid = require("shortid");

import { promisify } from "util";

import { config } from "../../config";
import { Candidate } from "../../shared/models";
import { db } from "../model/elections";
import { unzip, zipFile } from "../utils/zipAndUnzip";

import { asyncMiddleware } from "../utils/asyncMiddleware";
import { ERRORS, JSONResponse } from "../utils/JSONResponse";

export const router = express.Router();
const storage = multer.diskStorage({
  destination: config.database.temp,
  filename: (_REQ, file, cb) => {
    cb(null, shortid.generate() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.get("/", (_REQ, res) => {
  res.redirect("/home");
});

router.get("/home", (req, res) => {
  res.render("home.html", {
    appName: config.appName,
    currentURL: req.url,
    pageTitle: "Home",
    lanIP: ip.address()
  });
});

router.post("/import", upload.single("importedData"),
  asyncMiddleware(async (req, res) => {
    await Promise.all([
      promisify(rimraf)(config.database.images),
      promisify(rimraf)(path.join(config.database.dir, "*.db"))
    ]);

    unzip(req.file.path, config.database.dir);

    JSONResponse.Data(res, {});
    await promisify(fs.unlink)(req.file.path);
  }
));

router.get("/vote", asyncMiddleware(async (_REQ, res) => {
  if (db.loadDB() === undefined) {
    return JSONResponse.Error(res, ERRORS.ResourceError.NotFound);
  }
  const electionData = await db.getElections();
  console.log(electionData[0].polls.length);

  if (electionData.length !== 1) {
    return JSONResponse.Error(res, ERRORS.ResourceError.NotFound);
  }
  res.render("vote/vote.html", { election: electionData[0] });
}));

router.post("/vote", asyncMiddleware(async (req, res) => {
  const voteIDs = req.body.votes as string[];
  const candidates = await Promise.all((voteIDs.map((value) => {
    return (db.getResourceByID(value, "candidate")) as Promise<Candidate>;
  })));

  const pollIDs: string[] = candidates.map((candidate) => candidate.parentID);

  if ((new Set(pollIDs)).size !== pollIDs.length) {
    return JSONResponse.Error(res, ERRORS.ResourceError.VoteError);
  } else {
    await Promise.all(candidates.map((candidate) => {
      return db.incrementVotes(candidate.id);
    }));
    return JSONResponse.Data(res, {});
  }

}));

router.get("/export", asyncMiddleware(async (_REQ, res) => {
  const zipPath = zipFile(db.loadDB(), config.database.temp);
  res.download(zipPath, () => {
    fs.unlinkSync(zipPath);
  });
}));
