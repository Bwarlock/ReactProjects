import { createSlice } from "@reduxjs/toolkit";
import { cartState } from "../utils/interfaces";
import { toast } from "react-toastify";

const initialState: cartState = {
	cartItems: localStorage.getItem("cartItems")
		? JSON.parse(localStorage.getItem("cartItems") as string)
		: [],
	cartTotalQuantity: 0,
	cartTotalAmount: 0,
};

const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		addToCart(state, action) {
			const existingIndex = state.cartItems.findIndex(
				(item) => item.id === action.payload.id
			);

			if (existingIndex >= 0) {
				state.cartItems[existingIndex] = {
					...state.cartItems[existingIndex],
					cartQuantity: state.cartItems[existingIndex].cartQuantity + 1,
				};
				toast.info("Increased product quantity", {
					position: "bottom-left",
				});
			} else {
				const tempProductItem = { ...action.payload, cartQuantity: 1 };
				state.cartItems.push(tempProductItem);
				toast.success("Product added to cart", {
					position: "bottom-left",
				});
			}
			localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
		},
		decreaseCart(state, action) {
			const itemIndex = state.cartItems.findIndex(
				(item) => item.id === action.payload.id
			);

			if (state.cartItems[itemIndex].cartQuantity > 1) {
				state.cartItems[itemIndex].cartQuantity -= 1;

				toast.info("Decreased product quantity", {
					position: "bottom-left",
				});
			} else if (state.cartItems[itemIndex].cartQuantity === 1) {
				//toSpliced is too recent , and splice can't be used on state , spread operator is O(n) == .filter anyways
				const nextCartItems = state.cartItems.filter(
					(item) => item.id !== action.payload.id
				);
				state.cartItems = nextCartItems;

				toast.error("Product removed from cart", {
					position: "bottom-left",
				});
			}

			localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
		},
		removeFromCart(state, action) {
			state.cartItems.map((cartItem) => {
				if (cartItem.id === action.payload.id) {
					const nextCartItems = state.cartItems.filter(
						(item) => item.id !== cartItem.id
					);

					state.cartItems = nextCartItems;

					toast.error("Product removed from cart", {
						position: "bottom-left",
					});
				}
				localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
				return state;
			});
		},
		getTotals(state) {
			const cartTotal = state.cartItems.reduce(
				(cartTotal, cartItem) => {
					const { price, cartQuantity } = cartItem;
					const itemTotal = price * cartQuantity;

					cartTotal.total += itemTotal;
					cartTotal.quantity += cartQuantity;

					return cartTotal;
				},
				{
					total: 0,
					quantity: 0,
				}
			);
			state.cartTotalQuantity = cartTotal.quantity;
			state.cartTotalAmount = parseFloat(cartTotal.total.toFixed(2));
		},
		clearCart(state) {
			state.cartItems = [];
			localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
			toast.error("Cart cleared", { position: "bottom-left" });
		},
	},
});

export const { addToCart, decreaseCart, removeFromCart, getTotals, clearCart } =
	cartSlice.actions;

export default cartSlice.reducer;
