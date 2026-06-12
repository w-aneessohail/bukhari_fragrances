import { Link } from "react-router-dom";
import PageMeta from "../../components/seo/PageMeta";
import { ACTIVE_HOME_PATH } from "../../constants/homePages";

export default function OfflinePage() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <PageMeta title="You are offline" />
      <h1 className="font-heading text-4xl text-accent-gold">You are offline</h1>
      <p className="mt-4 text-text-secondary">
        Bukhari Perfumes needs an internet connection for live stock and checkout. Browse cached pages or try again
        shortly.
      </p>
      <Link to={ACTIVE_HOME_PATH} className="mt-8 rounded-lg bg-accent-gold px-6 py-3 font-medium text-bg-primary">
        Back to home
      </Link>
    </section>
  );
}
