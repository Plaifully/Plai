import type { ComponentProps } from "react"
import { PostCard } from "~/components/web/posts/post-card"
import { EmptyList } from "~/components/web/empty-list"
import { Grid } from "~/components/web/ui/grid"
import type { BlogPostMany } from "~/server/web/blog/payloads"
import { cx } from "~/utils/cva"

type PostListProps = ComponentProps<typeof Grid> & {
  posts: BlogPostMany[]
}

const PostList = ({ posts, className, ...props }: PostListProps) => {
  return (
    <Grid size="lg" className={cx("", className)} {...props}>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}

      {!posts.length && <EmptyList>No posts found.</EmptyList>}
    </Grid>
  )
}

const PostListSkeleton = () => {
  return (
    <Grid size="lg">
      {[...Array(6)].map((_, index) => (
        <div 
          key={index} 
          className="overflow-clip rounded-lg border border-border bg-card shadow-sm animate-pulse"
        >
          <div className="aspect-video bg-muted/20"></div>
          <div className="p-6">
            <div className="h-6 w-3/4 bg-muted/20 rounded mb-4"></div>
            <div className="h-4 w-full bg-muted/20 rounded mb-6"></div>
            <div className="flex gap-2">
              <div className="h-4 w-20 bg-muted/20 rounded"></div>
              <div className="h-4 w-4 bg-muted/20 rounded"></div>
              <div className="h-4 w-20 bg-muted/20 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </Grid>
  )
}

export { PostList, PostListSkeleton } 