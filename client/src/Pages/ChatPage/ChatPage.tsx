import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./ChatPage.css";

const ChatRoom: React.FC = () => {
	const [nbrClient, setNbrClient] = useState("");
	useEffect(() => {
		const socket = io("http://localhost:8000");
		socket.on("client-total", (data) => {
			setNbrClient(data);
		});
		return () => {
			socket.disconnect();
		};
	}, []);

	return (
		<>
			<h1>iChat 💬</h1>
			<div className="main">
				<div className="name">
					<span>
						<i className="fas fa-user"></i>
						<input
							type="text"
							id="name-input"
							className="name-input"
							defaultValue="anonymous"
							maxLength={20}
						/>
					</span>
				</div>
				<ul className="message-container" id="message-container">
					<li className="message-left">
						<p className="message">
							Hello
							<span>&nbsp;bluebird • 15 June 14:30</span>
						</p>
					</li>
					<li className="message-right">
						<p className="message">
							Lorem ipsum dolor sit, amet consectetur adipisicing elit. Possimus
							facere commodi libero delectus, aut ab! Debitis natus, porro ea
							maxime rerum fugit, necessitatibus et modi nemo molestiae harum
							voluptatibus. Nam?
							<span>&nbsp;bluebird • 15 June 14:30</span>
						</p>
					</li>
					<li className="message-feedback">
						<p className="feedback" id="feedback">
							🎈is typing ...
						</p>
					</li>
				</ul>
				<form className="message-form" id="message-form">
					<input
						type="text"
						className="message-input"
						id="message-input"
						name="message"
					/>
					<div className="v-divid"></div>
					<button type="submit" className="send-button">
						Send
						<span>
							<i className="fas fa-paper-plane"></i>
						</span>
					</button>
				</form>
				<h3 className="client-total" id="client-total">
					Totat clients: {nbrClient}
				</h3>
			</div>
		</>
	);
};

export default ChatRoom;
