import { EmailPreviewClient } from "./components/EmailPreviewClient";

export default async function EmailApercuEmailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EmailPreviewClient emailId={id} />;
}
