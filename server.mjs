import express from "express";
import https from "https";
import expressLayout from "express-ejs-layouts";
import cookieParser from "cookie-parser";
import Database from "better-sqlite3";
import QRCode from "qrcode";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

function generateInsecureRandomString(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

app.get("/qr", (req, res) => {
  const hash = Math.round(Math.random() * 1000000);
  // const date = `${d.getDate()}_${d.getMonth() + 1}_${d.getFullYear()}`;
  db.prepare(`DELETE FROM votes`).run();
  QRCode.toDataURL(
    // `https://yntanekan-patmutyunner-901154874733.europe-west1.run.app/?hash=${generateInsecureRandomString(10)}`,
    `https://yntanekan-patmutyunner-901154874733.europe-west1.run.app`,
    {
      scale: 100,
    }
  ).then((url) => {
    res.render("qr.ejs", {
      qr: url,
    });
  });
});

app.get("/", (req, res) => {
  // const { hash } = req.query;

  // if (!hash) return res.redirect("/404");

  // if (req.cookies.hash === hash && req.cookies.isVoted === "true") {
  // return res.render("voted.ejs");
  // }

  // res.cookie("hash", hash);
  // res.cookie("isVoted", false);
  res.render("index.ejs");
});

app.get("/get-all", (req, res) => {
  const all = db.prepare(`SELECT * from votes`).all();
  res.status(200).json({ all });
});

const options = ["1", "2", "3"];

app.post("/version", (req, res) => {
  res.cookie("isVoted", true);

  const { version } = req.body;
  if (!options.includes(version)) {
    return res.redirect("/404");
  }

  db.prepare(`INSERT INTO votes (version) VALUES (?)`).run(version);

  res.status(200).json({ message: "" });
});

app.get("/poll", (req, res) => {
  const counts = [];

  const todaysRes = db.prepare(`SELECT * FROM votes`).all();

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
