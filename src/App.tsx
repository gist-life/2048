import { Grid } from "./components/Grid.tsx";
import { GridProvider } from "./context/GridContext.tsx";

export default function App() {
    return (
        <GridProvider>
            <Grid />
        </GridProvider>
    );
}
