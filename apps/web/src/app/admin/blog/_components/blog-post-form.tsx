"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { z } from "zod"
import { BlogPostStatus } from "@prisma/client"
import { blogPostSchema } from "~/server/admin/blog/validations"
import { createBlogPost, updateBlogPost } from "~/server/admin/blog/actions"
import { Button } from "~/components/admin/ui/button"
import { Input } from "~/components/admin/ui/input"
import { Textarea } from "~/components/admin/ui/textarea"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/admin/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/admin/ui/select"
import { RichTextEditor } from "~/components/admin/rich-text-editor"
import Link from "next/link"
import { format } from "date-fns"

// Define the form schema using zod
const formSchema = blogPostSchema

// Infer the types from the schema
type FormValues = z.infer<typeof formSchema>

// Define the shape of the blogPost prop as it comes from the database
interface BlogPostFromDB {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string;
  image: string | null;
  status: BlogPostStatus;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  authorName: string;
  authorImage: string | null;
  authorTwitter: string | null;
  categories: { id: string; name: string }[];
}

interface BlogPostFormProps {
  blogPost?: BlogPostFromDB;
  categories: { id: string; name: string }[];
}

export function BlogPostForm({ blogPost, categories }: BlogPostFormProps) {
  const router = useRouter()
  const isEditing = !!blogPost

  // Initialize the form with default values or existing blog post data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: blogPost
      ? {
          ...blogPost,
          categories: blogPost.categories.map((c) => c.id),
        }
      : {
          title: "",
          slug: "",
          description: "",
          content: "",
          image: "",
          status: BlogPostStatus.Draft,
          authorName: "",
          authorImage: "",
          authorTwitter: "",
        },
  })

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    try {
      if (isEditing && blogPost) {
        // Update existing blog post
        await updateBlogPost({
          id: blogPost.id,
          ...data,
        })
        toast.success("Blog post updated successfully")
      } else {
        // Create new blog post
        await createBlogPost(data)
        toast.success("Blog post created successfully")
      }
      router.push("/admin/blog")
      router.refresh()
    } catch (error) {
      console.error("Error saving blog post:", error)
      toast.error("Failed to save blog post")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter blog post title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="enter-blog-post-slug" {...field} />
                </FormControl>
                <FormDescription>
                  The URL-friendly version of the title. Used in the URL.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter a brief description of the blog post"
                  className="min-h-24"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                A short description that appears in blog post previews and meta tags.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <RichTextEditor
                  content={field.value}
                  onChange={field.onChange}
                  placeholder="Write your blog post content here..."
                  className="min-h-[400px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Featured Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.jpg" {...field} value={field.value || ""} />
                </FormControl>
                <FormDescription>URL to the featured image for this blog post.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={BlogPostStatus.Draft}>Draft</SelectItem>
                    <SelectItem value={BlogPostStatus.Scheduled}>Scheduled</SelectItem>
                    <SelectItem value={BlogPostStatus.Published}>Published</SelectItem>
                    <SelectItem value={BlogPostStatus.Archived}>Archived</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="publishedAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Publish Date</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  {...field}
                  value={field.value ? format(new Date(field.value), "yyyy-MM-dd'T'HH:mm") : ""}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : null;
                    field.onChange(date);
                  }}
                />
              </FormControl>
              <FormDescription>
                When to publish this post. Only applies to scheduled posts.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categories</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    const currentValues = Array.isArray(field.value) ? field.value : [];
                    const valueExists = currentValues.includes(value);
                    
                    if (valueExists) {
                      field.onChange(currentValues.filter((v) => v !== value));
                    } else {
                      field.onChange([...currentValues, value]);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Selected categories: {Array.isArray(field.value) && field.value.length > 0
                  ? field.value.map(id => {
                      const category = categories.find(c => c.id === id);
                      return category ? category.name : id;
                    }).join(", ")
                  : "None"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <FormField
            control={form.control}
            name="authorName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="authorImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/author.jpg" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="authorTwitter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author Twitter</FormLabel>
                <FormControl>
                  <Input placeholder="@johndoe" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" asChild>
            <Link href="/admin/blog">Cancel</Link>
          </Button>
          <Button type="submit" isPending={form.formState.isSubmitting}>
            {isEditing ? "Update" : "Create"} Blog Post
          </Button>
        </div>
      </form>
    </Form>
  )
} 