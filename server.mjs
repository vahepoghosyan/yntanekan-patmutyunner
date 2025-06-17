import express from "express";
import https from "https";
import expressLayout from "express-ejs-layouts";
import cookieParser from "cookie-parser";
import Database from "better-sqlite3";
import QRCode from "qrcode";
import { fileURLToPath } from "url";
import fs from "fs";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const origin = "https://marriott-admin.onrender.com";
import e from "express";

const db = new Database("poll.db");
const app = express();
app.use(express.json());

// Create table if not exists
db.prepare(
  `
    CREATE TABLE IF NOT EXISTS votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      version INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `
).run();

app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/img", express.static(__dirname + "public/img"));
app.use("/js", express.static(__dirname + "public/js"));

app.set("layout", "./layout/layout");

app.use(cookieParser());
app.use(expressLayout);

app.set("views", "./src/views");
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));

app.get("/qr", (req, res) => {
  const d = new Date();
  const date = `${d.getDate()}_${d.getMonth() + 1}_${d.getFullYear()}`;
  QRCode.toDataURL(`https://www.vahepoghosyan.com/?date=${date}`, {
    scale: 100,
  }).then((url) => {
    res.render("qr.ejs", {
      qr: url,
    });
  });
});

app.get("/", (req, res) => {
  const { date } = req.query;

  if (!date) return res.redirect("/404.ejs");

  if (req.cookies.date === date && req.cookies.isVoted === "true") {
    return res.render("voted.ejs");
  }

  res.cookie("date", date);
  res.cookie("isVoted", false);
  res.render("index.ejs");
});

const options = ["1", "2", "3"];

app.post("/version", (req, res) => {
  res.cookie("isVoted", true);

  const { version } = req.body;
  if (!options.includes(version)) {
    return res.redirect("/404.ejs");
  }

  db.prepare(`INSERT INTO votes (version) VALUES (?)`).run(version);

  res.status(200).json({ message: "" });
});

app.get("/poll", (req, res) => {
  const counts = [];

  const todaysRes = db
    .prepare(
      `SELECT * FROM votes WHERE DATE(created_at) = DATE('now', 'localtime')`
    )
    .all();

  const sum = todaysRes.length;

  options.forEach((option, index) => {
    const versionCount = todaysRes.filter(
      (version) => version.version === +option
    ).length;
    counts[index] = versionCount;
  });

  const winner = Math.max(...counts);

  const poll = counts.map((count) => ({
    count,
    color: winner === count ? "green" : "#535152",
  }));

  res.render("poll.ejs", { poll });
});

app.get("*", (req, res) => {
  res.render("404", { title: "404" });
});

app.listen(3001);
