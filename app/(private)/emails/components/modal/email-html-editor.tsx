"use client"

type EmailHTMLEditorProps = {
    content: string
}

export const EmailHTMLEditor = ({ content }: EmailHTMLEditorProps) => {

    return (
        <div className="flex flex-col gap-3 border-t border-border pt-4 ">
            <p className="text-sm leading-relaxed text-ink-700 whitespace-pre-line px-1.5 overflow-y-auto max-h-[42vh]">
                {content}
            </p>
        </div>
    )
}