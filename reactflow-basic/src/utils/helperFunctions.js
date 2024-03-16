import * as Dagre from "@dagrejs/dagre";
import { nodeWidth, nodeHeight } from "../slices/reactflowSlice";
import { stratify, tree } from "d3-hierarchy";

const dagreGraph = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
//Dagre has some edge optimization that makes graph inconsistent in same rank , node 1 2 3 in same rank might appear as 2 1 3
export const getDagreLayout = (nodes, edges) => {
	dagreGraph.setGraph({ rankdir: "TB" });
	edges.forEach((edge) => dagreGraph.setEdge(edge.source, edge.target));
	nodes.forEach((node) => dagreGraph.setNode(node.id, node));

	Dagre.layout(dagreGraph);

	return {
		nodes: nodes.map((node) => {
			let { x, y } = dagreGraph.node(node.id);
			x = x - nodeWidth / 2;
			y = y - nodeHeight / 2;
			return {
				...node,
				position: { x, y },
				x,
				y,
			};
		}),
		edges,
	};
};

const dTree = tree();

export const getDTreeLayout = (nodes, edges) => {
	if (nodes.length === 0) return { nodes, edges };

	const hierarchy = stratify()
		.id((node) => node.id)
		.parentId((node) => edges.find((edge) => edge.target === node.id)?.source);
	const root = hierarchy(nodes);
	const layout = dTree
		.nodeSize([nodeWidth * 2, nodeHeight * 2])
		.separation(() => 0.75)(root);

	return {
		nodes: layout
			.descendants()
			.map((node) => ({ ...node.data, position: { x: node.x, y: node.y } })),
		edges,
	};
};
