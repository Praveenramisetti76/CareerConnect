import AppRouter from "./routes/AppRouter";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <AppRouter />
      <Toaster position="top-left" richColors />
    </>
  );
}

export default App;
