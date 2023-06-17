import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css";
import { Provider } from 'react-redux';
import Join from "./Pages/join/join";
import Login from "./Pages/login/login";
import EmailVerify from "./Pages/emailVerification/emailVerification";
import ChatRoom from "./Pages/ChatPage/ChatPage";

import { store } from './app/store';


function App() {
	return (
	  <Provider store={store}>
		<Router>
		  <div className="App">
			<Routes>
			  <Route path="/join" element={<Join />} />
			  <Route path="/:id/verify/:emailToken" element={<EmailVerify />} />
			  <Route path="/signin" element={<Login />} />
			  <Route path="/" element={<ChatRoom />} />

  
			  {/* ... autres routes */}
			</Routes>
		  </div>
		</Router>
	  </Provider>
	);
  }
  

export default App;
