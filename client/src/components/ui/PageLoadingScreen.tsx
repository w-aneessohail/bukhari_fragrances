import { useIndeterminateProgress } from "../../hooks/useIndeterminateProgress";
import LoadingScreen from "./LoadingScreen";

type PageLoadingScreenProps = {
  label?: string;
};

/** Full-page loader — same screen as the 3D experience. */
export default function PageLoadingScreen({ label = "Loading" }: PageLoadingScreenProps) {
  const progress = useIndeterminateProgress();
  return <LoadingScreen progress={progress} visible label={label} />;
}
