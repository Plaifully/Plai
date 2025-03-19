import { notFound } from "next/navigation"
import { BlogPostForm } from "~/app/admin/blog/_components/blog-post-form"
import { Wrapper } from "~/components/admin/ui/wrapper"
import { H3 } from "~/components/common/heading"
import { findBlogPostById, findCategoryList } from "~/server/admin/blog/queries"

interface EditBlogPostPageProps {
  params: {
    id: string
  }
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const [blogPost, categories] = await Promise.all([
    findBlogPostById(params.id),
    findCategoryList(),
  ])

  if (!blogPost) {
    notFound()
  }

  return (
    <Wrapper size="md">
      <H3 className="mb-6">Edit Blog Post</H3>
      <BlogPostForm blogPost={blogPost} categories={categories} />
    </Wrapper>
  )
} 