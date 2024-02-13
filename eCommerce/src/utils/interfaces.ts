export interface product {
	id: number;
	title: string;
	thumbnail: string;
	description: string;
	price: number;
}

export interface cartProduct extends product {
	cartQuantity: number;
}

export interface productState {
	items: product[];
	status: string | null;
}

export interface cartState {
	cartItems: cartProduct[];
	cartTotalQuantity: number;
	cartTotalAmount: number;
}
