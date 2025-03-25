import { darken } from "polished";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { gridSize, keys } from "../constants/constants.ts";

export class Tile {
    key: number;
    value: number;
    row: number;
    col: number;
    isNew: boolean = false;
    isMerged: boolean = false;

    constructor(key: number, value: number, row: number, col: number, isNew: boolean = false) {
        this.key = key;
        this.value = value;
        this.row = row;
        this.col = col;
        this.isNew = isNew;

        keys.push(this.key);
    }

    // 이렇게 하면 -3.2 -4.9 같은 타일도 가능
    addValue(tile: Tile) {
        return new Tile(this.key, this.value + tile.value, this.row, this.col, this.isNew);
    }

    moveTo(row: number, col: number, key?: number): Tile {
        return new Tile(key == null ? this.key : key, this.value, row, col, this.isNew);
    }

    merge() {
        this.isMerged = true;
    }
}

function getColor(value: number) {
    const bgColor: string = (() => {
        switch (value) {
            case 2:
                return "#eee4da";
            case 4:
                return "#ede0c8";
            case 8:
                return "#f2b179";
            case 16:
                return "#f59563";
            case 32:
                return "#f67c5f";
            case 64:
                return "#f65e3b";
            default:
                return darken(Math.min(1, Math.round(Math.log2(value) - 7) / 13), "#edcf73");
        }
    })();

    const textColor: string = (() => {
        switch (value) {
            case 2:
            case 4:
                return "#776e65";
            default:
                return "#f9f6f2";
        }
    })();

    return { bgColor, textColor };
}

const TileStyle = styled.div<{ x: number; y: number, value: number, isnew?: boolean, ismerged?: boolean }>`
	position: absolute;
	width: calc((100% - ${(gridSize - 1) * 8}px) / ${gridSize});
	height: calc((100% - ${(gridSize - 1) * 8}px) / ${gridSize});
	transform: translate(${({ x }) => x}px, ${({ y }) => y}px) scale(${({ isnew }) => isnew ? 0 : 1}) scale(${({ ismerged }) => ismerged ? 1.2 : 1});
	transition: ${({ isnew }) => isnew
		? "none"
		: "transform 0.1s ease-in, opacity 0.3s ease"};
	background-color: ${props => getColor(props.value).bgColor};
	color: ${props => getColor(props.value).textColor};
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 600;
    
	font-size: ${props => `${Math.max(0.5, 4 - 0.4 * props.value.toString().length) * 100}%`};
	border-radius: 8px;

	@media (max-width: 768px) {
		font-size: ${props => `${Math.max(0.5, 4 - 0.4 * props.value.toString().length) * 50}%`};
	}
`;

export function TileElement({ x, y, value, isnew, ismerged }: {
    x: number;
    y: number;
    value: number,
    isnew: boolean,
    ismerged: boolean
}) {
    const [ isNewLocal, setIsNewLocal ] = useState(isnew);
    const [ isMergedLocal, setIsMergedLocal ] = useState(ismerged);
    const tileRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (isNewLocal) {
            requestAnimationFrame(() => {
                setIsNewLocal(false);
            });
        }
    }, [ isNewLocal ]);

    useEffect(() => {
        if (isMergedLocal) {
            requestAnimationFrame(() => {
                setIsMergedLocal(false);
            });
        }
    }, [ isMergedLocal ]);

    return (
        <TileStyle ref={tileRef} x={x} y={y} value={value} isnew={isNewLocal} ismerged={isMergedLocal}>
            {value}
        </TileStyle>
    );
}
