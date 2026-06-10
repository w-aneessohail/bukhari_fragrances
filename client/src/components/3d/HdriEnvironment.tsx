import { Environment } from "@react-three/drei";
import { Component, Suspense, type ReactNode } from "react";
import { EXPERIENCE_TEXTURES } from "../../constants/experienceAssets";

class HdriErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <Environment preset="sunset" background={false} />;
    }
    return this.props.children;
  }
}

function LocalHdri() {
  return <Environment files={EXPERIENCE_TEXTURES.hdri} background={false} />;
}

export default function HdriEnvironment() {
  return (
    <HdriErrorBoundary>
      <Suspense fallback={<Environment preset="sunset" background={false} />}>
        <LocalHdri />
      </Suspense>
    </HdriErrorBoundary>
  );
}
