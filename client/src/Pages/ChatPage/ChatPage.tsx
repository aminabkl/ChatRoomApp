import { useEffect, useRef, useState } from "react";
import moment from "moment";
import { io } from "socket.io-client";
import axios from "axios";
import "./ChatPage.css";
import Cookies from "js-cookie";

interface ChatRoomProps {}

interface ChatMessageObserver {
	update: (isOwnMessage: boolean, data: any) => void;
}

const ChatRoom: React.FC<ChatRoomProps> = () => {
	const [socket, setSocket] = useState<any>(null);
	const [nbrClient, setNbrClient] = useState("");
	const [nameInput, setNameInput] = useState("");
	const [messageInput, setMessageInput] = useState("");
	const [observateurs, setObservateurs] = useState<ChatMessageObserver[]>([]);
	const userid = Cookies.get("userId"); // Add this line

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

		// Notifier les observateurs
		observateurs.forEach((observateur) => {
			observateur.update(isOwnMessage, data);
		});
	};

	const scrollToBottom = () => {
		const messageContainer = document.getElementById("message-container");
		messageContainer?.scroll(0, messageContainer.scrollHeight);
	};

	const registerObserver = (observateur: ChatMessageObserver) => {
		setObservateurs((anciensObservateurs) => [
			...anciensObservateurs,
			observateur,
		]);
	};

	const socketInstanceRef = useRef<any>(null);
	const observateurRef = useRef<ChatMessageObserver>({
		update: (isOwnMessage: boolean, data: any) => {
			// displayMessage(isOwnMessage, data);
		},
	});

	useEffect(() => {
		socketInstanceRef.current = io("http://localhost:8000");
		setSocket(socketInstanceRef.current);

		registerObserver(observateurRef.current);

		return () => {
			setObservateurs((anciensObservateurs) =>
				anciensObservateurs.filter((o) => o !== observateurRef.current)
			);

			socketInstanceRef.current.disconnect();
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
		}
	}, [socket]);

	useEffect(() => {
		if (userid) {
			const fetchUsername = async () => {
				try {
					const response = await axios.get(
						`http://localhost:8000/api/user/${userid}`
					);
					const { username } = response.data;
					setNameInput(username);
				} catch (error) {
					console.error("Failed to fetch username:", error);
				}
			};

			fetchUsername();
		}
	}, [userid]);

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
							defaultValue={nameInput}
							maxLength={20}
						/>
					</span>
				</div>
				<ul className="message-container" id="message-container"></ul>
				<form className="message-form" id="message-form" onSubmit={sendMessage}>
					<input
						type="text"
						className="message-input"
						id="message-input"
						name="message"
						value={messageInput}
						onChange={(e) => setMessageInput(e.target.value)}
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
