const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const Document = require("./models/Document");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:"http://localhost:3000"
    }
});

io.on("connection",(socket)=>{
    console.log("User Connected");

    socket.on("send-changes",(data)=>{
        socket.broadcast.emit("receive-changes",data);
    });
});
app.post("/save", async (req, res) => {
  try {
    const { title, content } = req.body;

    const doc = new Document({
      title,
      content
    });

    await doc.save();

    res.json({ message: "Document Saved" });
  } catch (err) {
    res.status(500).json(err);
  }
});
server.listen(process.env.PORT,()=>{
    console.log("Server Running");
});