"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
    company: z.string(),
    contactName: z.string(),
    contactRole: z.string(),
    sector: z.string(),
    city: z.string(),
    headcountLabel: z.string(),
    headcountMin: z.number(),
    headcountMax: z.number(),
})


export const useProspectForm = () => {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            company: "",
            contactName: "",
            contactRole: "",
            sector: "",
            city: "",
            headcountLabel: "",
            headcountMin: 0,
            headcountMax: 0,
        },
    })

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log(data)
    }

    return {
        form,
        onSubmit
    }
}