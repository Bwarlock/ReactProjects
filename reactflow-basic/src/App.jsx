import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
	useNodesState,
	useEdgesState,
	Background,
	Panel,
	Controls,
	BackgroundVariant,
	addEdge,
	MiniMap,
} from "reactflow";
import {
	initialNodes,
	initialEdges,
	layoutNodes,
} from "./slices/reactflowSlice";
import { useDispatch, useSelector } from "react-redux";
import {
	onNodesChange,
	onEdgesChange,
	onConnect,
	setNodes,
	setEdges,
	setNodeBg,
	setNodeName,
	setNodeHidden,
	setSelectedNodeId,
	updateNodes,
} from "./slices/reactflowSlice";

import "reactflow/dist/style.css";
import "./styles/App.css";
import DefaultNode from "./components/defaultNode";

const defaultViewport = { x: 0, y: 0, zoom: 1.5 };
const connectionLineStyle = { stroke: "#000" };
const nodeTypes = {
	defaultnode: DefaultNode,
};

function App() {
	// WITH REDUX
	const { nodes, edges, nodeName, nodeBg, nodeHidden } = useSelector(
		(state) => state.reactflow
	);
	const dispatch = useDispatch();

	//WITHOUT REDUX
	// const [nodeName, setNodeName] = useState(initialNodes[0].data.label);
	// const [nodeBg, setNodeBg] = useState(initialNodes[0].style.backgroundColor);
	// const [nodeHidden, setNodeHidden] = useState(false);

	// const [selectedNodeId, setSelectedNodeId] = useState(initialNodes[0].id);
	// const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	// const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
	// useEffect(() => {
	// 	setNodes((nodes) =>
	// 		nodes.map((node) => {
	// 			if (node.id === selectedNodeId) {
	// 				// it's important that you create a new object here
	// 				// in order to notify react flow about the change
	// 				return {
	// 					...node,
	// 					data: {
	// 						...node.data,
	// 						label: nodeName,
	// 					},
	// 				};
	// 			}
	// 			return node;
	// 		})
	// 	);
	// }, [nodeName]);

	// useEffect(() => {
	// 	setNodes((nodes) =>
	// 		nodes.map((node) => {
	// 			if (node.id === selectedNodeId) {
	// 				// it's important that you create a new object here
	// 				// in order to notify react flow about the change
	// 				return {
	// 					...node,
	// 					style: {
	// 						...node.style,
	// 						backgroundColor: nodeBg,
	// 					},
	// 				};
	// 			}

	// 			return node;
	// 		})
	// 	);
	// }, [nodeBg]);

	// useEffect(() => {
	// 	setNodes((nodes) =>
	// 		nodes.map((node) => {
	// 			if (node.id === selectedNodeId) {
	// 				// when you update a simple type you can just update the value
	// 				return { ...node, hidden: nodeHidden };
	// 			}
	// 			return node;
	// 		})
	// 	);
	// 	setEdges((edges) =>
	// 		edges.map((edge) => {
	// 			if (edge.source === selectedNodeId || edge.target === selectedNodeId) {
	// 				return { ...edge, hidden: nodeHidden };
	// 			}
	// 			return edge;
	// 		})
	// 	);
	// }, [nodeHidden]);

	// const onConnect = useCallback(
	// 	(params) => setEdges((eds) => addEdge(params, eds)),
	// 	[setEdges]
	// );
	const handleNodeClick = (e, node) => {
		dispatch(setSelectedNodeId(node.id));
		dispatch(setNodeName(node.data.label));
		dispatch(setNodeBg(node.style.backgroundColor));
	};

	return (
		<>
			<div className="reactflow-container">
				<ReactFlow
					nodes={nodes}
					edges={edges}
					nodeTypes={nodeTypes}
					onNodesChange={(evt) => dispatch(onNodesChange(evt))}
					onEdgesChange={(evt) => dispatch(onEdgesChange(evt))}
					defaultViewport={defaultViewport}
					onConnect={(evt) => dispatch(onConnect(evt))}
					minZoom={0.4}
					maxZoom={4}
					snapToGrid={true}
					snapGrid={[20, 20]}
					onNodeClick={handleNodeClick}
					connectionLineStyle={connectionLineStyle}>
					<Panel position="top-right">
						<div className="updatenode__controls">
							<div className="updatenode__label">
								<label>label</label>
								<input
									type="text"
									value={nodeName}
									onChange={(evt) => {
										dispatch(setNodeName(evt.target.value));
										dispatch(updateNodes());
									}}
								/>
							</div>
							<div className="updatenode__background">
								<label>background</label>
								<div className="flex-align">
									<input
										className="updatenode__bg__text"
										type="text"
										value={nodeBg}
										onChange={(evt) => {
											dispatch(setNodeBg(evt.target.value));
											dispatch(updateNodes());
										}}
									/>
									<input
										type="color"
										onChange={(evt) => {
											dispatch(setNodeBg(evt.target.value));
											dispatch(updateNodes());
										}}
										value={nodeBg}
									/>
								</div>
							</div>

							<div className="updatenode__checkboxwrapper">
								<label>hidden</label>
								<input
									type="checkbox"
									checked={nodeHidden}
									onChange={(evt) => {
										dispatch(setNodeHidden(evt.target.checked));
									}}
								/>
							</div>
							<button onClick={() => dispatch(layoutNodes("dagre"))}>
								Dagre Layout
							</button>
							<button onClick={() => dispatch(layoutNodes("d3"))}>
								D3 Layout
							</button>
						</div>
					</Panel>
					<Controls position="bottom-left" />
					<Background color="#444" variant={BackgroundVariant.Dots} />
					<MiniMap
						position="bottom-right"
						zoomable={true}
						pannable={true}
						nodeColor={miniMapNodeColor}
						nodeStrokeWidth={3}
					/>
				</ReactFlow>
			</div>
		</>
	);
}

function miniMapNodeColor(node) {
	switch (node.selected) {
		case true:
			return "#222222";
		case false:
			return "#e2e2e2";
		default:
			return "#e2e2e2";
	}
}

export default App;
