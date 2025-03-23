import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { Tile } from "../components/Tile.tsx";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export const GridContext = createContext<{
    grid: (Tile | null)[][],
    setGrid: Dispatch<SetStateAction<(Tile | null)[][]>>
}>();

function createEmptyGrid(): (Tile | null)[][] {
    const ret: (Tile | null)[][] = Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => null));

    ret[0][1] = new Tile(2, [0, 1]);
    ret[0][2] = new Tile(2, [0, 2]);

    // const choices: number[] = [];
    //
    // while (choices.length < 2) {
    //     const choice = Math.floor(Math.random() * (4*4));
    //     if (!choices.includes(choice))
    //         choices.push(choice);
    // }
    //
    // for (const choice of choices) {
    //     const i = Math.floor(choice / 4);
    //     const j = choice % 4;
    //
    //     ret[i][j] = new Tile(2, [i, j]);
    // }
    
    return ret;
}

export function GridProvider({ children }: { children: ReactNode }) {
    const [grid, setGrid] = useState(createEmptyGrid());

    return (
        <GridContext.Provider value={{ grid, setGrid }}>
            {children}
        </GridContext.Provider>
    );
}

export function useGrid() {
    const { grid, setGrid } = useContext(GridContext);

    return [grid, setGrid] as const;
}