import { prisma } from "../config/database.js";
import { HttpError } from "../utils/httpError.js";
import { slugify } from "../utils/product.utils.js";

type BlogInput = {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string | null;
  image?: string | null;
  tags?: string[];
  publish?: boolean;
};

function mapBlogPost(post: {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  image: string | null;
  tags: string[];
  publishedAt: Date | null;
  createdAt: Date;
  author: { name: string };
}) {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt,
    image: post.image,
    tags: post.tags,
    publishedAt: post.publishedAt?.toISOString() ?? null,
    createdAt: post.createdAt.toISOString(),
    authorName: post.author.name
  };
}

async function ensureUniqueSlug(baseSlug: string, excludeId?: string) {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.blogPost.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {})
      }
    });

    if (!existing) {
      return slug;
    }

    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }
}

export async function listPublishedBlogPosts() {
  const posts = await prisma.blogPost.findMany({
    where: { publishedAt: { not: null, lte: new Date() } },
    include: { author: { select: { name: true } } },
    orderBy: { publishedAt: "desc" }
  });

  return posts.map(mapBlogPost);
}

export async function getBlogPostBySlug(slug: string) {
  const post = await prisma.blogPost.findFirst({
    where: {
      slug,
      publishedAt: { not: null, lte: new Date() }
    },
    include: { author: { select: { name: true } } }
  });

  if (!post) {
    throw new HttpError("Article not found", 404);
  }

  return mapBlogPost(post);
}

export async function listAllBlogPosts() {
  const posts = await prisma.blogPost.findMany({
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: "desc" }
  });

  return posts.map(mapBlogPost);
}

export async function createBlogPost(authorId: string, input: BlogInput) {
  const slug = await ensureUniqueSlug(slugify(input.slug ?? input.title));

  const post = await prisma.blogPost.create({
    data: {
      title: input.title,
      slug,
      content: input.content,
      excerpt: input.excerpt ?? null,
      image: input.image ?? null,
      tags: input.tags ?? [],
      authorId,
      publishedAt: input.publish ? new Date() : null
    },
    include: { author: { select: { name: true } } }
  });

  return mapBlogPost(post);
}

export async function deleteBlogPost(postId: string) {
  const post = await prisma.blogPost.findUnique({ where: { id: postId } });
  if (!post) {
    throw new HttpError("Article not found", 404);
  }

  await prisma.blogPost.delete({ where: { id: postId } });
  return { deleted: true };
}
