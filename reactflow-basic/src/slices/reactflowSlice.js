import { createSlice } from "@reduxjs/toolkit";
import {
	addEdge,
	applyNodeChanges,
	applyEdgeChanges,
	MarkerType,
	getIncomers,
	getOutgoers,
	getConnectedEdges,
} from "reactflow";
import { getDagreLayout, getDTreeLayout } from "../utils/helperFunctions";

export const nodeWidth = 150;
export const nodeHeight = 35;
export const layoutYAddition = 70;
export const startingNodeId = "1";

export const initialNodes = [
	{
		id: "1",
		selected: true,
		deletable: false,
		data: { label: "Node 1", rank: 0 },
		position: { x: 0, y: 0 },
		x: 0,
		y: 0,
		type: "defaultnode",
		style: { backgroundColor: "#aaaaaa" },
	},
	{
		id: "2",
		selected: false,
		data: { label: "Node 2", rank: 1 },
		position: { x: 0, y: 70 },
		x: 0,
		y: 70,
		type: "defaultnode",
		style: { backgroundColor: "#aaaaaa" },
	},
];

export const initialEdges = [
	{
		id: "e1-2",
		source: "1",
		target: "2",
		deletable: false,
		markerEnd: {
			type: MarkerType.ArrowClosed,
			width: 20,
			height: 20,
		},
	},
];

const initialState = {
	nodes: initialNodes,
	edges: initialEdges,
	idCount: 3,
	selectedNodeId: initialNodes[0].id,
	nodeName: initialNodes[0].data.label,
	nodeBg: initialNodes[0].style.backgroundColor,
	nodeHidden: false,
	deleteVisible: true,
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
			const newEdge = {
				...connection.payload,
				id: `e${connection.payload.source}-${connection.payload.target}`,
				deletable: true,
				markerEnd: {
					type: MarkerType.ArrowClosed,
					width: 20,
					height: 20,
				},
			};
			state.edges = addEdge(newEdge, state.edges);
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
		deleteNode: (state, action) => {
			state.nodes = state.nodes.filter((node) => node.id !== action.payload.id);
		},
		onNodesDelete: (state, action) => {
			const node = action.payload[0];
			const expandedEdges = [...state.edges];
			const expandedNodes = [...state.nodes];

			const incomers = getIncomers(node, expandedNodes, expandedEdges);
			const outgoers = getOutgoers(node, expandedNodes, expandedEdges).filter(
				(nod) => node.data.rank < nod.data.rank
			);
			const connectedEdges = getConnectedEdges([node], expandedEdges);

			const createdEdges = incomers.flatMap(({ id: sourceVariable }) =>
				outgoers.map(({ id: targetVariable }) => ({
					id: `e${sourceVariable}-${targetVariable}`,
					source: sourceVariable,
					target: targetVariable,
					deletable: false,
					markerEnd: {
						type: MarkerType.ArrowClosed,
						width: 20,
						height: 20,
					},
				}))
			);
			const remainingEdges = state.edges.filter(
				(edge) =>
					connectedEdges.every((edg) => edg.id !== edge.id) &&
					createdEdges.every((edg) => edg.id !== edge.id)
			);

			state.edges = [...remainingEdges, ...createdEdges];
		},
		addChildNode: (state, action) => {
			const newNodes = [
				...state.nodes,
				{
					id: `${state.idCount}`,
					selected: false,
					data: {
						label: `Node ${state.idCount}`,
						rank: action.payload.data.rank + 1,
					},
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
					deletable: false,
					markerEnd: {
						type: MarkerType.ArrowClosed,
						width: 20,
						height: 20,
					},
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
		setDeleteVisible: (state, action) => {
			state.deleteVisible = action.payload;
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
	onNodesDelete,
	deleteNode,
	setDeleteVisible,
} = reactflowSlice.actions;
export default reactflowSlice.reducer;
