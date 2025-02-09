import { AdForm } from "~/app/admin/ads/_components/ad-form"
import { Wrapper } from "~/components/admin/ui/wrapper"
import { H3 } from "~/components/common/heading"

export default async function CreateAdPage() {
  return (
    <Wrapper size="md">
      <H3>Create ad</H3>

      <AdForm />
    </Wrapper>
  )
} 