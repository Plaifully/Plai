import { BlogPostForm } from "~/app/admin/blog/_components/blog-post-form"
import { Wrapper } from "~/components/admin/ui/wrapper"
import { H3 } from "~/components/common/heading"
import { findCategoryList } from "~/server/admin/blog/queries"

export default async function NewBlogPostPage() {
  const categories = await findCategoryList()

  return (
    <Wrapper>
      <H3 className="mb-6">New Blog Post</H3>
      <BlogPostForm categories={categories} />
    </Wrapper>
  )
} 