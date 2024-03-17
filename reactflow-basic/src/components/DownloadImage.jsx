import { toPng } from "html-to-image";
import { useSelector } from "react-redux";
import { getNodesBounds, getViewportForBounds } from "reactflow";

const imageWidth = 1024;
const imageHeight = 768;

function saveImage(dataUrl) {
	const a = document.createElement("a");
	a.setAttribute("download", "reactflow.png");
	a.setAttribute("href", dataUrl);
	a.click();
}

function DownloadImage() {
	const { nodes } = useSelector((state) => state.reactflow);
	const handleClick = () => {
		const nodesBounds = getNodesBounds(nodes);
		const transform = getViewportForBounds(
			nodesBounds,
			imageWidth,
			imageHeight,
			0.5,
			2
		);

		toPng(document.querySelector(".react-flow__viewport"), {
			backgroundColor: "#dddddd",
			width: imageWidth,
			height: imageHeight,
			style: {
				width: imageWidth,
				height: imageHeight,
				transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
			},
		}).then(saveImage);
	};

	return (
		<button className="download-btn" onClick={handleClick}>
			Save Image
		</button>
	);
}

export default DownloadImage;
