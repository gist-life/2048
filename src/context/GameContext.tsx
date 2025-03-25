import { produce } from "immer";
import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useState } from "react";
import { Tile } from "../components/Tile.tsx";
import { gridSize, keys } from "../constants/constants.ts";

type GameContextType = {
    grid: (Tile | null)[][],
    score: number,
    isOver: boolean,
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const GameContext = createContext<{
    ctx: GameContextType,
    setCtx: Dispatch<SetStateAction<GameContextType>>
}>();

export function GridProvider({ children }: PropsWithChildren) {
    const [ctx, setCtx] = useState<GameContextType>({
        grid: createInitialGrid(),
        score: 0,
        isOver: false,
    });

    return (
        <GameContext.Provider value={{ ctx, setCtx }}>
            {children}
        </GameContext.Provider>
    )
}

export function useGame() {
    const { ctx, setCtx } = useContext(GameContext);
    return [ctx, setCtx] as const;
}

export type Direction = "move_up" | "move_down" | "move_left" | "move_right";

function createInitialGrid(): (Tile | null)[][] {
    const initialGrid: (Tile | null)[][] = Array.from({ length: gridSize }, () => Array.from({ length: gridSize }, () => null));

    const choices: number[] = [];

    while (choices.length < 2) {
        const choice = Math.floor(Math.random() * (gridSize * gridSize));
        if (!choices.includes(choice))
            choices.push(choice);
    }

    for (const choice of choices) {
        const i = Math.floor(choice / gridSize);
        const j = choice % gridSize;
        initialGrid[i][j] = new Tile(keys.length, 2, i, j, true);
    }

    return initialGrid;
}

export function createMoreTile(grid: (Tile | null)[][]) {
    while (true) {
        const choice = Math.floor(Math.random() * (gridSize * gridSize));
        const i = Math.floor(choice / gridSize);
        const j = choice % gridSize;

        if (grid[i][j] == null) {
            const newNumber = Math.random() < 0.9 ? 2 : 4;

            return produce(grid, draft => {
                draft[i][j] = new Tile(Math.max(...keys) + 1, newNumber, i, j, true);
            });
        }
    }
}

// todo: for 로 할 필요 없이 lastValue로 하면 됨
export function moveTiles(grid: (Tile | null)[][], direction: Direction) {
    const newGrid: (Tile | null)[][] = Array.from({ length: gridSize }, () => Array.from({ length: gridSize }, () => null));
    let isMoved = false;
    let addScore = 0;

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
                            newGrid[r][col] = grid[row][col]!.addValue(newGrid[r][col]!).moveTo(r, col, newGrid[r][col]!.key);
                            newGrid[r][col]!.merge();
                            addScore += newGrid[r][col]!.value;
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
                            newGrid[r][col] = grid[row][col]!.addValue(newGrid[r][col]!).moveTo(r, col, newGrid[r][col]!.key);
                            newGrid[r][col]!.merge();
                            addScore += newGrid[r][col]!.value;
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
                            newGrid[row][c] = grid[row][col]!.addValue(newGrid[row][c]!).moveTo(row, c, newGrid[row][c]!.key);
                            newGrid[row][c]!.merge();
                            addScore += newGrid[row][c]!.value;
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
                            newGrid[row][c] = grid[row][col]!.addValue(newGrid[row][c]!).moveTo(row, c, newGrid[row][c]!.key);
                            newGrid[row][c]!.merge();
                            addScore += newGrid[row][c]!.value;
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

    return [result, addScore] as const;
}
