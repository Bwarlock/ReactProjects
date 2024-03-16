import { createSlice } from "@reduxjs/toolkit";
import { addEdge, applyNodeChanges, applyEdgeChanges } from "reactflow";
import { getDagreLayout, getDTreeLayout } from "../utils/helperFunctions";

export const nodeWidth = 150;
export const nodeHeight = 35;
export const layoutYAddition = 70;

export const initialNodes = [
	{
		id: "1",
		selected: true,
		data: { label: "Node 1" },
		position: { x: 0, y: 0 },
		x: 0,
		y: 0,
		type: "defaultnode",
		style: { backgroundColor: "#aaaaaa" },
	},
	{
		id: "2",
		selected: false,
		data: { label: "Node 2" },
		position: { x: 0, y: 70 },
		x: 0,
		y: 70,
		type: "defaultnode",
		style: { backgroundColor: "#aaaaaa" },
	},
];

export const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

const initialState = {
	nodes: initialNodes,
	edges: initialEdges,
	idCount: 3,
	selectedNodeId: initialNodes[0].id,
	nodeName: initialNodes[0].data.label,
	nodeBg: initialNodes[0].style.backgroundColor,
	nodeHidden: false,
};

const reactflowSlice = createSlice({
	name: "reactflowState",
	initialState: initialState,
	reducers: {
		onNodesChange: (state, changes) => {
			state.nodes = applyNodeChanges(changes.payload, state.nodes);
		},
		onEdgesChange: (state, changes) => {
			state.edges = applyEdgeChanges(changes.payload, state.edges);
		},
		onConnect: (state, connection) => {
			state.edges = addEdge(connection.payload, state.edges);
		},
		setNodes: (state, nodes) => {
			state.nodes = nodes.payload;
		},
		setEdges: (state, edges) => {
			state.edges = edges.payload;
		},
		addNodes: (state, action) => {
			const nodes = Array.isArray(action.payload)
				? action.payload
				: [action.payload];
			state.nodes = [...state.nodes, ...nodes];
		},
		addEdges: (state, action) => {
			const edges = Array.isArray(action.payload)
				? action.payload
				: [action.payload];
			state.edges = [...state.edges, ...edges];
		},
		addChildNode: (state, action) => {
			const newNodes = [
				...state.nodes,
				{
					id: `${state.idCount}`,
					selected: false,
					data: { label: `Node ${state.idCount}` },
					position: {
						x: action.payload.xPos,
						y: action.payload.yPos + layoutYAddition,
					},
					type: "defaultnode",
					style: { backgroundColor: "#aaaaaa" },
					width: nodeWidth,
					height: nodeHeight,
				},
			];
			const newEdges = [
				...state.edges,
				{
					id: `e${action.payload.id}-${state.idCount}`,
					source: action.payload.id,
					target: `${state.idCount}`,
				},
			];

			const layouted = getDTreeLayout(newNodes, newEdges);
			state.idCount = state.idCount + 1;
			state.nodes = layouted.nodes;
			state.edges = layouted.edges;
		},
		layoutNodes: (state, action) => {
			let layouted;
			if (action.payload == "dagre") {
				layouted = getDagreLayout([...state.nodes], [...state.edges]);
			} else if (action.payload == "d3") {
				layouted = getDTreeLayout([...state.nodes], [...state.edges]);
			}

			state.nodes = layouted.nodes;
			state.edges = layouted.edges;
		},
		setNodeName: (state, action) => {
			state.nodeName = action.payload;
		},
		setNodeBg: (state, action) => {
			state.nodeBg = action.payload;
		},
		updateNodes: (state) => {
			const newNodes = state.nodes.map((node) => {
				if (node.id === state.selectedNodeId) {
					return {
						...node,
						data: {
							...node.data,
							label: state.nodeName,
						},
						style: {
							...node.style,
							backgroundColor: state.nodeBg,
						},
					};
				}
				return node;
			});
			state.nodes = newNodes;
		},
		setNodeHidden: (state, action) => {
			const newNodes = state.nodes.map((node) => {
				if (node.id === state.selectedNodeId) {
					return { ...node, hidden: action.payload };
				}
				return node;
			});
			const newEdges = state.edges.map((edge) => {
				if (
					edge.source === state.selectedNodeId ||
					edge.target === state.selectedNodeId
				) {
					return { ...edge, hidden: action.payload };
				}
				return edge;
			});
			state.nodes = newNodes;
			state.edges = newEdges;
			state.nodeHidden = action.payload;
		},
		setSelectedNodeId: (state, action) => {
			const newNodes = state.nodes.map((node) => {
				if (node.id == action.payload) {
					return {
						...node,
						selected: true,
					};
				}
				if (node.selected) {
					return {
						...node,
						selected: false,
					};
				}
				return node;
			});
			state.nodes = newNodes;
			state.selectedNodeId = action.payload;
		},
	},
});
export const {
	onNodesChange,
	onEdgesChange,
	onConnect,
	setNodes,
	setEdges,
	addNodes,
	addEdges,
	addChildNode,
	setNodeBg,
	setNodeName,
	setNodeHidden,
	setSelectedNodeId,
	updateNodes,
	layoutNodes,
} = reactflowSlice.actions;
export default reactflowSlice.reducer;
