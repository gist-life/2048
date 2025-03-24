import { Route, Routes } from "react-router-dom";
import Game from "./pages/Game.tsx";
import Ranking from "./pages/Ranking.tsx";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Game/>}></Route>
            <Route path="/ranking" element={<Ranking/>}></Route>
        </Routes>
    )
}