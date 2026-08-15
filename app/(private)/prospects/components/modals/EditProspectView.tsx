"use client"

import { DialogFooter } from "@/components/ui/dialog";
import { useProspectModal } from "../../_hooks/useProspectModal"
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Prospect } from "../../types/prospect";
import { ProspectFormInputs } from "../forms/ProspectFormInputs";
import { useProspectForm } from "../../_hooks/useProspectForm";


type EditProspectModalProps = {
    prospect: Prospect;
};
export const EditProspectModal = ({ prospect }: EditProspectModalProps) => {

    const title = `Fiche prospect : ${prospect.company}`;
    const description = "Modifier les informations de la recherche";
    const confirmLabel = "Modifier";

    const { form } = useProspectForm({ defaultValues: prospect })

    const tone = "default";

    const submit = (data: any) => {
        console.log(data)
    }

    return (
        <form onSubmit={form.handleSubmit(submit)} className="w-full lg:min-w-[32vw]" >
            <DialogHeader>
                <DialogTitle className="font-display text-2xl tracking-[0.02em] text-primary-700">
                    {title}
                </DialogTitle>
                <DialogDescription className="text-sm text-ink-700">
                    {description}
                </DialogDescription>
            </DialogHeader>

            <div className="py-3" >
                <ProspectFormInputs form={form as any} />
            </div>

            <DialogFooter>

                <Button
                    type="submit"
                    className={"w-full"}
                >
                    {confirmLabel}
                </Button>
            </DialogFooter>

        </form>


    )

}
