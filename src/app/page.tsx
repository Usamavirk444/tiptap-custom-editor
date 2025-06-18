import EditorDemo from "@/components/editor-demo";
import TiptapEditor from "@/components/TiptapEditor";
import Image from "next/image";

export default function Home() {
   return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">My Tiptap Editor</h1>
      <TiptapEditor />
      <EditorDemo />
    </main>
  )
}
