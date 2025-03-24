import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaRankingStar } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";

const RankingIconStyle = styled(FaRankingStar)`
    position: absolute;
    top: 18px;
    left: 18px;
    padding: 0.5rem;
	width: 70px;
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

const HomeIconStyle = styled(FaHome)`
    position: absolute;
    top: 18px;
    left: 18px;
    padding: 0.5rem;
	width: 70px;
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

export function RankingIcon() {
    return (
        <Link to='/2048/ranking'>
            <RankingIconStyle>
                <FaRankingStar/>
            </RankingIconStyle>
        </Link>
    );
}

export function HomeIcon() {
    return (
        <Link to='/2048/'>
            <HomeIconStyle>
                <FaHome/>
            </HomeIconStyle>
        </Link>
    );
}