
import express = require("express");

export const app = express();

app.get("/", (_1, res) => res.render("index.html"));

// app.listen(3000, () => console.log("Listening on port 3000!"));
