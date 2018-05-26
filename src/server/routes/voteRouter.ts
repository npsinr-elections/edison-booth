import express = require("express");

import { election } from "../../dummy/dummyElection";

export const router = express.Router();

router.get("/", (_1, res) => res.render("welcome.html"));

router.get("/vote", (_1, res) => {
  res.render("vote.html", { election: election });
});

router.get("/thankyou", (_REQ, res) => res.render("thankyou.html"));
