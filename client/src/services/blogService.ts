import { api } from "./api";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  image: string | null;
  tags: string[];
  publishedAt: string | null;
  createdAt: string;
  authorName: string;
};

export async function fetchBlogPosts() {
  const response = await api.get<{ data: BlogPost[] }>("/blog");
  return response.data.data;
}

export async function fetchBlogPost(slug: string) {
  const response = await api.get<{ data: BlogPost }>(`/blog/${slug}`);
  return response.data.data;
}

export async function fetchAdminBlogPosts() {
  const response = await api.get<{ data: BlogPost[] }>("/admin/blog");
  return response.data.data;
}

export async function createBlogPost(input: {
  title: string;
  content: string;
  excerpt?: string;
  image?: string;
  tags?: string[];
  publish?: boolean;
}) {
  const response = await api.post<{ data: BlogPost }>("/admin/blog", input);
  return response.data.data;
}

export async function deleteBlogPost(id: string) {
  await api.delete(`/admin/blog/${id}`);
}
