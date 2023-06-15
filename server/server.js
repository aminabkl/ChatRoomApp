const http = require("http");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
const server = http.createServer(app);
const io = require("socket.io")(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
		credentials: true,
	},
});
const PORT = 8000;

let socketsConnected = new Set();

io.on("connection", onConnected);
function onConnected(socket) {
	console.log("CON => ", socket.id);
	socketsConnected.add(socket.id);

	io.emit("client-total", socketsConnected.size);

	socket.on("disconnect", () => {
		console.log("DISCON => ", socket.id);
		socketsConnected.delete(socket.id);
		io.emit("client-total", socketsConnected.size);
	});
	socket.on("message", (data) => {
		console.log(data);
		socket.broadcast.emit("chat-message", data);
	});
}

server.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
