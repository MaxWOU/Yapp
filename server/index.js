const express = require("express")
const app = express()
const cors = require("cors")
const socket = require("socket.io")


app.use(cors());
app.use(express.json()); //this will allow us to communicate between front/backend

const server = app.listen(3000, () => {
    console.log("server runnin on port 3000");
});

io = socket(server);

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log("User Joined Room: " + data);
  });

  socket.on("send_message", (data) => {
    console.log(data);
    socket.to(data.room).emit("receive_message", data.content);
  });

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED");
  });
});
