import { PostList } from "~/components/web/posts/post-list"
import { findBlogPosts } from "~/server/web/blog/queries"

export const BlogListing = async () => {
  const posts = await findBlogPosts({})

  return <PostList posts={posts} />
} 