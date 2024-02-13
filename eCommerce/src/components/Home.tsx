import { Link } from "react-router-dom";
import { useGetAllProductsQuery } from "../slices/productRTK";
import { useDispatch } from "react-redux";
import { addToCart, getTotals } from "../slices/cartSlice";
import { product } from "../utils/interfaces";
import "../styles/Home.css";

function Home() {
	const { data, isLoading } = useGetAllProductsQuery();
	const dispatch = useDispatch();
	// const navigate = useNavigate();

	const handleAddToCart = (product: product) => {
		dispatch(addToCart(product));
		dispatch(getTotals());
		// navigate("/cart");
	};
	return (
		<div className="home">
			{isLoading ? (
				<span className="loader"></span>
			) : (
				// <span className="loader"></span>
				<>
					<h2>New Arrivals</h2>
					<div className="productS">
						{(
							data as {
								products: product[];
								total: number;
								skip: number;
								limit: number;
							}
						).products
							.slice(0, 4)
							.map((product) => {
								return (
									<div className="product" key={product.id}>
										<Link to={`/product/${product.id}`}>
											<h3>{product.title}</h3>
										</Link>
										<img src={product.thumbnail} alt={product.title} />
										<div className="details">
											<span className="desc">
												{product.description.substring(0, 60) + " . . ."}
											</span>
											<span className="price">${product.price}</span>
										</div>
										<button
											onClick={() => {
												handleAddToCart(product);
											}}
											type="button"
											className="add-to-cart">
											Add To Cart
										</button>
									</div>
								);
							})}
					</div>
				</>
			)}
		</div>
	);
}

export default Home;
