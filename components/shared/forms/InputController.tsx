"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@base-ui/react"
import { Control, Controller } from "react-hook-form"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,

} from "@/components/ui/field"


const InputController = ({
    control,
    name,
    label,
    type,
    description,
}: {
    control: Control<any>
    name: string
    label: string
    type: string
    description?: string
}) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <Field>
                    {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
                    <Input id={name} {...field} type={type} placeholder={label} />
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