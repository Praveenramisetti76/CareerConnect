import AppRouter from "./routes/AppRouter";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <AppRouter />
      <Toaster position="top-center" richColors />
    </>
  );
}

export default App;
