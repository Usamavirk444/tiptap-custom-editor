"use client"

import { useState } from "react"
import TiptapEditor from "./tiptap-editor"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Code } from "lucide-react"

export default function EditorDemo() {
  const [content, setContent] = useState(`
    <p data-style="highlight">Hello</p>
    <p data-style="quote">This is a test</p>
    <p>Welcome to the enhanced Tiptap editor with custom paragraph formatting!</p>
    <p data-style="info">This is an info callout - perfect for highlighting important information.</p>
    <p data-style="warning">This is a warning callout - use it to draw attention to potential issues.</p>
    <p data-style="success">This is a success callout - great for positive feedback and confirmations.</p>
    <p data-style="code">This is a code-style paragraph - ideal for inline code snippets or technical content.</p>
  `)

  const [showPreview, setShowPreview] = useState(false)

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Enhanced Tiptap Editor</h1>
          <p className="text-gray-400">Custom paragraph formatting with multiple styles</p>
        </div>

        <div className="flex justify-center gap-2">
          <Button
            variant={!showPreview ? "default" : "outline"}
            onClick={() => setShowPreview(false)}
            className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
          >
            <Code className="h-4 w-4 mr-2" />
            Editor
          </Button>
          <Button
            variant={showPreview ? "default" : "outline"}
            onClick={() => setShowPreview(true)}
            className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </div>

        {!showPreview ? (
          <TiptapEditor
            content={content}
            onChange={setContent}
            placeholder="Start writing with custom paragraph styles..."
          />
        ) : (
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">HTML Output Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm text-gray-300 whitespace-pre-wrap bg-gray-800 p-4 rounded-lg overflow-auto">
                {content}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Style Guide */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Available Paragraph Styles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="text-white font-medium">Default</h3>
                <p className="text-gray-400 text-sm">Regular paragraph text</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-white font-medium">Highlight</h3>
                <p className="text-gray-400 text-sm">Highlighted paragraph with accent border</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-white font-medium">Quote</h3>
                <p className="text-gray-400 text-sm">Styled quote paragraph</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-white font-medium">Info</h3>
                <p className="text-gray-400 text-sm">Information callout in blue</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-white font-medium">Warning</h3>
                <p className="text-gray-400 text-sm">Warning callout in amber</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-white font-medium">Success</h3>
                <p className="text-gray-400 text-sm">Success callout in green</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-white font-medium">Code Block</h3>
                <p className="text-gray-400 text-sm">Code-style paragraph with monospace font</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
