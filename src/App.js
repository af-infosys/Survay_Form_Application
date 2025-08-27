import "./App.css";
import { Route, Routes } from "react-router-dom";
import SurvayForm from "./pages/SurvayForm";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import SurvayReport from "./pages/SurvayReport";
import Society from "./pages/Society";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import IndexReport from "./pages/IndexReport";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={["owner", "surveyor"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<SurvayForm />} />
        <Route path="form" element={<SurvayForm />} />
        <Route path="form/:id" element={<SurvayForm />} />
        <Route path="report" element={<SurvayReport />} />
        <Route path="society" element={<Society />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="index" element={<IndexReport />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
