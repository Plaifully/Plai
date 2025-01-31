import { ToolForm } from "~/app/admin/tools/_components/tool-form"
import { Wrapper } from "~/components/admin/ui/wrapper"
import { H3 } from "~/components/common/heading"
import { findCategoryList } from "~/server/admin/categories/queries"

export default async function CreateToolPage() {
  const categories = await findCategoryList()

  return (
    <Wrapper size="md">
      <H3>Create tool</H3>

      <ToolForm categories={categories} />
    </Wrapper>
  )
}
