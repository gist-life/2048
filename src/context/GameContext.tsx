import { produce } from "immer";
import { createContext, PropsWithChildren, useReducer } from "react";
import { Tile } from "../components/Tile.tsx";

type GameStatus = "ongoing" | "won" | "lost";
type Direction = "move_up" | "move_down" | "move_left" | "move_right";

export const GameContext = createContext({
    score: 0,
    status: "ongoing" as GameStatus,
    moveTiles: (_: Direction) => {},
    getTiles: () => [] as Tile[],
    startGame: () => {},
});

function createEmptyGrid(): (Tile | null)[][] {
    const ret: (Tile | null)[][] = Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => null));

    ret[0][1] = new Tile(2, [ 0, 1 ]);
    ret[0][2] = new Tile(2, [ 0, 2 ]);

    return ret;
}

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

type Action = { [D in Direction]: { type: D } }[Direction]
    | { type: "create_tile"; tile: Tile }
    | { type: "update_status"; status: GameStatus }
    | { type: "clean_up" }
    | { type: "reset_game" };

// todo: game state로 moving, merging, creating tile 구현
export const initialState: State = {
    grid: createEmptyGrid()
}

function gameReducer(state: State = initialState, action: Action): State {
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
        case "create_tile":
            break;
        case "update_status":
            break;
        case "clean_up":
            break;
        case "reset_game":
            break;
        default:
            return state;
    }
}

export function GameProvider({ children }: PropsWithChildren) {
    const [gameState, dispatch] = useReducer(gameReducer, initialState);
}