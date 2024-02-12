import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { apiPRODCUTS } from "../utils/apiURL.js";

const initialState: {
	items: unknown;
	status: string | null;
} = {
	items: [],
	status: null,
};

export const productsFetch = createAsyncThunk(
	"products/productsFetch",
	async () => {
		try {
			const response = await axios.get(apiPRODCUTS);
			console.log(response?.data);
			return response?.data?.products;
		} catch (error) {
			console.log(error);
		}
	}
);

const productSlice = createSlice({
	name: "productSlice",
	initialState: initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(productsFetch.pending, (state) => {
			state.status = "pending";
		}),
			builder.addCase(productsFetch.fulfilled, (state, action) => {
				state.items = action.payload;
				state.status = "success";
			}),
			builder.addCase(productsFetch.rejected, (state) => {
				state.status = "rejected";
			});
	},
});

productSlice.actions;
export default productSlice.reducer;
