import React, { useEffect, useState } from "react";
import "./ChatPage.css";

const ChatRoom: React.FC = () => {
	/*
	const [messages, setMessages] = useState<string[]>([]);
	const [messageInput, setMessageInput] = useState("");

	useEffect(() => {
		const socket = new WebSocket("ws://localhost:8080");

		socket.onmessage = (event) => {
			const fileReader = new FileReader();
			fileReader.onload = () => {
				const message = fileReader.result as string;
				setMessages((prevMessages) => [...prevMessages, message]);
			};
			fileReader.readAsText(event.data);
		};

		return () => {
			socket.close();
		};
	}, []);

	const sendMessage = () => {
		const socket = new WebSocket("ws://localhost:8080");
		socket.onopen = () => {
			socket.send(messageInput);
			socket.close();
		};
		setMessageInput("");
	};
	*/

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
							value="anonymous"
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
					Totat clients: 2
				</h3>
			</div>
		</>
	);
};

export default ChatRoom;
