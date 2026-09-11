import { Textarea } from "@/components/ui/textarea";

/** Contenu du mode "Coller le texte" du segmented control. */
export function KnowledgeBasePasteInput() {
  return (
    <Textarea
      placeholder="Collez ici le texte de votre base de connaissances..."
      className="h-44 resize-none bg-background-100 text-sm"
    />
  );
}
