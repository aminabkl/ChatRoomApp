const { Server } = require("socket.io");
const User = require("./models/user");

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
			socket.on("user-connect", async (data) => {
				const { userId } = data;
				if (Array.isArray(userId)) {
					try {
						const users = await User.find({ _id: { $in: userId } });
						const usernames = users.map((user) => user.username);
						io.emit("online-users", { usernames });
						console.log(usernames);
					} catch (error) {
						console.error("Error fetching usernames:", error);
					}
				}
			});

			socket.on("disconnect", () => {
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
