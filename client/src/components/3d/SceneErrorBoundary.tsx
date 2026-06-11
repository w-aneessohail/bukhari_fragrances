import { Component, type ErrorInfo, type ReactNode } from "react";
import { isWebGLContextError } from "../../utils/webglSupport";
import ExperienceBackgroundFallback from "./ExperienceBackgroundFallback";

type Props = {
  children: ReactNode;
  onWebGLFailed?: () => void;
  onWebGLReady?: () => void;
};

type State = {
  hasError: boolean;
};

export default class SceneErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: unknown): State | null {
    if (isWebGLContextError(error)) return { hasError: true };
    return null;
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (!isWebGLContextError(error)) return;

    this.props.onWebGLFailed?.();
    if (import.meta.env.DEV) {
      console.warn("[ExperienceHome] WebGL unavailable — using static fallback.", error.message, info.componentStack);
    }
  }

  render() {
    if (this.state.hasError) return <ExperienceBackgroundFallback />;
    return this.props.children;
  }
}
