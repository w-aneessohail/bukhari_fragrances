import AuthBootstrap from "./components/auth/AuthBootstrap";
import AppRouter from "./routes/AppRouter";

export default function App() {
  return (
    <AuthBootstrap>
      <AppRouter />
    </AuthBootstrap>
  );
}
