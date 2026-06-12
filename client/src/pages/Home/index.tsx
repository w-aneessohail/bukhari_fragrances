import { Navigate } from "react-router-dom";
import { ACTIVE_HOME_PATH } from "../../constants/homePages";

/** Root `/` redirects to whichever homepage variant is active in homePages.ts */
export default function HomeIndexRedirect() {
  return <Navigate to={ACTIVE_HOME_PATH} replace />;
}
