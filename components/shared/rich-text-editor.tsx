"use client"

import { useEffect } from "react"
import { EditorContent, useEditor, useEditorState } from "@tiptap/react"
import { BubbleMenu } from "@tiptap/react/menus"
import StarterKit from "@tiptap/starter-kit"
import { Bold, Italic, List, ListOrdered, Underline as UnderlineIcon, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { Toggle } from "@/components/ui/toggle"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

type RichTextEditorProps = {
    value: string
    onChange: (html: string) => void
    onBlur?: () => void
    ariaLabel?: string
    className?: string
    contentClassName?: string
}

/**
 * Éditeur de texte enrichi générique (Tiptap) : gras, italique, souligné,
 * listes, via une barre flottante affichée à la sélection. Contrôlé
 * (`value`/`onChange`) pour être réutilisable aussi bien en dehors d'un
 * formulaire que câblé à React Hook Form via `RichTextController`.
 */
export const RichTextEditor = ({ value, onChange, onBlur, ariaLabel = "Zone de texte enrichi", className, contentClassName }: RichTextEditorProps) => {
    const editor = useEditor({
        extensions: [StarterKit],
        content: value,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                "aria-label": ariaLabel,
                class: cn(
                    "min-h-40 overflow-y-auto rounded-md border border-transparent px-1.5 py-2 text-sm leading-relaxed text-ink-700 outline-none transition-colors focus:border-ring [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_strong]:font-semibold [&_em]:italic [&_u]:underline",
                    contentClassName
                ),
            },
        },
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
        onBlur: () => onBlur?.(),
    })

    // Tiptap ne resynchronise pas seul son contenu si `value` change après le
    // montage initial (reset de formulaire, chargement asynchrone, etc.).
    useEffect(() => {
        if (!editor) return
        if (value !== editor.getHTML()) {
            editor.commands.setContent(value, { emitUpdate: false })
        }
    }, [editor, value])

    // useEditorState ne rafraîchit son instantané qu'au prochain événement
    // "transaction"/"update" de l'éditeur : juste après sa création, avant
    // toute interaction (clic, sélection), il reste `null` indéfiniment. Ce
    // n'est utile qu'aux boutons de la bulle de formatage (gras/italique/…),
    // jamais une raison de ne pas afficher le contenu déjà chargé.
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

    if (!editor) {
        return null
    }

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <BubbleMenu
                editor={editor}
                className="flex items-center gap-0.5 rounded-md border border-border bg-background p-1 shadow-md"
            >
                <RichTextFormattingButton
                    label="Gras"
                    icon={Bold}
                    pressed={formatState?.isBold ?? false}
                    onToggle={() => editor.chain().focus().toggleBold().run()}
                />
                <RichTextFormattingButton
                    label="Italique"
                    icon={Italic}
                    pressed={formatState?.isItalic ?? false}
                    onToggle={() => editor.chain().focus().toggleItalic().run()}
                />
                <RichTextFormattingButton
                    label="Souligné"
                    icon={UnderlineIcon}
                    pressed={formatState?.isUnderline ?? false}
                    onToggle={() => editor.chain().focus().toggleUnderline().run()}
                />
                <Separator orientation="vertical" className="mx-0.5 h-5" />
                <RichTextFormattingButton
                    label="Liste à puces"
                    icon={List}
                    pressed={formatState?.isBulletList ?? false}
                    onToggle={() => editor.chain().focus().toggleBulletList().run()}
                />
                <RichTextFormattingButton
                    label="Liste numérotée"
                    icon={ListOrdered}
                    pressed={formatState?.isOrderedList ?? false}
                    onToggle={() => editor.chain().focus().toggleOrderedList().run()}
                />
            </BubbleMenu>
            <EditorContent editor={editor} />
        </div>
    )
}

type RichTextFormattingButtonProps = {
    label: string
    icon: LucideIcon
    pressed: boolean
    onToggle: () => void
}

const RichTextFormattingButton = ({ label, icon: Icon, pressed, onToggle }: RichTextFormattingButtonProps) => {
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
