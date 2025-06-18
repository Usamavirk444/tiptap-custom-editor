"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

export default function TiptapEditor() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Hello World! 🌎</p>",
  })

  return (
    <div className="border p-4 rounded-md">
      <EditorContent editor={editor} />
    </div>
  )
}
