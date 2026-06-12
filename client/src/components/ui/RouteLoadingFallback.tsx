import PageLoadingScreen from "./PageLoadingScreen";

/** Suspense fallback — same loading screen as the 3D experience. */
export default function RouteLoadingFallback() {
  return <PageLoadingScreen />;
}
