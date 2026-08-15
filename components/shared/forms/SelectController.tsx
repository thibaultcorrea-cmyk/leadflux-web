"use client"

import { Input } from "@base-ui/react"
import { Control, Controller } from "react-hook-form"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,

} from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UseFormReturn } from "react-hook-form"

type OptionItem = { value: string; label: string } & Record<string, any>;

const SelectController = ({
    form,
    name,
    label,
    description,
    options
}: {
    form: UseFormReturn<any>
    name: string
    label: string
    description?: string
    options: OptionItem[]
}) => {

    const { control, formState: { errors } } = form

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <Field>
                    {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
                    <Select {...field} >
                        <SelectTrigger className="w-full py-5">
                            <SelectValue placeholder={label} />
                        </SelectTrigger>
                        <SelectContent className="p-1">
                            {options.map((option) => (
                                <SelectItem className="py-2" key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>


                    {
                        description && <FieldDescription>
                            {description}
                        </FieldDescription>
                    }
                    {errors[field.name] && <FieldError>{errors[field.name]?.message as any}</FieldError>}

                </Field >

            )}
        />
    )
}

export default SelectController