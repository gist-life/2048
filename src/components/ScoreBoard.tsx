import styled from "styled-components";

const ScoreBoardStyle = styled.div`
    padding: 0.5rem;
    width: 120px;
    height: 70px;
    color: #f9f6f2;
    background-color: #bbada0;
    border-radius: 8px;
    font-weight: bold;
    
    // 텍스트 중앙 정렬
	display: flex;
	align-items: center;
	justify-content: center;
    flex-direction: column;
`;

export function ScoreBoard({ score }: { score: number }) {
    return (
        <ScoreBoardStyle>
            <div style={{ "fontSize": "0.8rem", "color": "#ebe4da" }}>SCORE</div>
            <div style={{ "fontSize": "1.7rem" }}>{score}</div>
        </ScoreBoardStyle>
    );
}