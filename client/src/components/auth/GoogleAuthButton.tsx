export default function GoogleAuthButton() {
  const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

  return (
    <a
      href={`${apiBaseUrl}/auth/google`}
      className="inline-flex w-full items-center justify-center rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-text-primary transition hover:border-accent-gold hover:text-accent-gold"
    >
      Continue with Google
    </a>
  );
}
