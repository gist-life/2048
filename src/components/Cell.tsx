import styled from "styled-components";

const CellStyle = styled.div`
    background-color: #e6e6e6;
    color: #787878;
`;

export function Cell() {
    return <CellStyle className="w-full h-full flex justify-center items-center rounded-2xl" />;
}