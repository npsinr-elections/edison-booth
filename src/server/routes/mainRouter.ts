import express = require("express");

import { election } from "../../dummy/dummyElection";

export const router = express.Router();

router.get("/", (_REQ, res) => {
  res.redirect("/home");
});

router.get("/home", (_REQ, res) => {
  res.render("welcome.html");
});

router.get("/vote", (_REQ, res) => {
  res.render("vote.html", { election: election });
});

router.post("/vote", (req, res) => {
  console.log(req.body.votes);
  res.send("OK!");
});

router.get("/thankyou", (_REQ, res) => res.render("thankyou.html"));
