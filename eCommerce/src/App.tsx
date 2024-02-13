import "./App.css";
import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Cart from "./components/Cart";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import { ToastContainer } from "react-toastify";

function App() {
	return (
		<>
			<BrowserRouter>
				<ToastContainer />
				<Navbar />
				<main className="main">
					<Routes>
						<Route path="/not-found" element={<NotFound />} />
						<Route path="/cart" element={<Cart />} />
						<Route path="/" element={<Home />} />
						<Route path="*" element={<Navigate to={"/not-found"} replace />} />
					</Routes>
				</main>
			</BrowserRouter>
		</>
	);
}

export default App;
