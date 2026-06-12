import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import PageLoadingScreen from "../../../components/ui/PageLoadingScreen";
import { createBlogPost, deleteBlogPost, fetchAdminBlogPosts } from "../../../services/blogService";

export default function AdminBlogPage() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [publish, setPublish] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["admin-blog"],
    queryFn: fetchAdminBlogPosts
  });

  const createMutation = useMutation({
    mutationFn: () =>
      createBlogPost({
        title,
        excerpt: excerpt || undefined,
        content,
        image: image || undefined,
        publish
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog"] });
      setTitle("");
      setExcerpt("");
      setContent("");
      setImage("");
      setError(null);
    },
    onError: () => setError("Could not create article")
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBlogPost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-blog"] })
  });

  if (isLoading) {
    return <PageLoadingScreen label="Loading articles" />;
  }

  return (
    <div>
      <h1 className="font-heading text-3xl text-accent-gold">Blog</h1>
      <p className="mt-2 text-text-secondary">Publish articles to the fragrance journal.</p>

      <form
        className="mt-8 space-y-4 rounded-xl border border-border bg-card p-6"
        onSubmit={(event) => {
          event.preventDefault();
          createMutation.mutate();
        }}
      >
        <h2 className="font-heading text-xl text-text-primary">New article</h2>
        <label className="block text-sm">
          <span className="text-text-secondary">Title</span>
          <input
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="text-text-secondary">Excerpt</span>
          <input
            value={excerpt}
            onChange={(event) => setExcerpt(event.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="text-text-secondary">Image URL</span>
          <input
            value={image}
            onChange={(event) => setImage(event.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="text-text-secondary">Content</span>
          <textarea
            required
            rows={6}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-text-secondary">
          <input type="checkbox" checked={publish} onChange={(event) => setPublish(event.target.checked)} />
          Publish immediately
        </label>
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="rounded-lg bg-accent-gold px-6 py-2 text-sm font-medium text-bg-primary disabled:opacity-50"
        >
          Create article
        </button>
      </form>

      <div className="mt-10">
        <h2 className="font-heading text-xl text-text-primary">All articles</h2>
        <ul className="mt-4 space-y-3">
            {posts.map((post) => (
              <li key={post.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-4">
                <div>
                  <p className="font-medium">{post.title}</p>
                  <p className="text-xs text-text-secondary">
                    {post.publishedAt ? `Published ${new Date(post.publishedAt).toLocaleDateString()}` : "Draft"}
                  </p>
                  {post.publishedAt ? (
                    <Link to={`/blog/${post.slug}`} className="text-xs text-accent-gold underline">
                      View live
                    </Link>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(post.id)}
                  className="text-sm text-text-secondary underline hover:text-red-400"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
      </div>
    </div>
  );
}
