"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { posthog } from "posthog-js"
import type { HTMLAttributes } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { submitTool } from "~/actions/submit"
import { Checkbox } from "~/components/common/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/common/form"
import { Hint } from "~/components/common/hint"
import { Button } from "~/components/web/ui/button"
import { Input } from "~/components/web/ui/input"
import { type SubmitToolSchema, submitToolSchema } from "~/server/schemas"
import { cx } from "~/utils/cva"
import { Alert, AlertDescription } from "~/components/web/ui/alert"
import { InfoIcon, CheckIcon, ChevronsUpDown, X as XIcon } from "lucide-react"
import { Textarea } from "~/components/web/ui/textarea"
import { findCategories } from "~/server/web/categories/queries"
import { type CategoryMany } from "~/server/web/categories/payloads"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/web/ui/select"

type SubmitFormProps = HTMLAttributes<HTMLFormElement> & {
  categories: CategoryMany[]
}

export const SubmitForm = ({ className, categories, ...props }: SubmitFormProps) => {
  const router = useRouter()

  const form = useForm<SubmitToolSchema>({
    resolver: zodResolver(submitToolSchema),
    defaultValues: {
      name: "",
      website: "",
      tagline: "",
      submitterName: "",
      submitterEmail: "",
      xAccountUrl: "",
      logoUrl: "",
      websiteScreenshotUrl: "",
      pricingType: "Free",
      pricingDetails: "",
      newsletterOptIn: true,
      affiliateOptIn: false,
      categories: [],
    },
  })

  const { error, execute, isPending } = useServerAction(submitTool, {
    onSuccess: (response: any) => {
      if (response?.data) {
        form.reset()
        if (response.data.slug) {
          router.push(`/submit/${response.data.slug}`)
        }
      } else {
        console.error('Submission failed:', response)
        toast.error(response.error || 'Failed to submit tool')
      }
    },
    onError: (err: any) => {
      console.error('Submission error:', err)
      toast.error(err?.message || 'An unexpected error occurred')
    }
  })

  const onSubmit = form.handleSubmit(data => {
    return execute(data)
  })

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className={cx("grid w-full gap-8", className)}
        noValidate
        {...props}
      >
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            This is a free submission, it will be manually reviewed by our team and may take up to 2 weeks to be listed. Our team may contact you for more information.
          </AlertDescription>
        </Alert>

        {/* Basic Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Basic Information</h3>
          <div className="grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel isRequired>AI Agent Name</FormLabel>
                    <FormControl>
                      <Input type="text" size="lg" placeholder="MyAI Assistant" {...field} />
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
                    <FormLabel isRequired>Website URL</FormLabel>
                    <FormControl>
                      <Input type="url" size="lg" placeholder="https://myai.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tagline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tagline</FormLabel>
                  <FormControl>
                    <Input type="text" size="lg" placeholder="A short description of your AI agent" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    value={field.value?.[0] || ""}
                    onValueChange={(value) => {
                      field.onChange([value])
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.slug} value={category.slug} className="cursor-pointer">
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Media & Social */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Media & Social</h3>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="xAccountUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>X/Twitter Profile URL</FormLabel>
                  <FormControl>
                    <Input type="url" size="lg" placeholder="https://x.com/youraccount" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo URL</FormLabel>
                  <FormControl>
                    <Input type="url" size="lg" placeholder="https://example.com/logo.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="websiteScreenshotUrl"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Website Screenshot URL</FormLabel>
                  <FormControl>
                    <Input type="url" size="lg" placeholder="https://example.com/screenshot.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Pricing</h3>
          <div className="grid gap-5">
            <FormField
              control={form.control}
              name="pricingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pricing Model</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pricing model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Free">Free</SelectItem>
                      <SelectItem value="Freemium">Freemium (Free + Paid features)</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pricingDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pricing Details</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your pricing tiers, features, or any other relevant pricing information"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Submitter Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Contact Information</h3>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="submitterName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel isRequired>Your Name</FormLabel>
                  <FormControl>
                    <Input type="text" size="lg" placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="submitterEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel isRequired>Your Email</FormLabel>
                  <FormControl>
                    <Input type="email" size="lg" placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Opt-ins */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="newsletterOptIn"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="font-normal">
                  I'd like to receive free email updates about my submission
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="affiliateOptIn"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="font-normal">
                  We are willing to discuss an affiliate referral promotional code for Plaiful
                </FormLabel>
              </FormItem>
            )}
          />
        </div>

        <div>
          <Button
            variant="primary"
            isPending={isPending}
            disabled={isPending}
            className="min-w-32"
          >
            Submit for Free
          </Button>
        </div>

        {error && <Hint>{error.message}</Hint>}
      </form>
    </Form>
  )
}
