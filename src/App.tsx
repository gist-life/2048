import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import { produce } from "immer";
import { throttle } from "lodash";
import { darken } from "polished";

const size = 4; // 4x4 그리드
const keys: number[] = [];

class TTile {
    key: number;
    value: number;
    row: number;
    col: number;
    isNew?: boolean = false;

    constructor(key: number, value: number, row: number, col: number, isNew?: boolean) {
        this.key = key;
        this.value = value;
        this.row = row;
        this.col = col;
        this.isNew = isNew;

        keys.push(this.key);
    }

    double(): TTile {
        return new TTile(this.key, this.value * 2, this.row, this.col, this.isNew);
    }

    moveTo(row: number, col: number, key?: number): TTile {
        return new TTile(key == null ? this.key : key, this.value, row, col, this.isNew);
    }
}

const GridWrapper = styled.div`
	width: 80vmin;
	height: 80vmin;
	position: relative;
	display: grid;
	grid-template-columns: repeat(${size}, 1fr);
	grid-template-rows: repeat(${size}, 1fr);
	gap: 8px;
	background-color: #ccc;
	border-color: #ccc;
	border-radius: 12px;
	border-width: 8px;
`;

const BackgroundTile = styled.div`
	background-color: #eee;
	border-radius: 8px;
	width: 100%;
	height: 100%;
`;

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

const TileStyle = styled.div<{ x: number; y: number, value: number, isNew?: boolean }>`
	position: absolute;
	width: calc((100% - ${(size - 1) * 8}px) / ${size});
	height: calc((100% - ${(size - 1) * 8}px) / ${size});
	transform: translate(${({ x }) => x}px, ${({ y }) => y}px)
            scale(${({ isNew }) => isNew ? 0 : 1});
	transition: ${({ isNew }) => isNew
            ? 'none'
            : 'transform 0.3s ease, opacity 0.3s ease'};
	background-color: ${props => getColor(props.value).bgColor};
	color: ${props => getColor(props.value).textColor};
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 600;

	// todo: cellSize 사용해서
	font-size: ${props => `${Math.max(0, 3 - 0.3 * Math.max(0, props.value.toString().length - 4))}vw`};
	border-radius: 8px;
`;

function Tile({ x, y, value, isNew }: { x: number; y: number; value: number, isNew?: boolean }) {
    const [isNewLocal, setIsNewLocal] = useState(isNew);

    useEffect(() => {
        if (isNewLocal) {
            requestAnimationFrame(() => {
                setIsNewLocal(false);
            });
        }
    }, [isNewLocal]);

    return (
        <TileStyle x={x} y={y} value={value} isNew={isNewLocal}>
            {value}
        </TileStyle>
    );
}

type Direction = "move_up" | "move_down" | "move_left" | "move_right";

function createMoreTile(grid: (TTile | null)[][]) {
    while (true) {
        const choice = Math.floor(Math.random() * (size * size));
        const i = Math.floor(choice / size);
        const j = choice % size;

        if (grid[i][j] == null) {
            // const newKey = Math.max(...grid.flat().filter(t => t != null).map(t => t.key)) + 1;

            return produce(grid, draft => {
                draft[i][j] = new TTile(Math.max(...keys) + 1, 2, i, j, true);
            });
        }
    }
}

// function double(tile: TTile) {
//     return new TTile()
// }
//
// function moveTo(tile: Tile, row: number, col: number, key: number = tile.key) {
//     return produce(tile, draft => {
//         draft.key = key;
//         draft.row = row;
//         draft.col = col;
//     });
// }

// todo: for 로 할 필요 없이 lastValue로 하면 됨
function moveTiles(grid: (TTile | null)[][], direction: Direction) {
    const newGrid: (TTile | null)[][] = Array.from({ length: size }, () => Array.from({ length: size }, () => null));
    let isMoved = false;

    console.log(grid);

    switch (direction) {
        case "move_up": {
            for (let col = 0; col < size; col++) {
                let cnt = 0;

                for (let row = 0; row < size; row++) {
                    if (grid[row][col] == null)
                        continue;

                    cnt += 1;

                    let isMerged = false;
                    for (let r = cnt - 2; r >= 0; r--) {
                        if (newGrid[r][col] == null)
                            continue;

                        if (newGrid[r][col]!.value === grid[row][col]!.value) {
                            newGrid[r][col] = grid[row][col]!.double().moveTo(r, col, newGrid[r][col]!.key);
                            isMoved = true;
                            isMerged = true;
                            cnt -= 1;

                            break;
                        }
                        else {
                            break;
                        }
                    }

                    if (!isMerged) {
                        newGrid[cnt - 1][col] = grid[row][col]!.moveTo(cnt - 1, col);
                        if (cnt - 1 !== row)
                            isMoved = true;
                    }
                }
            }
            break;
        }
        case "move_down": {
            for (let col = 0; col < size; col++) {
                let cnt = 0;

                for (let row = size - 1; row >= 0; row--) {
                    if (grid[row][col] == null)
                        continue;

                    cnt += 1;

                    let isMerged = false;
                    for (let r = size - cnt + 1; r < size; r++) {
                        if (newGrid[r][col] == null)
                            continue;

                        if (newGrid[r][col]!.value === grid[row][col]!.value) {
                            newGrid[r][col] = grid[row][col]!.double().moveTo(r, col, newGrid[r][col]!.key);
                            isMoved = true;
                            isMerged = true;
                            cnt -= 1;

                            break;
                        }
                        else {
                            break;
                        }
                    }

                    if (!isMerged) {
                        newGrid[size - cnt][col] = grid[row][col]!.moveTo(size - cnt, col);
                        if (size - cnt !== row)
                            isMoved = true;
                    }
                }
            }
            break;
        }
        case "move_left": {
            for (let row = 0; row < size; row++) {
                let cnt = 0;

                for (let col = 0; col < size; col++) {
                    if (grid[row][col] == null)
                        continue;

                    cnt += 1;

                    let isMerged = false;
                    for (let c = cnt - 2; c >= 0; c--) {
                        if (newGrid[row][c] == null)
                            continue;

                        if (newGrid[row][c]!.value === grid[row][col]!.value) {
                            newGrid[row][c] = grid[row][col]!.double().moveTo(row, c, newGrid[row][c]!.key);
                            isMoved = true;
                            isMerged = true;
                            cnt -= 1;

                            break;
                        }
                        else {
                            break;
                        }
                    }

                    if (!isMerged) {
                        newGrid[row][cnt - 1] = grid[row][col]!.moveTo(row, cnt - 1);
                        if (cnt - 1 !== col)
                            isMoved = true;
                    }
                }
            }
            break;
        }
        case "move_right": {
            for (let row = 0; row < size; row++) {
                let cnt = 0;

                for (let col = size - 1; col >= 0; col--) {
                    if (grid[row][col] == null)
                        continue;

                    cnt += 1;

                    let isMerged = false;
                    for (let c = size - cnt + 1; c < size; c++) {
                        if (newGrid[row][c] == null)
                            continue;

                        if (newGrid[row][c]!.value === grid[row][col]!.value) {
                            newGrid[row][c] = grid[row][col]!.double().moveTo(row, c, newGrid[row][c]!.key);
                            isMoved = true;
                            isMerged = true;
                            cnt -= 1;

                            break;
                        }
                        else {
                            break;
                        }
                    }

                    if (!isMerged) {
                        newGrid[row][size - cnt] = grid[row][col]!.moveTo(row, size - cnt);
                        if (size - cnt !== col)
                            isMoved = true;
                    }
                }
            }
            break;
        }
    }

    return isMoved ? createMoreTile(newGrid) : grid;
}

const App: React.FC = () => {
    const initialGrid: (TTile | null)[][] = Array.from({ length: size }, () => Array.from({ length: size }, () => null));
    initialGrid[0][0] = new TTile(0, 2, 0, 0); //{ key: 0, value: 2, row: 0, col: 0 };
    initialGrid[1][1] = new TTile(1, 2, 1, 1); //{ key: 1, value: 2, row: 1, col: 1 };

    const [ grid, setGrid ] = useState(initialGrid);
    const [ cellSize, setCellSize ] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            const entry = entries[0];
            if (entry) {
                const width = entry.contentRect.width;
                setCellSize((width - (size - 1) * 8) / size);
            }
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    const moveTile = useCallback<(_: Direction) => void>(
        throttle((direction: Direction) => setGrid(moveTiles(grid, direction)), 350),
        [ grid, setGrid, moveTiles ]
    );

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowUp")
                moveTile("move_up");
            else if (e.key === "ArrowDown")
                moveTile("move_down");
            else if (e.key === "ArrowLeft")
                moveTile("move_left");
            else if (e.key === "ArrowRight")
                moveTile("move_right");
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [ moveTile, grid ]);

    return (
        <div className="w-screen h-screen bg-gray-100 grid place-items-center">
            <GridWrapper ref={containerRef}>
                {[ ...Array(size * size) ].map((_, i) => (
                    <BackgroundTile key={i}/>
                ))}
                {grid.flat().filter(t => t != null).map(tile => (
                    <Tile
                        key={tile.key}
                        x={tile.col * (cellSize + 8)}
                        y={tile.row * (cellSize + 8)}
                        value={tile.value}
                        isNew={tile.isNew}
                    />
                ))}
            </GridWrapper>
        </div>
    );
};

export default App;
