import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { GridProvider } from "./context/GameContext.tsx";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <GridProvider>
                <App/>
            </GridProvider>
        </BrowserRouter>
    </StrictMode>
);
