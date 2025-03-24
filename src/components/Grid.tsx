import styled from "styled-components";
import { gridSize } from "../constants/constants.ts";

export const Grid = styled.div`
	width: 80vmin;
	height: 80vmin;
	position: relative;
	display: grid;
	grid-template-columns: repeat(${gridSize}, 1fr);
	grid-template-rows: repeat(${gridSize}, 1fr);
	gap: 8px;
	background-color: #bbada0;
	border-color: #bbada0;
	border-radius: 12px;
	border-width: 8px;
`;
