import { lighten } from "polished";
import { PropsWithChildren, useEffect, useState } from "react";
import styled from "styled-components";
import { useGame } from "../context/GameContext.tsx";
import { supabase } from "../database/supabase.tsx";
import { KeyboardEvent } from "react";
import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

export const OverlayStyle = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background-color: rgba(250, 248, 239, 0.82);
	//backdrop-filter: blur(2px);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1;
	flex-direction: column;
`;

export const OverlayTextStyle = styled.div`
	font-size: 4rem;
	color: #554738;
	font-weight: 700;
	text-align: center;
    margin-bottom: 10px;
`;

export const InputStyle = styled.input<{ isError: boolean, msg: string }>`
	font-size: 1rem;
	padding: 0.5rem;
	width: 300px;
	border: 5px solid ${lighten(0.1, "#554738")};
	border-radius: 50px;
	text-align: center;
    //font-weight: bold;
    color: ${props => props.msg.length === 0 ? "black" : props.isError ? "red" : "green"};

	&:focus {
        border-color: #554738;
		outline: none;
	}
`;

const InputWrapper = styled.div`
    position: relative;
    display: inline-block;
`;

const CheckIcon = styled(FaCheck)<{ show: boolean }>`
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: green;
    opacity: ${props => props.show ? 1 : 0};
    transition: opacity 0.2s ease-in-out;
    pointer-events: none;
`;

const XmarkIcon = styled(FaXmark)<{ show: boolean }>`
	position: absolute;
	right: 15px;
	top: 50%;
	transform: translateY(-50%);
	color: red;
	opacity: ${props => props.show ? 1 : 0};
	transition: opacity 0.2s ease-in-out;
	pointer-events: none;
`;

export const MessageStyle = styled.h2<{ isError: boolean, msg: string }>`
    margin-top: 10px;
	color: ${props => props.msg.length === 0 ? "black" : props.isError ? "red" : "green"};
    font-weight: bold;
`;

export function Icon({ show, isError }: PropsWithChildren<{ show: boolean, isError: boolean }>) {
    return isError ? <XmarkIcon show={show} /> : <CheckIcon show={show} />;
}

export function Overlay({ text }: { text: string }) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const [ { grid, score, isOver }, setCtx ] = useGame();
    const [inputText, setInputText] = useState("");
    const [isError, setError] = useState(false);
    const [msg, setMsg] = useState("");

    const handleInput = async (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const { data } = await supabase
                .from('ranking')
                .select('nickname')
                .eq('nickname', inputText)
                .single();

            // 이미 nickname이 존재하는 경우
            if (data) {
                setMsg("Nickname already exists!");
                setError(true);
            }
            else {
                // nickname이 없으면 새로운 데이터 삽입
                const insertData = {
                    nickname: inputText,
                    score: score
                };

                const { error: insertError } = await supabase
                    .from('ranking')
                    .insert(insertData);

                if (insertError) {
                    setMsg(`Error inserting data! ${JSON.stringify(insertError)}`);
                    setError(true);
                }
                else {
                    setMsg("Data saved successfully!");
                    setError(false);

                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            }
        }
    }

    useEffect(() => {
        if (inputText.length === 0) {
            setMsg("");
            setError(false);
        }
    }, [setError, inputText]);

    return (
        <OverlayStyle>
            <OverlayTextStyle>
                {text}
            </OverlayTextStyle>
            <InputWrapper>
                <InputStyle
                    onChange={e => setInputText(e.target.value)}
                    onKeyDown={handleInput}
                    placeholder="Enter your nickname"
                    isError={isError}
                    msg={msg}
                />
                <Icon isError={isError} show={msg.length > 0}/>
            </InputWrapper>
            {isError && <MessageStyle isError={isError} msg={msg}>
                {msg}
            </MessageStyle>}
        </OverlayStyle>
    );
}