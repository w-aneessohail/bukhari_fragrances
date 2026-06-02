import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { fetchBlogPost } from "../../services/blogService";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: () => fetchBlogPost(slug!),
    enabled: Boolean(slug)
  });

  if (isLoading) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <div className="h-10 w-2/3 animate-pulse rounded bg-bg-secondary" />
        <div className="mt-8 h-64 animate-pulse rounded-xl bg-bg-secondary" />
      </section>
    );
  }

  if (isError || !post) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 text-center md:px-6">
        <h1 className="font-heading text-3xl text-text-primary">Article not found</h1>
        <Link to="/blog" className="mt-6 inline-block text-accent-gold underline">
          Back to journal
        </Link>
      </section>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <Link to="/blog" className="text-sm text-text-secondary underline hover:text-accent-gold">
        ← Fragrance journal
      </Link>

      <p className="mt-6 text-sm text-text-secondary">
        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ""} · {post.authorName}
      </p>
      <h1 className="mt-2 font-heading text-4xl text-accent-gold md:text-5xl">{post.title}</h1>

      {post.image ? (
        <img src={post.image} alt={post.title} className="mt-8 aspect-[16/9] w-full rounded-xl object-cover" />
      ) : null}

      {post.excerpt ? <p className="mt-8 text-lg text-text-secondary">{post.excerpt}</p> : null}

      <div className="prose prose-invert mt-8 max-w-none whitespace-pre-wrap leading-relaxed text-text-primary">
        {post.content}
      </div>

      {post.tags.length > 0 ? (
        <div className="mt-10 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-border px-3 py-1 text-xs text-text-secondary">
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}
