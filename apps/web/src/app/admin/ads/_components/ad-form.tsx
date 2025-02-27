"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useServerAction } from "zsa-react"
import { type HTMLAttributes } from "react"
import { AdType } from "@prisma/client"
import { type AdSchema, adSchema, AdPlacement } from "~/server/admin/ads/validations"
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
      placement: ad?.placement ?? AdPlacement.Agent,
      startsAt: ad?.startsAt ? new Date(ad.startsAt) : new Date(),
      endsAt: ad?.endsAt ? new Date(ad.endsAt) : new Date(),
      categories: ad?.categories?.map(c => c.id) ?? [],
      imageUrl: ad?.imageUrl ?? "",
      width: ad?.width ?? undefined,
      height: ad?.height ?? undefined,
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
  const watchPlacement = form.watch("placement")
  const showCategories = watchType === AdType.CategoryPage
  const showBannerFields = watchPlacement !== AdPlacement.Agent

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      console.log("Form submitted with data:", data)
      console.log("Form errors:", form.formState.errors)
      console.log("Form placement:", data.placement)
      console.log("Is banner ad:", data.placement !== AdPlacement.Agent)
      
      // Check if form has validation errors
      if (Object.keys(form.formState.errors).length > 0) {
        console.error("Form has validation errors:", form.formState.errors)
        toast.error("Please fix the form errors before submitting")
        return
      }
      
      // Only validate banner fields if placement is not Agent
      if (data.placement !== AdPlacement.Agent) {
        console.log("Validating banner fields")
        if (!data.imageUrl) {
          toast.error("Banner Image URL is required for this placement type");
          return;
        }
        if (!data.width) {
          toast.error("Width is required for this placement type");
          return;
        }
        if (!data.height) {
          toast.error("Height is required for this placement type");
          return;
        }
      }
      
      const formData = {
        ...data,
        startsAt: new Date(data.startsAt),
        endsAt: new Date(data.endsAt),
      }
      console.log("Processed form data:", formData)

      if (ad) {
        console.log("Updating ad with ID:", ad.id)
        await updateAdAction({ ...formData, id: ad.id })
      } else {
        console.log("Creating new ad")
        await createAdAction(formData)
      }
    } catch (error) {
      console.error("Form submission error:", error)
      toast.error(`Form submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  })

  const isPending = isCreating || isUpdating

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className={cx("space-y-8", className)}
        noValidate
        {...props}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Plaiful" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="e.g. hello@plaiful.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. A brief description of your ad" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input type="url" placeholder="e.g. https://plaiful.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="faviconUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Favicon URL</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="/plaiful-logo.png" 
                    value={field.value ?? ''} 
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
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

          <FormField
            control={form.control}
            name="placement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Placement</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select placement" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(AdPlacement).map((placement) => (
                        <SelectItem key={placement} value={placement}>
                          {placement}
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categories</FormLabel>
                  <FormControl>
                    <RelationSelector
                      relations={categories}
                      selectedIds={field.value ?? []}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {showBannerFields && (
            <>
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormLabel>Banner Image URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. /placeholders/banner.jpg or https://example.com/banner.jpg"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Width (px)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="e.g. 728"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (px)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="e.g. 90"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <FormField
            control={form.control}
            name="startsAt"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <DateTimePicker
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endsAt"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <DateTimePicker
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-end gap-4">
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
              <span>{ad ? "Update" : "Create"}</span>
            )}
          </Button>
        </div>

        {children}
      </form>
    </Form>
  )
} 