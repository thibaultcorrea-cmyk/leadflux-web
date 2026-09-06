"use client"

import { Controller, UseFormReturn } from "react-hook-form"

import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from "@/components/ui/field"
import { RichTextEditor } from "@/components/shared/rich-text-editor"

const RichTextController = ({
    form,
    name,
    label,
    description,
}: {
    form: UseFormReturn<any>
    name: string
    label: string
    description?: string
}) => {

    const { control, formState: { errors } } = form

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <Field>
                    {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
                    <RichTextEditor
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        ariaLabel={label}
                    />

                    {
                        description && <FieldDescription>
                            {description}
                        </FieldDescription>
                    }
                    {errors[field.name] && <FieldError>{errors[field.name]?.message as any}</FieldError>}

                </Field>

            )}
        />
    )
}

export default RichTextController
