import { Link } from "react-router-dom";
import { useGetAllProductsQuery } from "../slices/productRTK";

function Home() {
	const { data, isLoading } = useGetAllProductsQuery();

	return (
		<div className="home">
			{isLoading ? (
				<span className="loader"></span>
			) : (
				<>
					<h2>New Arrivals</h2>

					<div className="productS">
						{(
							data as {
								products: {
									id: number;
									title: string;
									thumbnail: string;
									description: string;
									price: number;
								}[];
								total: number;
								skip: number;
								limit: number;
							}
						).products
							.slice(0, 3)
							.map((product) => {
								return (
									<div className="product" key={product.id}>
										<Link to="/cart">
											<h3>{product.title}</h3>
										</Link>
										<img src={product.thumbnail} alt={product.title} />
										<div className="details">
											<span className="desc">
												{product.description.substring(0, 60) + " . . ."}
											</span>
											<span className="price">${product.price}</span>
										</div>
										<button type="button" className="add-to-cart">
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
