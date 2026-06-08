import AuthBootstrap from "./components/auth/AuthBootstrap";
import InstallPrompt from "./components/pwa/InstallPrompt";
import SystemHealthGate from "./components/system/SystemHealthGate";
import AppRouter from "./routes/AppRouter";
import "./i18n";

export default function App() {
  return (
    <SystemHealthGate>
      <AuthBootstrap>
        <AppRouter />
        <InstallPrompt />
      </AuthBootstrap>
    </SystemHealthGate>
  );
}
