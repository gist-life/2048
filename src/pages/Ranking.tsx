import { useEffect, useState } from "react";
import { HomeIcon } from "../components/IconButton.tsx";
import { supabase } from "../database/supabase";

type RankingItem = {
    nickname: string;
    score: number;
};

export default function Ranking() {
    const [ rankings, setRankings ] = useState<RankingItem[]>([]);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        const fetchRankings = async () => {
            const { data, error } = await supabase
                .from("ranking")
                .select("*")
                .order("score", { ascending: false });

            if (error)
                console.error("Error fetching rankings:", error);
            else
                setRankings(data || []);

            setLoading(false);
        };

        fetchRankings();
    }, []);

    return (
        <>
            <HomeIcon/>
            <div className="w-screen h-screen bg-[#faf8ef] grid place-items-center">
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="flex flex-col gap-2 text-xl text-[#554738] font-bold">
                        {rankings.map(({ nickname, score }, i) => (
                            <div key={i}>
                                {i + 1}. {nickname} — {score}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
