import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import apiBASE from "../utils/apiURL";

//Same As productSlice But Using RTK Query , no extraReducer Declaration problem , But the State Object is Cluttered with default stuff
//Takes more time than Slice's 2 Calls coz of MiddleWare stuff
export const productRTK = createApi({
	reducerPath: "productRTK",
	baseQuery: fetchBaseQuery({ baseUrl: apiBASE }),
	endpoints: (builder) => ({
		getAllProducts: builder.query<unknown, void>({
			query: () => `/products`,
		}),
	}),
});

export const { useGetAllProductsQuery } = productRTK;
