import "./App.css";
import "./i18n";
import BaseScreen from "./routes/BaseScreen";
import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./routes/HomePage";
import FilesPage from "./routes/FilesPage";
import ErrorPage from "./routes/ErrorPage";
import SettingsPage from "./routes/SettingsPage";
import ProfilePage from "./routes/ProfilePage";

function App() {
  return (
    <div className="bg-background dark:bg-background-dark w-screen h-screen">
      <Routes>
        <Route element={<BaseScreen />}>
          <Route index element={<HomePage />} />
          <Route path="dashboard" element={<HomePage />} />
          <Route path="files" element={<FilesPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
