import { useDispatch, useSelector } from "react-redux";
import {
	setNodeBg,
	setNodeName,
	setNodeHidden,
	updateNodes,
	layoutNodes,
	setDeleteVisible,
} from "../slices/reactflowSlice";
import { Panel } from "reactflow";
import DownloadImage from "./DownloadImage";

function EditPanel() {
	const { nodeName, nodeBg, nodeHidden, deleteVisible } = useSelector(
		(state) => state.reactflow
	);
	const dispatch = useDispatch();
	return (
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
					<label>Delete Btn</label>
					<input
						type="checkbox"
						checked={deleteVisible}
						onChange={(evt) => {
							dispatch(setDeleteVisible(evt.target.checked));
						}}
					/>
				</div>

				<button onClick={() => dispatch(layoutNodes("dagre"))}>
					Dagre Layout
				</button>
				<button onClick={() => dispatch(layoutNodes("d3"))}>D3 Layout</button>
				<DownloadImage />
			</div>
		</Panel>
	);
}

export default EditPanel;
