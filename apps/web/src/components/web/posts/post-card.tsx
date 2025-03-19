import { formatDate, getReadTime } from "@curiousleaf/utils"
import Link from "next/link"
import type { ComponentProps } from "react"
import { H4 } from "~/components/common/heading"
import { Card, CardDescription, CardFooter, CardHeader } from "~/components/web/ui/card"
import { Image } from "~/components/web/ui/image"
import type { BlogPostMany } from "~/server/web/blog/payloads"

type PostCardProps = ComponentProps<typeof Card> & {
  post: BlogPostMany
}

export const PostCard = ({ className, post, ...props }: PostCardProps) => {
  // Format the publishedAt date safely
  const publishedAtFormatted = post.publishedAt 
    ? formatDate(typeof post.publishedAt === 'string' 
        ? post.publishedAt 
        : post.publishedAt.toISOString())
    : null;

  // Get the ISO string for the datetime attribute
  const publishedAtIso = post.publishedAt
    ? typeof post.publishedAt === 'string'
      ? post.publishedAt
      : post.publishedAt.toISOString()
    : null;

  return (
    <Card className="overflow-clip" asChild {...props}>
      <Link href={`/blog/${post.slug}`} prefetch={false}>
        {post.image && (
          <Image
            src={post.image}
            alt=""
            width={1920}
            height={1080}
            className="-m-5 mb-0 w-[calc(100%+2.5rem)] max-w-none aspect-video object-cover"
          />
        )}

        <CardHeader>
          <H4 as="h3" className="leading-snug!">
            {post.title}
          </H4>
        </CardHeader>

        {post.description && <CardDescription>{post.description}</CardDescription>}

        {publishedAtFormatted && (
          <CardFooter>
            <time dateTime={publishedAtIso || ''}>{publishedAtFormatted}</time>
            <span>&bull;</span>
            <span>{getReadTime(post.content)} min read</span>
          </CardFooter>
        )}
      </Link>
    </Card>
  )
}
