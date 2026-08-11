"use client"

import { Label } from "@/components/ui/label"
import { Control, Controller } from "react-hook-form"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,

} from "@/components/ui/field"
import { Input } from "@/components/ui/input"


const InputController = ({
    control,
    name,
    label,
    type,
    description,
    placeholder
}: {
    control: Control<any>
    name: string
    label: string
    type: string
    description?: string
    placeholder?: string
}) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <Field>
                    {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
                    <Input id={name} {...field} type={type} placeholder={placeholder} />
                    {
                        description && <FieldDescription>
                            {description}
                        </FieldDescription>
                    }

                </Field>

            )}
        />
    )
}

export default InputController