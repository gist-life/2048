import { darken } from "polished";
import styled, { css, keyframes } from "styled-components";

export class Tile {
    value: number;
    position: [number, number];
    oldPosition: [number, number];

    constructor(
        value: number,
        position: [number, number],
        oldPosition: [number, number] = position,
    ) {
        if (value < 2)
            throw new Error(`value(${value}) must be greater than or equal to 2`);
        if (Math.log2(value) % 1 !== 0)
            throw new Error(`value(${value}) must be a power of 2`);

        this.value = value;
        this.position = position;
        this.oldPosition = oldPosition;
    }

    get power(): number {
        return Math.round(Math.log2(this.value));
    }
    
    get bgColor(): `#${string}` {
        switch (this.power) {
            case 1: return "#eee4da";
            case 2: return "#ede0c8";
            case 3: return "#f2b179";
            case 4: return "#f59563";
            case 5: return "#f67c5f";
            case 6: return "#f65e3b";
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            default: return darken(Math.min(1, Math.round(Math.log2(this.value) - 7) / 13), "#edcf73");
        }
    }

    get textColor(): `#${string}` {
        switch (this.value) {
            case 1: return "#776e65";
            case 2: return "#776e65";
            case 3: return "#f9f6f2";
            case 4: return "#f9f6f2";
            case 5: return "#f9f6f2";
            case 6: return "#f9f6f2";
            default: return "#f9f6f2";
        }
    }

    get isNew(): boolean {
        return this.position[0] === this.oldPosition[0] && this.position[1] === this.oldPosition[1];
    }

    moveTo(positionTo: [number, number]): Tile {
        return new Tile(this.value, positionTo, this.position);
    }

    double(): Tile {
        return new Tile(this.value * 2, this.position, this.oldPosition);
    }
}

const scaleIn = keyframes`
    from {
        transform: scale(0);
    }
    to {
        transform: scale(1);
    }
`;

const TileStyle = styled.div<{ tile: Tile }>`
    background-color: ${props => props.tile.bgColor};
    color: ${props => props.tile.textColor};
    font-weight: 600;
	font-size: ${props => `${Math.max(0, 3 - 0.3 * Math.max(0, props.tile.value.toString().length - 4))}vw`};

	transition: transform 0.2s ease-in-out;
    
    ${props => props.tile.isNew && css`
        transform: scale(0);
        animation: ${scaleIn} 0.2s forwards;
    `}
`;

export function TileElement({ tile }: { tile: Tile }) {
    return (
        <TileStyle tile={tile} className="w-full h-full flex justify-center items-center rounded-2xl">
            {tile.value}
        </TileStyle>
    );
}