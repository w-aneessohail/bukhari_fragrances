type PagePlaceholderProps = {
  title: string;
  description?: string;
};

export default function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-heading text-4xl text-accent-gold">{title}</h1>
      <p className="mt-3 font-body text-text-secondary">
        {description ?? "This section is being prepared for Bukhari Perfumes."}
      </p>
    </section>
  );
}
