import React from "react";
import ReactDOM from "react-dom/client";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import App from "./App.tsx";
import "./index.css";

import "@fontsource/poppins";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

import ProductReducer, { productsFetch } from "./slices/productSlice";
import { productRTK } from "./slices/productRTK";

const store = configureStore({
	reducer: {
		products: ProductReducer,
		[productRTK.reducerPath]: productRTK.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(productRTK.middleware),
});

store.dispatch(productsFetch());

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>
);
