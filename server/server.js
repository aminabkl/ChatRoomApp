// const express = require("express");
// const http = require("http");
// const cors = require("cors");
// const WebSocket = require("ws");

// const port = 6969;
// const app = express();
// app.use(cors());
// const server = http.createServer(app);
// const WebSocketServer = new WebSocket.Server({ server });

// WebSocketServer.on("headers", (headers, request) => {
// 	headers.push("Access-Control-Allow-Origin: *");
// 	headers.push(
// 		"Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept"
// 	);
// });

// WebSocketServer.on("connection", function connection(ws) {
// 	ws.on("message", function incoming(data) {
// 		WebSocketServer.clients.forEach(function each(client) {
// 			if (client !== ws && client.readyState === WebSocket.OPEN) {
// 				client.send(data);
// 			}
// 		});
// 	});
// });

// server.listen(port, function () {
// 	console.log(`Server is listening on ${port}!`);
// });

const WebSocket = require("ws");
const http = require("http");

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
	ws.on("message", (message) => {
		wss.clients.forEach((client) => {
			if (client !== ws && client.readyState === WebSocket.OPEN) {
				client.send(message);
			}
		});
	});
});

server.listen(8080, () => {
	console.log("Server started on port 8080");
});
