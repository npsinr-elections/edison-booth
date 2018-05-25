
import crypto = require("crypto");
import express = require("express");
import session = require("express-session");
import morgan = require("morgan");
import nunjucks = require("nunjucks");
import { config } from "../config";

export const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("tiny"));
}

app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: crypto.randomBytes(64).toString("hex"),
  }));

app.use(express.json());
app.use(express.urlencoded({
  extended: true
  }));

app.set("views", config.views);

nunjucks.configure(app.get("views"), {
  autoescape: true,
  noCache: true,
  express: app
  });

app.use("/assets", express.static(config.assets));
app.use("/images", express.static(config.database.images));
app.use("/assets", express.static(config.assets));
app.use("/images", express.static(config.database.images));

export function runServer() {

  app.get("/", (_1, res) => res.render("welcome.html"));
  app.get("/vote", (_1, res) => res.render("vote.html"));
  app.get("/thankyou", (_1, res) => res.render("thankyou.html"));
  app.listen(3000, () => console.log("Listening on port 3000!"));

}
