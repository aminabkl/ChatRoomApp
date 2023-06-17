const { Server } = require("socket.io");
const User = require("./models/user"); // Assuming you have a User model

function initializeSocket(server) {
	const io = new Server(server, {
		cors: {
			origin: "http://localhost:3000",
			methods: ["GET", "POST"],
			credentials: true,
		},
	});

		let socketsConnected = new Set();

	io.on("connection", async (socket) => {
		try {
			console.log("CON => ", socket.id);
			socketsConnected.add(socket.id);

			io.emit("client-total", socketsConnected.size);

			socket.on("disconnect", () => {
				console.log("DISCON => ", socket.id);
				socketsConnected.delete(socket.id);
				io.emit("client-total", socketsConnected.size);
			});

			socket.on("message", (data) => {
				socket.broadcast.emit("chat-message", data);
			});

			socket.on("feedback", (data) => {
				socket.broadcast.emit("feedback", data);
			});
		} catch (error) {
			console.error("Error fetching user:", error);
		}
	});
}

module.exports = initializeSocket;
