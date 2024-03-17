import { memo, useEffect } from "react";
import { Handle, Position, useReactFlow } from "reactflow";
// import { PropTypes } from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
	addChildNode,
	deleteNode,
	layoutNodes,
	onNodesDelete,
	startingNodeId,
} from "../slices/reactflowSlice";
import { AnimatePresence, motion } from "framer-motion";

const DefaultNode = memo(function Defaultnode(nodeData) {
	const { deleteElements } = useReactFlow();

	const { deleteVisible } = useSelector((state) => state.reactflow);
	const dispatch = useDispatch();
	useEffect(() => {
		// console.log(nodeData);
	}, []);
	const handleAddNode = () => {
		dispatch(addChildNode(nodeData));
	};
	const handleDeleteNode = () => {
		// deleteElements({ nodes: [nodeData] });
		// Dont Know if Below Approach is better tbh
		dispatch(deleteNode(nodeData));
		dispatch(onNodesDelete([nodeData]));
		dispatch(layoutNodes("d3"));
	};
	return (
		<AnimatePresence>
			<Handle
				type="target"
				position={Position.Top}
				style={{ background: "#555" }}
				key={"target"}
			/>
			<span key={"content"} className="defaultnode-content">
				{nodeData.data.label}
			</span>
			{nodeData.id != startingNodeId && deleteVisible && (
				<button
					key={"deleteButton"}
					className="defaultnode-deleteButton"
					onClick={handleDeleteNode}>
					Delete
				</button>
			)}
			{nodeData.selected && (
				<motion.button
					className="defaultnode-addButton"
					key={"addButton"}
					onClick={handleAddNode}
					initial={{ right: 14, opacity: 0 }}
					animate={{ right: -14, opacity: 1 }}
					exit={{ top: 14, opacity: 0 }}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="black">
						<path
							fillRule="evenodd"
							d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
							clipRule="evenodd"
						/>
					</svg>
				</motion.button>
			)}
			<Handle
				type="source"
				position={Position.Bottom}
				style={{ background: "#555" }}
				key={"source"}
			/>
		</AnimatePresence>
	);
});
// DefaultNode.propTypes = {
// 	id: PropTypes.string,
// 	data: PropTypes.object,
// 	style: PropTypes.object,
// 	selected: PropTypes.bool,
// 	position: PropTypes.object,
// };

export default DefaultNode;
