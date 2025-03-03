import type { ComponentProps } from "react"
import { Stack } from "~/components/common/stack"
import { Image } from "~/components/web/ui/image"

type AuthorProps = ComponentProps<typeof Stack> & {
  name: string
  image: string
  title?: string
}

export const Author = ({ name, image, title, ...props }: AuthorProps) => {
  return (
    <Stack size="sm" {...props}>
      <Image
        src={image}
        alt={`${name}'s profile`}
        width={48}
        height={48}
        className="size-12 rounded-full group-hover:brightness-90 p-3 bg-black"
      />

      <div>
        <h3 className="font-medium text-base truncate">{name}</h3>
        {title && <div className="text-muted text-sm/tight">{title}</div>}
      </div>
    </Stack>
  )
}
