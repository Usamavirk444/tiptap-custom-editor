"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Extension } from "@tiptap/core"
import { Plugin, PluginKey } from "@tiptap/pm/state"
import { Decoration, DecorationSet } from "@tiptap/pm/view"
import { useState } from "react"
import { Bold, Italic, Quote, List, ListOrdered, Type, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Custom Paragraph Styles Extension
const CustomParagraphStyles = Extension.create({
  name: "customParagraphStyles",

  addGlobalAttributes() {
    return [
      {
        types: ["paragraph"],
        attributes: {
          style: {
            default: "default",
            parseHTML: (element) => element.getAttribute("data-style") || "default",
            renderHTML: (attributes) => {
              if (attributes.style === "default") {
                return {}
              }
              return {
                "data-style": attributes.style,
                class: `paragraph-${attributes.style}`,
              }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setParagraphStyle:
        (style: string) =>
        ({ commands }) => {
          return commands.updateAttributes("paragraph", { style })
        },
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("customParagraphStyles"),
        props: {
          decorations(state) {
            const decorations: Decoration[] = []
            const doc = state.doc

            doc.descendants((node, pos) => {
              if (node.type.name === "paragraph") {
                const style = node.attrs.style
                if (style && style !== "default") {
                  const decoration = Decoration.node(pos, pos + node.nodeSize, {
                    class: `paragraph-${style}`,
                  })
                  decorations.push(decoration)
                }
              }
            })

            return DecorationSet.create(doc, decorations)
          },
        },
      }),
    ]
  },
})

const paragraphStyles = [
  { name: "Default", value: "default", description: "Regular paragraph" },
  { name: "Highlight", value: "highlight", description: "Highlighted paragraph with accent border" },
  { name: "Quote", value: "quote", description: "Styled quote paragraph" },
  { name: "Info", value: "info", description: "Information callout" },
  { name: "Warning", value: "warning", description: "Warning callout" },
  { name: "Success", value: "success", description: "Success callout" },
  { name: "Code Block", value: "code", description: "Code-style paragraph" },
]

interface TiptapEditorProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
}

export default function TiptapEditor({ content = "", onChange, placeholder = "Start writing..." }: TiptapEditorProps) {
  const [currentStyle, setCurrentStyle] = useState("default")

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: "paragraph-default",
          },
        },
      }),
      CustomParagraphStyles,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
    onSelectionUpdate: ({ editor }) => {
      const { from } = editor.state.selection
      const node = editor.state.doc.nodeAt(from)
      if (node?.type.name === "paragraph") {
        setCurrentStyle(node.attrs.style || "default")
      }
    },
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none focus:outline-none min-h-[400px] p-6",
      },
    },
  })

  if (!editor) {
    return null
  }

  const setParagraphStyle = (style: string) => {
    editor.chain().focus().setParagraphStyle(style).run()
    setCurrentStyle(style)
  }

  const currentStyleInfo = paragraphStyles.find((s) => s.value === currentStyle) || paragraphStyles[0]

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-4 border-b border-gray-700 bg-gray-800/50">
        {/* Paragraph Style Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
              <Type className="h-4 w-4 mr-2" />
              {currentStyleInfo.name}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gray-800 border-gray-600 text-white min-w-[250px]">
            {paragraphStyles.map((style) => (
              <DropdownMenuItem
                key={style.value}
                onClick={() => setParagraphStyle(style.value)}
                className="hover:bg-gray-700 focus:bg-gray-700"
              >
                <div>
                  <div className="font-medium">{style.name}</div>
                  <div className="text-xs text-gray-400">{style.description}</div>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="w-px h-6 bg-gray-600 mx-2" />

        {/* Text Formatting */}
        <Button
          variant={editor.isActive("bold") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          variant={editor.isActive("italic") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-600 mx-2" />

        {/* Lists */}
        <Button
          variant={editor.isActive("bulletList") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          variant={editor.isActive("orderedList") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-600 mx-2" />

        {/* Quote */}
        <Button
          variant={editor.isActive("blockquote") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
        >
          <Quote className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <div className="relative">
        <EditorContent editor={editor} className="tiptap-editor" />
        {editor.isEmpty && <div className="absolute top-6 left-6 text-gray-500 pointer-events-none">{placeholder}</div>}
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .tiptap-editor {
          background: #111827;
          color: #f9fafb;
        }

        .tiptap-editor .ProseMirror {
          outline: none;
        }

        .tiptap-editor p {
          margin: 1rem 0;
          line-height: 1.6;
        }

        .tiptap-editor .paragraph-default {
          color: #f9fafb;
        }

        .tiptap-editor .paragraph-highlight {
          background: linear-gradient(90deg, #f59e0b 0%, transparent 100%);
          border-left: 4px solid #f59e0b;
          padding: 1rem 1.5rem;
          margin: 1.5rem 0;
          background-color: rgba(245, 158, 11, 0.1);
          border-radius: 0 8px 8px 0;
        }

        .tiptap-editor .paragraph-quote {
          border-left: 4px solid #6b7280;
          padding: 1rem 1.5rem;
          margin: 1.5rem 0;
          background-color: rgba(107, 114, 128, 0.1);
          font-style: italic;
          color: #d1d5db;
          border-radius: 0 8px 8px 0;
        }

        .tiptap-editor .paragraph-info {
          border-left: 4px solid #3b82f6;
          padding: 1rem 1.5rem;
          margin: 1.5rem 0;
          background-color: rgba(59, 130, 246, 0.1);
          color: #93c5fd;
          border-radius: 0 8px 8px 0;
        }

        .tiptap-editor .paragraph-warning {
          border-left: 4px solid #f59e0b;
          padding: 1rem 1.5rem;
          margin: 1.5rem 0;
          background-color: rgba(245, 158, 11, 0.1);
          color: #fbbf24;
          border-radius: 0 8px 8px 0;
        }

        .tiptap-editor .paragraph-success {
          border-left: 4px solid #10b981;
          padding: 1rem 1.5rem;
          margin: 1.5rem 0;
          background-color: rgba(16, 185, 129, 0.1);
          color: #6ee7b7;
          border-radius: 0 8px 8px 0;
        }

        .tiptap-editor .paragraph-code {
          background-color: #1f2937;
          border: 1px solid #374151;
          border-radius: 8px;
          padding: 1rem 1.5rem;
          margin: 1.5rem 0;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.9em;
          color: #e5e7eb;
          border-left: 4px solid #6366f1;
        }

        .tiptap-editor blockquote {
          border-left: 4px solid #6b7280;
          padding: 1rem 1.5rem;
          margin: 1.5rem 0;
          background-color: rgba(107, 114, 128, 0.1);
          font-style: italic;
          color: #d1d5db;
        }

        .tiptap-editor ul, .tiptap-editor ol {
          padding-left: 2rem;
          margin: 1rem 0;
        }

        .tiptap-editor li {
          margin: 0.5rem 0;
        }

        .tiptap-editor strong {
          color: #f9fafb;
          font-weight: 600;
        }

        .tiptap-editor em {
          color: #d1d5db;
        }

        .tiptap-editor h1, .tiptap-editor h2, .tiptap-editor h3 {
          color: #f9fafb;
          font-weight: 600;
          margin: 2rem 0 1rem 0;
        }

        .tiptap-editor h1 {
          font-size: 2rem;
        }

        .tiptap-editor h2 {
          font-size: 1.5rem;
        }

        .tiptap-editor h3 {
          font-size: 1.25rem;
        }
      `}</style>
    </div>
  )
}
