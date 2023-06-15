import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import moment from "moment";
import "./ChatPage.css";

const ChatPageC: React.FC = () => {
	const [nbrClient, setNbrClient] = useState("");
	const [nameInput, setNameInput] = useState("");
	const [messageInput, setMessageInput] = useState("");

	useEffect(() => {
		const socket = io();
		socket.on("clients-total", (data) => {
			setNbrClient(data);
		});

		socket.on("chat-message", (data) => {
			const messageTone = new Audio("/message-tone.mp3");
			messageTone.play();
			addMessageToUI(false, data);
		});

		socket.on("feedback", (data) => {
			clearFeedback();
			const element = `
		  <li class="message-feedback">
			<p class="feedback" id="feedback">${data.feedback}</p>
		  </li>
		`;
			const messageContainer = document.getElementById("message-container");
			if (messageContainer) {
				messageContainer.innerHTML += element;
			}
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	const addMessageToUI = (isOwnMessage: boolean, data: any) => {
		clearFeedback();
		const element = `
		<li class="${isOwnMessage ? "message-right" : "message-left"}">
		  <p class="message">
			${data.message}
			<span>${data.name} ● ${moment(data.dateTime).fromNow()}</span>
		  </p>
		</li>
	  `;
		const messageContainer = document.getElementById("message-container");
		if (messageContainer) {
			messageContainer.innerHTML += element;
			scrollToBottom();
		}
	};

	const clearFeedback = () => {
		const feedbackElements = document.querySelectorAll("li.message-feedback");
		feedbackElements.forEach((element) => {
			element.parentNode?.removeChild(element);
		});
	};

	const scrollToBottom = () => {
		const messageContainer = document.getElementById("message-container");
		if (messageContainer) {
			messageContainer.scrollTo(0, messageContainer.scrollHeight);
		}
	};

	const sendMessage = () => {
		if (messageInput === "") return;

		const data = {
			name: nameInput,
			message: messageInput,
			dateTime: new Date(),
		};

		const socket = io();
		socket.emit("message", data);
		addMessageToUI(true, data);

		setMessageInput("");
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		sendMessage();
	};

	const handleFocus = () => {
		const socket = io();
		socket.emit("feedback", {
			feedback: `✍️ ${nameInput} is typing a message`,
		});
	};

	const handleKeyPress = () => {
		const socket = io();
		socket.emit("feedback", {
			feedback: `✍️ ${nameInput} is typing a message`,
		});
	};

	const handleBlur = () => {
		const socket = io();
		socket.emit("feedback", {
			feedback: "",
		});
	};

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
							// defaultValue="anonymous"
							maxLength={20}
							value={nameInput}
							onChange={(e) => setNameInput(e.target.value)}
						/>
					</span>
				</div>
				<ul className="message-container" id="message-container">
					{/* Existing messages */}
				</ul>
				<form
					className="message-form"
					id="message-form"
					onSubmit={handleSubmit}
				>
					<input
						type="text"
						className="message-input"
						id="message-input"
						name="message"
						value={messageInput}
						onChange={(e) => setMessageInput(e.target.value)}
						onFocus={handleFocus}
						onKeyPress={handleKeyPress}
						onBlur={handleBlur}
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
					Total clients: {nbrClient}
				</h3>
			</div>
		</>
	);
};
export default ChatPageC;
