import express = require("express");
import ip = require("ip");

import { config } from "../../config";
import { election } from "../../dummy/dummyElection";

export const router = express.Router();

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

router.get("/vote", (_REQ, res) => {
  res.render("vote/vote.html", { election: election });
});

router.post("/vote", (req, res) => {
  console.log(req.body.votes);
  res.send("OK!");
});

router.get("/thankyou", (_REQ, res) => res.render("thankyou.html"));
