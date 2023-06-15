import { useEffect, useRef, useState } from "react";
import moment from "moment";
import { io } from "socket.io-client";
import "./ChatPage.css";

interface ChatRoomProps {}

const ChatRoom: React.FC<ChatRoomProps> = () => {
	const [socket, setSocket] = useState<any>(null);
	const [nbrClient, setNbrClient] = useState("");
	const [nameInput, setNameInput] = useState("");
	const [messageInput, setMessageInput] = useState("");

	// feedback
	// const [typingFeedback, setTypingFeedback] = useState("");
	// const messageInputRef = useRef<HTMLInputElement>(null);

	const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (messageInput === "") return;
		const data = {
			name: nameInput,
			message: messageInput,
			dateTime: new Date(),
		};
		socket.emit("message", data);
		displayMessage(true, data);
		setMessageInput("");
	};

	const displayMessage = (isOwnMessage: boolean, data: any) => {
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
		}
		scrollToBottom();
	};

	const scrollToBottom = () => {
		const messageContainer = document.getElementById("message-container");
		messageContainer?.scroll(0, messageContainer.scrollHeight);
	};

	// feedback
	// event listener
	/*
	useEffect(() => {
		const handleFocus = () => {
			if (socket) {
				socket.emit("feedback", {
					feedback: `✍️ ${nameInput} is typing a message`,
				});
			}
		};

		const handleKeyPress = () => {
			if (socket) {
				socket.emit("feedback", {
					feedback: `✍️ ${nameInput} is typing a message`,
				});
			}
		};

		const handleBlur = () => {
			if (socket) {
				socket.emit("feedback", {
					feedback: "",
				});
			}
		};

		const messageInputField = messageInputRef.current;
		if (messageInputField) {
			messageInputField.addEventListener("focus", handleFocus);
			messageInputField.addEventListener("keypress", handleKeyPress);
			messageInputField.addEventListener("blur", handleBlur);
		}

		return () => {
			if (messageInputField) {
				messageInputField.removeEventListener("focus", handleFocus);
				messageInputField.removeEventListener("keypress", handleKeyPress);
				messageInputField.removeEventListener("blur", handleBlur);
			}
		};
	}, [socket, nameInput]);
	*/

	// Create single instance of socket to stop infinite socket.id
	useEffect(() => {
		const socketInstance = io("http://localhost:8000");
		setSocket(socketInstance);

		return () => {
			socketInstance.disconnect();
		};
	}, []);

	useEffect(() => {
		if (socket) {
			socket.on("client-total", (data: any) => {
				setNbrClient(data);
			});
			socket.on("chat-message", (data: any) => {
				displayMessage(false, data);
			});
			// socket.on("feedback", (data: any) => {
			// 	setTypingFeedback(data.feedback);
			// });
		}
	}, [socket]);

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
							value={nameInput}
							onChange={(e) => setNameInput(e.target.value)}
							maxLength={20}
						/>
					</span>
				</div>
				<ul className="message-container" id="message-container">
					{/* feedback*/}
					{/* {typingFeedback && (
						<li className="message-feedback" id="message-feedback">
							<p className="feedback">{typingFeedback}</p>
						</li>
					)} */}
				</ul>
				<form className="message-form" id="message-form" onSubmit={sendMessage}>
					<input
						type="text"
						className="message-input"
						id="message-input"
						name="message"
						value={messageInput}
						onChange={(e) => setMessageInput(e.target.value)}
						// ref={messageInputRef}
					/>
					<div className="v-divid"></div>
					<button type="submit" className="send-button">
						Send
						<span style={{ paddingLeft: "8px" }}>
							<i className="fas fa-paper-plane"></i>
						</span>
					</button>
				</form>
				<h3 className="client-total" id="client-total">
					Online Users: {nbrClient}
				</h3>
			</div>
		</>
	);
};

export default ChatRoom;
