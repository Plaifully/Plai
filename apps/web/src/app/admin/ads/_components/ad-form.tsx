"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useForm, type FieldValues, type ControllerRenderProps } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useServerAction } from "zsa-react"
import { type HTMLAttributes } from "react"
import { AdType } from "@plai/db/client"
import { type AdSchema, adSchema } from "~/server/admin/ads/validations"
import { createAd, updateAd } from "~/server/admin/ads/actions"
import { findAdById } from "~/server/admin/ads/queries"
import { findCategoryList } from "~/server/admin/categories/queries"
import { Button } from "~/components/admin/ui/button"
import { Input } from "~/components/admin/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/admin/ui/select"
import { DateTimePicker } from "~/components/admin/date-time-picker"
import { RelationSelector } from "~/components/admin/relation-selector"
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
import { cx } from "~/utils/cva"

type AdFormProps = HTMLAttributes<HTMLFormElement> & {
  ad?: Awaited<ReturnType<typeof findAdById>>
  categories: Awaited<ReturnType<typeof findCategoryList>>
}

type FormField<T extends FieldValues> = ControllerRenderProps<T>

export function AdForm({ children, className, ad, categories, ...props }: AdFormProps) {
  const router = useRouter()
  const form = useForm<AdSchema>({
    resolver: zodResolver(adSchema),
    defaultValues: {
      name: ad?.name ?? "",
      email: ad?.email ?? "",
      description: ad?.description ?? "",
      website: ad?.website ?? "",
      faviconUrl: ad?.faviconUrl ?? "",
      type: ad?.type ?? AdType.Homepage,
      startsAt: ad?.startsAt ? new Date(ad.startsAt) : new Date(),
      endsAt: ad?.endsAt ? new Date(ad.endsAt) : new Date(),
      categories: ad?.categories?.map(c => c.id) ?? [],
    },
  })

  const { execute: createAdAction, isPending: isCreating } = useServerAction(createAd, {
    onSuccess: () => {
      toast.success("Ad successfully created")
      router.push("/admin/ads")
    },
    onError: ({ err }) => {
      toast.error(`Failed to create ad: ${err.message}`)
    },
  })

  const { execute: updateAdAction, isPending: isUpdating } = useServerAction(updateAd, {
    onSuccess: () => {
      toast.success("Ad successfully updated")
      router.push("/admin/ads")
    },
    onError: ({ err }) => {
      toast.error(`Failed to update ad: ${err.message}`)
    },
  })

  const watchType = form.watch("type")
  const showCategories = watchType === AdType.CategoryPage

  return (
    <Form
      form={form}
      className={cx("grid gap-4 sm:grid-cols-2", className)}
      onSubmit={form.handleSubmit(async data => {
        try {
          const formData = {
            ...data,
            startsAt: new Date(data.startsAt),
            endsAt: new Date(data.endsAt),
          }

          if (ad) {
            await updateAdAction({ ...formData, id: ad.id })
          } else {
            await createAdAction(formData)
          }
        } catch (error) {
          toast.error(`Form submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
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
        name="faviconUrl"
        render={({ field }: { field: FormField<AdSchema> }) => (
          <FormItem>
            <FormLabel>Favicon URL</FormLabel>
            <FormControl>
              <Input 
                placeholder="/plaiful-logo.png" 
                value={field.value as string} 
                onChange={(e) => {
                  const value = e.target.value.trim();
                  field.onChange(value || undefined);
                }}
              />
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
            <FormControl>
              <Select
                value={field.value as AdType}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(AdType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {showCategories && (
        <FormField
          control={form.control}
          name="categories"
          render={({ field }: { field: FormField<AdSchema> }) => (
            <FormItem>
              <FormLabel>Categories</FormLabel>
              <FormControl>
                <RelationSelector
                  relations={categories}
                  selectedIds={field.value as string[]}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

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

      <div className="col-span-full flex justify-start gap-4 mt-6">
        <Button variant="outline" asChild>
          <Link href="/admin/ads">Cancel</Link>
        </Button>
        <Button 
          type="submit" 
          disabled={isCreating || isUpdating}
          className="min-w-[100px]"
        >
          {isCreating || isUpdating ? (
            <div className="flex items-center gap-2">
              <Loader2Icon className="h-4 w-4 animate-spin" />
              <span>{ad ? "Updating..." : "Creating..."}</span>
            </div>
          ) : (
            <span>{ad ? "Update ad" : "Create ad"}</span>
          )}
        </Button>
      </div>
    </Form>
  )
} 