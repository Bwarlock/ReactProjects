import { configureStore } from "@reduxjs/toolkit";
import ProductReducer from "./productSlice";
import { productRTK } from "./productRTK";
import cartReducer from "./cartSlice.ts";

const store = configureStore({
	reducer: {
		products: ProductReducer,
		cart: cartReducer,
		[productRTK.reducerPath]: productRTK.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(productRTK.middleware),
});

export default store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
