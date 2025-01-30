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
import { InfoIcon } from "lucide-react"

export const SubmitForm = ({ className, ...props }: HTMLAttributes<HTMLFormElement>) => {
  const router = useRouter()

  const form = useForm<SubmitToolSchema>({
    resolver: zodResolver(submitToolSchema),
    defaultValues: {
      name: "",
      website: "",
      submitterName: "",
      submitterEmail: "",
      newsletterOptIn: true,
    },
  })

  const { error, execute, isPending } = useServerAction(submitTool, {
    onSuccess: ({ data }) => {
      form.reset()
      posthog.capture("submit_tool", { slug: data.slug })
      router.push(`/submit/${data.slug}`)
    },
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(data => execute(data))}
        className={cx("grid w-full gap-5", className)}
        noValidate
        {...props}
      >
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            This is a free submission. It will be manually reviewed and may take up to 2 weeks to be listed.
            For faster listing times and enhanced visibility, please check our{" "}
            <a href="#pricing" className="font-medium underline underline-offset-4">
              premium options
            </a>
            .
          </AlertDescription>
        </Alert>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="submitterName"
            render={({ field }) => (
              <FormItem>
                <FormLabel isRequired>Your Name:</FormLabel>
                <FormControl>
                  <Input type="text" size="lg" placeholder="John Doe" data-1p-ignore {...field} />
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
                <FormLabel isRequired>Your Email:</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    size="lg"
                    placeholder="john@doe.com"
                    data-1p-ignore
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel isRequired>AI Agent Name:</FormLabel>
                <FormControl>
                  <Input type="text" size="lg" placeholder="MyAI Assistant" data-1p-ignore {...field} />
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
                <FormLabel isRequired>Website URL:</FormLabel>
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
