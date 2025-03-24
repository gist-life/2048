import React, { useCallback, useEffect, useRef, useState } from "react";
import { Cell } from "./components/Cell.tsx";
import { Grid } from "./components/Grid.tsx";
import { TileElement } from "./components/Tile.tsx";
import { gridSize } from "./constants/constants.ts";
import { Direction, moveTiles, useGrid } from "./context/GridContext.tsx";

export default function App() {
    const [ grid, setGrid ] = useGrid();
    const [ cellSize, setCellSize ] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    const moveTile = useCallback<(_: Direction) => void>(
        (direction: Direction) => setGrid(moveTiles(grid, direction)),
        [ grid, setGrid ]
    );

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (debounceTimeout.current)
            clearTimeout(debounceTimeout.current);

        debounceTimeout.current = setTimeout(() => {
            if (e.key === "ArrowUp")
                moveTile("move_up");
            else if (e.key === "ArrowDown")
                moveTile("move_down");
            else if (e.key === "ArrowLeft")
                moveTile("move_left");
            else if (e.key === "ArrowRight")
                moveTile("move_right");
        }, 100);
    }, [ moveTile ]);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [ moveTile, grid, handleKeyDown ]);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            const entry = entries[0];
            if (entry) {
                const width = entry.contentRect.width;
                setCellSize((width - (gridSize - 1) * 8) / gridSize);
            }
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    return (
        <div className="w-screen h-screen bg-[#faf8ef] grid place-items-center">
            <Grid ref={containerRef}>
                {[ ...Array(gridSize * gridSize) ].map((_, i) => <Cell key={i}/>)}
                {grid.flat().filter(t => t != null).map(tile => (
                    <TileElement
                        key={tile.key}
                        x={tile.col * (cellSize + 8)}
                        y={tile.row * (cellSize + 8)}
                        value={tile.value}
                        isnew={tile.isNew && true}
                        ismerged={tile.isMerged && true}
                    />
                ))}
            </Grid>
        </div>
    );
}