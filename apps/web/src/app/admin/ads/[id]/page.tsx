import { notFound } from "next/navigation"
import { AdForm } from "~/app/admin/ads/_components/ad-form"
import { Wrapper } from "~/components/admin/ui/wrapper"
import { H3 } from "~/components/common/heading"
import { findAdById } from "~/server/admin/ads/queries"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function UpdateAdPage({ params }: PageProps) {
  const { id } = await params
  const ad = await findAdById(id)
  
  if (!ad) {
    return notFound()
  }

  return (
    <Wrapper size="md">
      <H3>Update ad</H3>

      <AdForm ad={ad} />
    </Wrapper>
  )
} 