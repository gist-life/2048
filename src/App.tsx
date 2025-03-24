import { Route, Routes } from "react-router-dom";
import Game from "./pages/Game.tsx";
import Ranking from "./pages/Ranking.tsx";

export default function App() {
    return (
        <Routes>
            <Route path="/2048/" element={<Game/>}></Route>
            <Route path="/2048/ranking" element={<Ranking/>}></Route>
        </Routes>
    )
}