const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
const url = "process.env.MONGO_URI";
const DB_NAME = "video-project";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function getDB() {
  return MongoClient.connect(url).then(client => client.db(DB_NAME));
}
app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Video Library Backend is running 🚀"
  });
});
/* =================== GET CATEGORIES =================== */
app.get("/get-categories", async (req, res) => {
  try {
    const db = await getDB();
    const data = await db.collection("categories").find({}, { projection: { _id: 0 } }).toArray();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

/* =================== GET USERS =================== */
app.get("/get-users", async (req, res) => {
  const db = await getDB();
  const data = await db.collection("tblusers").find({}, { projection: { _id: 0 } }).toArray();
  res.json(data);
});

/* =================== GET ADMIN =================== */
app.get("/get-admin", async (req, res) => {
  const db = await getDB();
  const data = await db.collection("admin").find({}, { projection: { _id: 0 } }).toArray();
  res.json(data);
});

/* =================== GET VIDEOS =================== */
app.get("/get-videos", async (req, res) => {
  const db = await getDB();
  const data = await db.collection("tblvideos").find({}, { projection: { _id: 0 } }).toArray();
  res.json(data);
});

/* =================== GET SINGLE VIDEO =================== */
app.get("/get-video/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const db = await getDB();
  const data = await db.collection("tblvideos").find({ video_id: id }, { projection: { _id: 0 } }).toArray();
  res.json(data);
});

/* =================== REGISTER USER =================== */
app.post("/register-user", async (req, res) => {
  const db = await getDB();
  await db.collection("tblusers").insertOne(req.body);
  res.json({ message: "User Registered Successfully" });
});

/* =================== ADD VIDEO =================== */
app.post("/add-video", async (req, res) => {
  const db = await getDB();
  const video = {
    video_id: parseInt(req.body.video_id),
    title: req.body.title,
    description: req.body.description,
    comments: req.body.comments,
    likes: parseInt(req.body.likes),
    views: parseInt(req.body.views),
    url: req.body.url,
    category_id: parseInt(req.body.category_id)
  };
  await db.collection("tblvideos").insertOne(video);
  res.json({ message: "Video Added Successfully" });
});

/* =================== UPDATE VIDEO =================== */
app.put("/edit-video/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const db = await getDB();
  await db.collection("tblvideos").updateOne({ video_id: id }, { $set: req.body });
  res.json({ message: "Video Updated Successfully" });
});

/* =================== DELETE VIDEO =================== */
app.delete("/delete-video/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const db = await getDB();
  await db.collection("tblvideos").deleteOne({ video_id: id });
  res.json({ message: "Video Deleted Successfully" });
});

// app.listen(5050, () => console.log("🚀 API Running on http://127.0.0.1:5050"));
module.exports = app;
