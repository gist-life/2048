import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { produce } from "immer";

const size = 4; // 4x4 그리드

type Tile = { value: number, row: number, col: number };

const initialTiles: Tile[] = [
    { value: 2, row: 0, col: 0 },
    { value: 2, row: 1, col: 1 },
];

const GridWrapper = styled.div`
	width: 80vmin;
	height: 80vmin;
	position: relative;
	display: grid;
	grid-template-columns: repeat(${size}, 1fr);
	grid-template-rows: repeat(${size}, 1fr);
	gap: 8px;
	background-color: #ccc;
	border-radius: 12px;
    border-width: 8px;
    border-color: #ccc;
`;

const BackgroundTile = styled.div`
	background-color: #eee;
	border-radius: 8px;
	width: 100%;
	height: 100%;
`;

const Tile = styled.div<{ x: number; y: number }>`
    position: absolute;
    width: calc((100% - ${(size - 1) * 8}px) / ${size});
    height: calc((100% - ${(size - 1) * 8}px) / ${size});
    transform: translate(${({ x }) => x}px, ${({ y }) => y}px);
    transition: transform 0.3s ease;
    background-color: #3b82f6;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: bold;
    border-radius: 8px;
`;

const App: React.FC = () => {
    const [tiles, setTiles] = useState(initialTiles);
    const [cellSize, setCellSize] = useState(0);
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

    const moveTile = (direction: string) => {
        const newTiles = tiles.map(tile => {
            const newTile = { ...tile };
            switch (direction) {
                case 'ArrowUp':
                    if (newTile.row > 0) newTile.row -= 1;
                    break;
                case 'ArrowDown':
                    if (newTile.row < size - 1) newTile.row += 1;
                    break;
                case 'ArrowLeft':
                    if (newTile.col > 0) newTile.col -= 1;
                    break;
                case 'ArrowRight':
                    if (newTile.col < size - 1) newTile.col += 1;
                    break;
                default:
                    break;
            }
            return newTile;
        });
        setTiles(newTiles);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                moveTile(e.key);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [tiles]);

    return (
        <div className="w-screen h-screen bg-gray-100 grid place-items-center">
            <GridWrapper ref={containerRef}>
                {[...Array(size * size)].map((_, i) => (
                    <BackgroundTile key={i} />
                ))}
                {tiles.map((tile, index) => (
                    <Tile
                        key={index}
                        x={tile.col * (cellSize + 8)}
                        y={tile.row * (cellSize + 8)}
                    >
                        {tile.value}
                    </Tile>
                ))}
            </GridWrapper>
        </div>
    );
};

export default App;
