import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import PageLoadingScreen from "../../components/ui/PageLoadingScreen";
import { fetchBlogPosts } from "../../services/blogService";

export default function BlogPage() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: fetchBlogPosts
  });

  if (isLoading) {
    return <PageLoadingScreen label="Loading journal" />;
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 md:px-6">
      <h1 className="font-heading text-4xl text-accent-gold">Fragrance journal</h1>
      <p className="mt-3 text-text-secondary">Guides, stories, and scent wisdom from Bukhari Perfumes.</p>

      {posts.length === 0 ? (
        <p className="mt-10 text-text-secondary">No articles published yet.</p>
      ) : (
        <ul className="mt-10 space-y-8">
          {posts.map((post) => (
            <li key={post.id}>
              <article className="site-panel overflow-hidden rounded-xl">
                {post.image ? (
                  <img src={post.image} alt={post.title} className="aspect-[21/9] w-full object-cover" />
                ) : null}
                <div className="p-6">
                  <p className="text-xs text-text-secondary">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ""} · {post.authorName}
                  </p>
                  <h2 className="mt-2 font-heading text-2xl text-text-primary">
                    <Link to={`/blog/${post.slug}`} className="hover:text-accent-gold">
                      {post.title}
                    </Link>
                  </h2>
                  {post.excerpt ? <p className="mt-3 text-text-secondary">{post.excerpt}</p> : null}
                  <Link to={`/blog/${post.slug}`} className="mt-4 inline-block text-sm text-accent-gold underline">
                    Read article
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
