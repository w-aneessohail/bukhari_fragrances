/**
 * Homepage variants — classic storefront, 3D scroll experience, and modern hybrid.
 *
 * Switch the default site home by changing ACTIVE_HOME_VARIANT below.
 * All routes always stay available at their paths.
 */
export const HOME_ROUTES = {
  classic: "/home-classic",
  experience: "/home-experience",
  modern: "/home-modern"
} as const;

export type HomeVariant = keyof typeof HOME_ROUTES;

/** Set to "classic", "experience", or "modern" for the default homepage (/ and nav Home link). */
export const ACTIVE_HOME_VARIANT: HomeVariant = "modern";

export const ACTIVE_HOME_PATH = HOME_ROUTES[ACTIVE_HOME_VARIANT];

export const HOME_VARIANT_LABELS: Record<HomeVariant, string> = {
  classic: "Classic",
  experience: "3D Experience",
  modern: "Modern"
};

export function isClassicHomePath(pathname: string) {
  return pathname === HOME_ROUTES.classic;
}

export function isExperienceHomePath(pathname: string) {
  return pathname === HOME_ROUTES.experience;
}

export function isModernHomePath(pathname: string) {
  return pathname === HOME_ROUTES.modern;
}

/** Pages that use the dark experience backdrop / navbar chrome at the top. */
export function usesExperienceChrome(pathname: string) {
  return isExperienceHomePath(pathname) || isModernHomePath(pathname);
}

export function isActiveHomePath(pathname: string) {
  return pathname === ACTIVE_HOME_PATH;
}

export function otherHomeRoutes() {
  return (Object.entries(HOME_ROUTES) as [HomeVariant, string][]).filter(
    ([variant]) => variant !== ACTIVE_HOME_VARIANT
  );
}
