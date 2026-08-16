"use client"

import { useFetchEmails } from "../_hooks/useFetchEmail"
import { EmailsHeader } from "./emails-header"
import { EmailsTablePanel } from "./table/emails-table-panel"




export default function EmailsClient() {
    const { data, isLoading, error } = useFetchEmails()
    const emails = data?.emailsProspects || []

    console.log(data);


    return (
        <div>
            <EmailsHeader total={emails.length} />
            <EmailsTablePanel data={emails} />
        </div>
    )
}