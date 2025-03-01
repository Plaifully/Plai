import type { ComponentProps } from "react"
import { RichTextContent } from "~/components/admin/rich-text-editor"
import { Author } from "~/components/web/ui/author"
import type { config } from "~/config"
import { cx } from "~/utils/cva"

type TestimonialProps = ComponentProps<"blockquote"> & (typeof config.ads.testimonials)[number]

export const Testimonial = ({ quote, author, className, ...props }: TestimonialProps) => {
  return (
    <blockquote
      className={cx("flex flex-col items-center gap-4 max-w-2xl mx-auto", className)}
      {...props}
    >
      <RichTextContent className="text-center text-lg/relaxed" content={quote} />

      <Author {...author} />
    </blockquote>
  )
}
