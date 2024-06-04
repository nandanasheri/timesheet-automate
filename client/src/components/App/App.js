import { BrowserRouter, Routes, Route} from "react-router-dom";
import LandingPage from "../../views/LandingPage/LandingPage";
import GeneratePDFPage from "../../views/GeneratePDFPage/GeneratePDFPage";
import NoPage from "../../views/NoPage/NoPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="*" element={<NoPage />} />
        <Route path="/generate" element={<GeneratePDFPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
