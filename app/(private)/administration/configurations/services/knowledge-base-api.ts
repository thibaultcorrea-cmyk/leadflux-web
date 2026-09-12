import { API_BASE_URL } from "@/core/params";

export const createKnowledgeBaseVersion = async (input: { fileId: string; name: string }) => {
  const url = new URL("/api/v1/knowledge-bases", API_BASE_URL);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Échec de la création de la version de la base de connaissances");
  return res.json();
};
