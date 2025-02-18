import { AdForm } from "~/app/admin/ads/_components/ad-form"
import { Wrapper } from "~/components/admin/ui/wrapper"
import { H3 } from "~/components/common/heading"
import { findCategoryList } from "~/server/admin/categories/queries"

export default async function CreateAdPage() {
  const categories = await findCategoryList()

  return (
    <Wrapper size="md">
      <H3>Create ad</H3>

      <AdForm categories={categories} />
    </Wrapper>
  )
} 