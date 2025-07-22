import "./App.css";
import { Route, Routes } from "react-router-dom";
import SurvayForm from "./pages/SurvayForm";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import SurvayReport from "./pages/SurvayReport";
import Society from "./pages/Society";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />}>
        <Route index element={<SurvayForm />} />
        <Route path="report" element={<SurvayReport />} />
        <Route path="society" element={<Society />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
