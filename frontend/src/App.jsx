import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicOnlyRoute from "./components/PublicOnlyRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import MenuPage from "./pages/MenuPage.jsx";
import GamePage from "./pages/GamePage.jsx";
import ResultsPage from "./pages/ResultsPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import RankingPage from "./pages/RankingPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import PanelRoute from "./panel/PanelRoute.jsx";
import PanelLayout from "./panel/PanelLayout.jsx";
import PanelLoginPage from "./panel/PanelLoginPage.jsx";
import PanelHomePage from "./panel/PanelHomePage.jsx";
import PanelQuestionsPage from "./panel/PanelQuestionsPage.jsx";
import PanelQuestionFormPage from "./panel/PanelQuestionFormPage.jsx";
import PanelUsersPage from "./panel/PanelUsersPage.jsx";

export default function App() {
  return (
    <Routes>
      {/* ---------- Juego ---------- */}
      <Route element={<Layout />}>
        {/* Solo sin sesión */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
        </Route>

        {/* Con sesión (cualquier rol) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MenuPage />} />
          <Route path="/partida/:id" element={<GamePage />} />
          <Route path="/resultados/:id" element={<ResultsPage />} />
          <Route path="/historial" element={<HistoryPage />} />
          <Route path="/ranking" element={<RankingPage />} />
        </Route>
      </Route>

      {/* ---------- Panel de administración (interfaz aparte) ---------- */}
      <Route path="/panel/login" element={<PanelLoginPage />} />
      <Route path="/panel" element={<PanelRoute />}>
        <Route element={<PanelLayout />}>
          <Route index element={<PanelHomePage />} />
          <Route path="preguntas" element={<PanelQuestionsPage />} />
          <Route path="preguntas/nueva" element={<PanelQuestionFormPage />} />
          <Route path="preguntas/:id" element={<PanelQuestionFormPage />} />
          <Route path="usuarios" element={<PanelUsersPage />} />
        </Route>
      </Route>

      <Route element={<Layout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
