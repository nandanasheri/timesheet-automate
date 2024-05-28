import { BrowserRouter, Routes, Route} from "react-router-dom";
import LandingPage from "../../views/LandingPage/LandingPage";
import NoPage from "../../views/NoPage/NoPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
