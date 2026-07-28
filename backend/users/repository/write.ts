import { db } from "@/db";
import { user } from "@/db/schemas/authSchema";
import { eq } from "drizzle-orm";


export const UserWriteRepository = {

    setAdminStatus: async (id: string, status: boolean) => {
        await db.update(user).set({
            isAdmin: status
        }).where(eq(user.id, id));
    }

}