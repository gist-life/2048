import { useEffect, useState } from "react";
import { HomeIcon } from "../components/IconButton.tsx";
import { supabase } from "../database/supabase";
import styled from "styled-components";

type RankingItem = {
  nickname: string;
  score: number;
};

const RankingContainer = styled.div`
  display: grid;
  place-items: center;
  width: 100vw;
  height: 100vh;
  background-color: #faf8ef;
`;

const RankingsWrapper = styled.div`
  width: 90%;
  max-width: 800px;
  height: 70%;
  background-color: #ffffff;
  border-radius: 13px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  overflow-y: auto;
`;

const RankingItemStyled = styled.div<{ index: number }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 10px;
  border-radius: 10px;
  background-color: ${({ index }) =>
    index === 0
      ? "#ffd700" // Gold for 1st place
      : index === 1
      ? "#c0c0c0" // Silver for 2nd place
      : index === 2
      ? "#cd7f32" // Bronze for 3rd place
      : "transparent"}; // No background color for others
  font-size: 18px;
  font-weight: bold;
  color: ${({ index }) => (index < 3 ? "#fff" : "#554738")}; /* White text for top 3 */
  margin-bottom: 8px; /* Added margin between items */
  border-bottom: ${({ index }) => (index < 3 ? "none" : "1px solid #e0e0e0")}; /* No border for top 3 */
`;

const RankText = styled.span`
  color: inherit; /* Inherited color for the rank */
  font-size: 24px;
  font-weight: 800;
  padding-left: 4px;
`;

const NicknameText = styled.span`
  color: inherit; /* Inherited color */
`;

const ScoreText = styled.span<{ index: number }>`
  color: ${({ index }) =>
    index < 3 ? "#fff" : "#2c7f67"}; /* White for top 3, green for others */
`;

export default function Ranking() {
  const [rankings, setRankings] = useState<RankingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      const { data, error } = await supabase
        .from("ranking")
        .select("*")
        .order("score", { ascending: false });

      if (error) console.error("Error fetching rankings:", error);
      else setRankings(data || []);

      setLoading(false);
    };

    fetchRankings();
  }, []);

  return (
    <>
      <HomeIcon />
      <RankingContainer>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <RankingsWrapper>
            {rankings.map(({ nickname, score }, i) => (
              <RankingItemStyled key={i} index={i}>
                <RankText>{i + 1}.</RankText>
                <NicknameText>{nickname}</NicknameText>
                <ScoreText index={i}>{score}</ScoreText>
              </RankingItemStyled>
            ))}
          </RankingsWrapper>
        )}
      </RankingContainer>
    </>
  );
}
