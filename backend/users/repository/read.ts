import { db } from "@/db";
import { user } from "@/db/schemas/authSchema";
import { eq } from "drizzle-orm";


export const UserReadRepository = {

    getUserById: async (id: string) => {
        const [userData] = await db.select().from(user).where(eq(user.id, id)).limit(1);
        return userData;
    }

}


