import { BlogPostsTable } from "~/app/admin/blog/_components/blog-posts-table"
import { Wrapper } from "~/components/admin/ui/wrapper"
import { findBlogPosts } from "~/server/admin/blog/queries"

export default async function BlogPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const blogPostsPromise = findBlogPosts(await searchParams)

  return (
    <Wrapper>
      <BlogPostsTable blogPostsPromise={blogPostsPromise} />
    </Wrapper>
  )
} 