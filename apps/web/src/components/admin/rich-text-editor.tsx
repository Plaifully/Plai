"use client"

import { useEditor, EditorContent, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import { 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  Heading3,
  Heading4,
  List, 
  ListOrdered, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Code, 
  Quote 
} from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { Button } from "~/components/admin/ui/button"
import { cx } from "~/utils/cva"
import { Prose } from "~/components/web/ui/prose"

// Add custom styles to fix editor issues
const editorStyles = `
  .ProseMirror {
    outline: none !important;
    box-shadow: none !important;
    color: var(--color-foreground) !important;
    min-height: 300px;
    max-height: none !important;
    overflow-y: auto;
  }
  
  .ProseMirror:focus {
    outline: none !important;
    border-color: transparent !important;
    box-shadow: none !important;
    ring: 0 !important;
  }
  
  .ProseMirror p {
    color: var(--color-foreground) !important;
  }
  
  .ProseMirror-focused {
    outline: none !important;
    border: none !important;
    box-shadow: none !important;
  }
  
  /* Remove any character limits */
  .ProseMirror * {
    max-width: none !important;
  }
  
  /* Ensure content doesn't overflow */
  .prose {
    width: 100%;
    max-width: 100% !important;
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;
  }
  
  .prose img {
    max-width: 100% !important;
    height: auto !important;
  }
  
  .prose pre {
    max-width: 100% !important;
    overflow-x: auto !important;
    white-space: pre-wrap !important;
  }
  
  @media (max-width: 768px) {
    .prose * {
      max-width: 100% !important;
    }
  }
`;

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({ 
  content, 
  onChange, 
  placeholder = "Write something...",
  className 
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false)

  // Initialize the editor
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: cx(
          "p-4 text-secondary text-pretty leading-relaxed",
          "prose prose-neutral dark:prose-invert max-w-none prose-a:font-normal prose-a:text-foreground prose-a:hover:text-primary prose-hr:border-foreground prose-strong:text-foreground prose-p:first:mt-0 prose-p:last:mb-0 prose-ul:first:mt-0 prose-ul:last:mb-0 prose-li:mt-2 prose-li:first:m-0 prose-img:border prose-img:border-neutral-200 prose-img:rounded-md prose-lead:text-lg/relaxed prose-pre:font-mono prose-pre:rounded-none",
          "prose-headings:scroll-mt-20 prose-headings:text-foreground prose-headings:font-semibold prose-headings:tracking-tight",
          "prose-code:before:hidden prose-code:after:hidden prose-code:bg-foreground/10 prose-code:rounded prose-code:mx-[0.088em] prose-code:px-[0.33em] prose-code:py-[0.166em] prose-code:font-normal",
          "prose-h1:text-3xl md:prose-h1:text-4xl prose-h2:text-2xl md:prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-h5:text-base prose-h5:font-medium prose-h5:tracking-micro prose-h6:text-sm prose-h6:font-medium prose-h6:tracking-normal")
      },
    },
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        // Remove any character limits
        history: {
          depth: 100,
          newGroupDelay: 500,
        },
      }),
      Placeholder.configure({
        placeholder,
        showOnlyWhenEditable: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full rounded-md',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }: { editor: Editor }) => {
      onChange(editor.getHTML())
    },
  })

  // Handle image insertion
  const addImage = useCallback(() => {
    if (!editor) return
    
    const url = window.prompt('Enter image URL')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  // Handle link insertion
  const setLink = useCallback(() => {
    if (!editor) return
    
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('Enter URL', previousUrl)
    
    if (url === null) return
    
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  // Client-side only
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className={cx("rounded-md border-0", className)}>
      <style jsx global>{editorStyles}</style>
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={editor?.isActive('bold') ? 'bg-muted' : ''}
          aria-label="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={editor?.isActive('italic') ? 'bg-muted' : ''}
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor?.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}
          aria-label="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor?.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}
          aria-label="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor?.isActive('heading', { level: 3 }) ? 'bg-muted' : ''}
          aria-label="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 4 }).run()}
          className={editor?.isActive('heading', { level: 4 }) ? 'bg-muted' : ''}
          aria-label="Heading 4"
        >
          <Heading4 className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={editor?.isActive('bulletList') ? 'bg-muted' : ''}
          aria-label="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={editor?.isActive('orderedList') ? 'bg-muted' : ''}
          aria-label="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={setLink}
          className={editor?.isActive('link') ? 'bg-muted' : ''}
          aria-label="Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addImage}
          aria-label="Image"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          className={editor?.isActive('codeBlock') ? 'bg-muted' : ''}
          aria-label="Code Block"
        >
          <Code className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          className={editor?.isActive('blockquote') ? 'bg-muted' : ''}
          aria-label="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>
      </div>
      
      <EditorContent editor={editor} className="focus-visible:outline-none focus-visible:ring-0" />
    </div>
  )
}

// Component to render rich text content
export function RichTextContent({ content, className }: { content: string; className?: string }) {
  return (
    <Prose 
      className={cx(
        "max-w-full overflow-hidden", 
        "prose-img:max-w-full prose-img:h-auto", 
        "prose-pre:overflow-x-auto prose-pre:whitespace-pre-wrap",
        className
      )} 
      dangerouslySetInnerHTML={{ __html: content }} 
    />
  )
} 