import AuthBootstrap from "./components/auth/AuthBootstrap";
import InstallPrompt from "./components/pwa/InstallPrompt";
import AppRouter from "./routes/AppRouter";
import "./i18n";

export default function App() {
  return (
    <AuthBootstrap>
      <AppRouter />
      <InstallPrompt />
    </AuthBootstrap>
  );
}
