import { useEffect, useReducer } from "react";
import { useGrid } from "../context/GridContext.tsx";
import { Cell } from "./Cell.tsx";
import { Tile, TileElement } from "./Tile.tsx";
import { produce } from "immer";

function createMoreTile(grid: (Tile | null)[][]): (Tile | null)[][] {
    while (true) {
        const choice = Math.floor(Math.random() * (4*4));
        const i = Math.floor(choice / 4);
        const j = choice % 4;

        if (grid[i][j] != null) {
            return produce(grid, draft => {
                draft[i][j] = new Tile(2, [i, j]);
            });
        }
    }
}

type State = {
    grid: (Tile | null)[][]
};

type Action =
    | { type: "move_up" }
    | { type: "move_down" }
    | { type: "move_left" }
    | { type: "move_right" };

// todo: game state로 moving, merging, creating tile 구현

function reducer(state: State, action: Action): State {
    const { grid } = state;

    switch (action.type) {
        case "move_up": {
            const newGrid: (Tile | null)[][] = Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => null));

            let isMoved = false;
            for (let col = 0; col < grid[0].length; col++) {
                let cnt = 0;

                for (let row = 0; row < grid[0].length; row++) {
                    if (grid[row][col] == null)
                        continue;

                    cnt += 1;

                    let isMerged = false;
                    for (let r = cnt - 2; r >= 0; r--) {
                        if (newGrid[r][col] == null)
                            continue;

                        if (newGrid[r][col]!.value === grid[row][col]!.value) {
                            newGrid[r][col] = grid[row][col]!.double().moveTo([r, col]);
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
                        newGrid[cnt - 1][col] = grid[row][col]!.moveTo([cnt - 1, col]);
                        if (cnt - 1 !== row)
                            isMoved = true;
                    }
                }
            }

            return produce(state, draft => {
                if (isMoved)
                    draft.grid = createMoreTile(newGrid);
            });
        }
        case "move_down": {
            const newGrid: (Tile | null)[][] = Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => null));

            let isMoved = false;
            for (let col = 0; col < grid[0].length; col++) {
                let cnt = 0;

                for (let row = grid.length - 1; row >= 0; row--) {
                    if (grid[row][col] == null)
                        continue;

                    cnt += 1;

                    let isMerged = false;
                    for (let r = grid.length - cnt + 1; r < grid.length; r++) {
                        if (newGrid[r][col] == null)
                            continue;

                        if (newGrid[r][col]!.value === grid[row][col]!.value) {
                            newGrid[r][col] = grid[row][col]!.double().moveTo([r, col]);
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
                        newGrid[grid.length - cnt][col] = grid[row][col]!.moveTo([grid.length - cnt, col]);
                        if (grid.length - cnt !== row)
                            isMoved = true;
                    }
                }
            }

            return produce(state, draft => {
                if (isMoved)
                    draft.grid = createMoreTile(newGrid);
            });
        }
        case "move_left": {
            const newGrid: (Tile | null)[][] = Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => null));

            let isMoved = false;
            for (let row = 0; row < grid.length; row++) {
                let cnt = 0;

                for (let col = 0; col < grid[row].length; col++) {
                    if (grid[row][col] == null)
                        continue;

                    cnt += 1;

                    let isMerged = false;
                    for (let c = cnt - 2; c >= 0; c--) {
                        if (newGrid[row][c] == null)
                            continue;

                        if (newGrid[row][c]!.value === grid[row][col]!.value) {
                            newGrid[row][c] = grid[row][col]!.double().moveTo([row, c]);
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
                        newGrid[row][cnt - 1] = grid[row][col]!.moveTo([row, cnt - 1]);
                        if (cnt - 1 !== col)
                            isMoved = true;
                    }
                }
            }

            return produce(state, draft => {
                if (isMoved)
                    draft.grid = createMoreTile(newGrid);
            });
        }
        case "move_right": {
            const newGrid: (Tile | null)[][] = Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => null));

            let isMoved = false;
            for (let row = 0; row < grid.length; row++) {
                let cnt = 0;

                for (let col = grid[row].length - 1; col >= 0; col--) {
                    if (grid[row][col] == null)
                        continue;

                    cnt += 1;

                    let isMerged = false;
                    for (let c = grid[row].length - cnt + 1; c < grid.length; c++) {
                        if (newGrid[row][c] == null)
                            continue;

                        if (newGrid[row][c]!.value === grid[row][col]!.value) {
                            newGrid[row][c] = grid[row][col]!.double().moveTo([row, c]);
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
                        newGrid[row][grid[row].length - cnt] = grid[row][col]!.moveTo([row, grid[row].length - cnt]);
                        if (grid[row].length - cnt !== col)
                            isMoved = true;
                    }
                }
            }

            return produce(state, draft => {
                if (isMoved)
                    draft.grid = createMoreTile(newGrid);
            });
        }
    }
}

export function Grid() {
    const [grid, setGrid] = useGrid();
    const [state, dispatch] = useReducer(reducer, { grid });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // todo: 게임 종료 조건

            if (e.key === 'ArrowUp')
                dispatch({ type: "move_up" });
            else if (e.key === 'ArrowDown')
                dispatch({ type: "move_down" });
            else if (e.key === 'ArrowLeft')
                dispatch({ type: "move_left" });
            else if (e.key === 'ArrowRight')
                dispatch({ type: "move_right" });
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="w-full h-screen flex justify-center items-center">
            <div className="w-[40%] aspect-[1/1] bg-white rounded-3xl shadow-[0_0_8px_0_rgba(0,0,0,0.04)] grid grid-rows-4 grid-cols-4 gap-3 p-3">
                {Array.from({ length: 4*4 }).map(() => <Cell/>)}
            </div>
            <div className="w-[40%] aspect-[1/1] bg-transparent rounded-3xl shadow-[0_0_8px_0_rgba(0,0,0,0)] grid grid-rows-4 grid-cols-4 gap-3 p-3 absolute top-0 z-10">
                {grid.map(row =>
                    row.map(tile =>
                        tile && <TileElement className={`row-start-${tile.position[0] + 1} col-start-${tile.position[1] + 1}`} tile={tile}/>
                    )
                )}
            </div>
        </div>
    );
}