
import crypto = require("crypto");
import express = require("express");
import session = require("express-session");
import morgan = require("morgan");
import nunjucks = require("nunjucks");

import { config } from "../config";
import { router as mainRouter } from "./routes/mainRouter";

export const app = express();
var votes=0;
var check=0;
var json=require("./candidatelist.json");

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

app.use("/", mainRouter);

export function runServer(callBack: () => void): void {

  app.listen(3000, () => console.log("Listening on port 3000!"));

  callBack();
}
function countVotes(office:string,candidates:string){
  for (var i=0;i<json.polls.length;i++){
    if (json.polls[i].name==office){
      for (var j=0;j<json.polls[i].candidates.length;j++){
        if (json.polls[i].candidates[j].name==candidates){
          json.polls[i].candidates[j].votes+=1;
          votes=json.polls[i].candidates[j].votes;
        }
      }
    }
  }
  }
function checkVotes(office:string){
  for (var i=0;i<json.polls.length;i++){
    if (json.polls[i].name==office){
      var max_votes=json.polls[i].candidates[0].votes;
      for (var j=0;j<json.polls[i].candidates.length;j++){
        if (json.polls[i].candidates[j].votes>max_votes){
          max_votes=json.polls[i].candidates[j].votes;
          }}
      for (var k=0;k<json.polls[i].candidates.length;k++){
        if (json.polls[i].candidates[j].votes==max_votes){
          check=1;
            }
        }
      }
    }}