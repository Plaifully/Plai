"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useForm, type FieldValues, type ControllerRenderProps } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useServerAction } from "zsa-react"
import { type HTMLAttributes } from "react"
import { type AdType } from "@plai/db/client"
import { type AdSchema, adSchema } from "~/server/admin/ads/validations"
import { createAd, updateAd } from "~/server/admin/ads/actions"
import { findAdById } from "~/server/admin/ads/queries"
import { Button } from "~/components/admin/ui/button"
import { Input } from "~/components/admin/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/admin/ui/select"
import { DateTimePicker } from "~/components/admin/date-time-picker"
import Link from "next/link"
import { Loader2Icon } from "lucide-react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/common/form"

type AdFormProps = HTMLAttributes<HTMLFormElement> & {
  ad?: Awaited<ReturnType<typeof findAdById>>
}

type FormField<T extends FieldValues> = ControllerRenderProps<T>

export function AdForm({ children, className, ad, ...props }: AdFormProps) {
  const router = useRouter()
  const form = useForm<AdSchema>({
    resolver: zodResolver(adSchema),
    defaultValues: {
      name: ad?.name ?? "",
      email: ad?.email ?? "",
      description: ad?.description ?? "",
      website: ad?.website ?? "",
      type: (ad?.type as AdType) ?? "Homepage",
      startsAt: ad?.startsAt ?? new Date(),
      endsAt: ad?.endsAt ?? new Date(),
    },
  })

  const { execute: createAdAction, isPending: isCreating } = useServerAction(createAd, {
    onSuccess: () => {
      toast.success("Ad successfully created")
      router.push("/admin/ads")
    },
    onError: ({ err }) => {
      toast.error(err.message)
    },
  })

  const { execute: updateAdAction, isPending: isUpdating } = useServerAction(updateAd, {
    onSuccess: () => {
      toast.success("Ad successfully updated")
      router.push("/admin/ads")
    },
    onError: ({ err }) => {
      toast.error(err.message)
    },
  })

  const isPending = isCreating || isUpdating

  return (
    <Form {...form}>
      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={form.handleSubmit(data => {
          if (ad) {
            updateAdAction({ ...data, id: ad.id })
          } else {
            createAdAction(data)
          }
        })}
        {...props}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }: { field: FormField<AdSchema> }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Plaiful" value={field.value as string} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }: { field: FormField<AdSchema> }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="e.g. hello@plaiful.com" value={field.value as string} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }: { field: FormField<AdSchema> }) => (
            <FormItem className="col-span-full">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="e.g. A brief description of your ad" value={field.value as string} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }: { field: FormField<AdSchema> }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input type="url" placeholder="e.g. https://plaiful.com" value={field.value as string} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }: { field: FormField<AdSchema> }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value as string}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ad type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Banner">Banner</SelectItem>
                  <SelectItem value="Homepage">Homepage</SelectItem>
                  <SelectItem value="ToolPage">Tool Page</SelectItem>
                  <SelectItem value="BlogPost">Blog Post</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startsAt"
          render={({ field }: { field: FormField<AdSchema> }) => (
            <FormItem>
              <FormLabel>Starts At</FormLabel>
              <FormControl>
                <DateTimePicker value={field.value as Date} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endsAt"
          render={({ field }: { field: FormField<AdSchema> }) => (
            <FormItem>
              <FormLabel>Ends At</FormLabel>
              <FormControl>
                <DateTimePicker value={field.value as Date} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-full flex justify-end gap-4">
          <Button variant="outline" asChild>
            <Link href="/admin/ads">Cancel</Link>
          </Button>
          <Button 
            type="submit" 
            disabled={isPending}
            className="min-w-[100px]"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <Loader2Icon className="h-4 w-4 animate-spin" />
                <span>{ad ? "Updating..." : "Creating..."}</span>
              </div>
            ) : (
              <span>{ad ? "Update ad" : "Create ad"}</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
} 