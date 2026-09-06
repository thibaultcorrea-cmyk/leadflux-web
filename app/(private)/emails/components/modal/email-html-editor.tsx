"use client"

import { useState } from "react"

import { RichTextEditor } from "@/components/shared/rich-text-editor"

type EmailHTMLEditorProps = {
    content: string
}

export const EmailHTMLEditor = ({ content }: EmailHTMLEditorProps) => {
    const [value, setValue] = useState(content)

    return (
        <div className="flex flex-col gap-3 border-t border-border pt-4">
            <RichTextEditor
                value={value}
                onChange={setValue}
                ariaLabel="Corps de l'email"
                contentClassName="min-h-[42vh] max-h-[42vh]"
            />
        </div>
    )
}
