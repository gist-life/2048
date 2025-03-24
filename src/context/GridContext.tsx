import { produce } from "immer";
import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useState } from "react";
import { Tile } from "../components/Tile.tsx";
import { gridSize, keys } from "../constants/constants.ts";

const initialGrid: (Tile | null)[][] = Array.from({ length: gridSize }, () => Array.from({ length: gridSize }, () => null));
initialGrid[0][0] = new Tile(0, 2, 0, 0);
initialGrid[1][1] = new Tile(1, 2, 1, 1);

const GridContext = createContext<{
    grid: (Tile | null)[][],
    setGrid: Dispatch<SetStateAction<(Tile | null)[][]>>
}>();

export function GridProvider({ children }: PropsWithChildren) {
    const [grid, setGrid] = useState(initialGrid);

    return (
        <GridContext.Provider value={{ grid, setGrid }}>
            {children}
        </GridContext.Provider>
    )
}

export function useGrid() {
    const { grid, setGrid } = useContext(GridContext);
    return [grid, setGrid] as const;
}

export type Direction = "move_up" | "move_down" | "move_left" | "move_right";

export function createMoreTile(grid: (Tile | null)[][]) {
    while (true) {
        const choice = Math.floor(Math.random() * (gridSize * gridSize));
        const i = Math.floor(choice / gridSize);
        const j = choice % gridSize;

        if (grid[i][j] == null) {
            return produce(grid, draft => {
                draft[i][j] = new Tile(Math.max(...keys) + 1, 2, i, j, true);
            });
        }
    }
}

// todo: for 로 할 필요 없이 lastValue로 하면 됨
export function moveTiles(grid: (Tile | null)[][], direction: Direction) {
    const newGrid: (Tile | null)[][] = Array.from({ length: gridSize }, () => Array.from({ length: gridSize }, () => null));
    let isMoved = false;

    switch (direction) {
        case "move_up": {
            for (let col = 0; col < gridSize; col++) {
                let cnt = 0;

                for (let row = 0; row < gridSize; row++) {
                    if (grid[row][col] == null)
                        continue;

                    cnt += 1;

                    let isMerged = false;
                    for (let r = cnt - 2; r >= 0; r--) {
                        if (newGrid[r][col] == null)
                            continue;

                        if (newGrid[r][col]!.value === grid[row][col]!.value && !newGrid[r][col]!.isMerged) {
                            newGrid[r][col] = grid[row][col]!.double().moveTo(r, col, newGrid[r][col]!.key);
                            newGrid[r][col]!.merge();
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
            for (let col = 0; col < gridSize; col++) {
                let cnt = 0;

                for (let row = gridSize - 1; row >= 0; row--) {
                    if (grid[row][col] == null)
                        continue;

                    cnt += 1;

                    let isMerged = false;
                    for (let r = gridSize - cnt + 1; r < gridSize; r++) {
                        if (newGrid[r][col] == null)
                            continue;

                        if (newGrid[r][col]!.value === grid[row][col]!.value && !newGrid[r][col]!.isMerged) {
                            newGrid[r][col] = grid[row][col]!.double().moveTo(r, col, newGrid[r][col]!.key);
                            newGrid[r][col]!.merge();
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
                        newGrid[gridSize - cnt][col] = grid[row][col]!.moveTo(gridSize - cnt, col);
                        if (gridSize - cnt !== row)
                            isMoved = true;
                    }
                }
            }
            break;
        }
        case "move_left": {
            for (let row = 0; row < gridSize; row++) {
                let cnt = 0;

                for (let col = 0; col < gridSize; col++) {
                    if (grid[row][col] == null)
                        continue;

                    cnt += 1;

                    let isMerged = false;
                    for (let c = cnt - 2; c >= 0; c--) {
                        if (newGrid[row][c] == null)
                            continue;

                        if (newGrid[row][c]!.value === grid[row][col]!.value && !newGrid[row][c]!.isMerged) {
                            newGrid[row][c] = grid[row][col]!.double().moveTo(row, c, newGrid[row][c]!.key);
                            newGrid[row][c]!.merge();
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
            for (let row = 0; row < gridSize; row++) {
                let cnt = 0;

                for (let col = gridSize - 1; col >= 0; col--) {
                    if (grid[row][col] == null)
                        continue;

                    cnt += 1;

                    let isMerged = false;
                    for (let c = gridSize - cnt + 1; c < gridSize; c++) {
                        if (newGrid[row][c] == null)
                            continue;

                        if (newGrid[row][c]!.value === grid[row][col]!.value && !newGrid[row][c]!.isMerged) {
                            newGrid[row][c] = grid[row][col]!.double().moveTo(row, c, newGrid[row][c]!.key);
                            newGrid[row][c]!.merge();
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
                        newGrid[row][gridSize - cnt] = grid[row][col]!.moveTo(row, gridSize - cnt);
                        if (gridSize - cnt !== col)
                            isMoved = true;
                    }
                }
            }
            break;
        }
    }

    const result = isMoved ? createMoreTile(newGrid) : grid;

    // all isMerged to false
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (result[i][j] != null)
                result[i][j]!.isMerged = false;
        }
    }

    return result;
}
