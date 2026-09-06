"use client"

import { EditorContent, useEditor, useEditorState } from "@tiptap/react"
import { BubbleMenu } from "@tiptap/react/menus"
import StarterKit from "@tiptap/starter-kit"
import { Bold, Italic, List, ListOrdered, Underline as UnderlineIcon, type LucideIcon } from "lucide-react"

import { Separator } from "@/components/ui/separator"
import { Toggle } from "@/components/ui/toggle"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

type EmailHTMLEditorProps = {
    content: string
}

export const EmailHTMLEditor = ({ content }: EmailHTMLEditorProps) => {
    const editor = useEditor({
        extensions: [StarterKit],
        content,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                "aria-label": "Corps de l'email",
                class:
                    "min-h-[42vh] max-h-[42vh] overflow-y-auto rounded-md border border-transparent px-1.5 py-2 text-sm leading-relaxed text-ink-700 outline-none transition-colors focus:border-ring [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_strong]:font-semibold [&_em]:italic [&_u]:underline",
            },
        },
    })

    const formatState = useEditorState({
        editor,
        selector: ({ editor }) =>
            editor
                ? {
                    isBold: editor.isActive("bold"),
                    isItalic: editor.isActive("italic"),
                    isUnderline: editor.isActive("underline"),
                    isBulletList: editor.isActive("bulletList"),
                    isOrderedList: editor.isActive("orderedList"),
                }
                : null,
    })

    if (!editor || !formatState) {
        return null
    }

    return (
        <div className="flex flex-col gap-3 border-t border-border pt-4">
            <BubbleMenu
                editor={editor}
                className="flex items-center gap-0.5 rounded-md border border-border bg-background p-1 shadow-md"
            >
                <EmailFormattingButton
                    label="Gras"
                    icon={Bold}
                    pressed={formatState.isBold}
                    onToggle={() => editor.chain().focus().toggleBold().run()}
                />
                <EmailFormattingButton
                    label="Italique"
                    icon={Italic}
                    pressed={formatState.isItalic}
                    onToggle={() => editor.chain().focus().toggleItalic().run()}
                />
                <EmailFormattingButton
                    label="Souligné"
                    icon={UnderlineIcon}
                    pressed={formatState.isUnderline}
                    onToggle={() => editor.chain().focus().toggleUnderline().run()}
                />
                <Separator orientation="vertical" className="mx-0.5 h-5" />
                <EmailFormattingButton
                    label="Liste à puces"
                    icon={List}
                    pressed={formatState.isBulletList}
                    onToggle={() => editor.chain().focus().toggleBulletList().run()}
                />
                <EmailFormattingButton
                    label="Liste numérotée"
                    icon={ListOrdered}
                    pressed={formatState.isOrderedList}
                    onToggle={() => editor.chain().focus().toggleOrderedList().run()}
                />
            </BubbleMenu>
            <EditorContent editor={editor} />
        </div>
    )
}

type EmailFormattingButtonProps = {
    label: string
    icon: LucideIcon
    pressed: boolean
    onToggle: () => void
}

const EmailFormattingButton = ({ label, icon: Icon, pressed, onToggle }: EmailFormattingButtonProps) => {
    return (
        <Tooltip>
            <TooltipTrigger
                render={
                    <Toggle
                        size="sm"
                        pressed={pressed}
                        onPressedChange={onToggle}
                        aria-label={label}
                    />
                }
            >
                <Icon className="size-4" aria-hidden />
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
        </Tooltip>
    )
}
