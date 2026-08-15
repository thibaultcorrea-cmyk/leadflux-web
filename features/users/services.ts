
import { UserReadRepository } from "./repository/read";
import { UserValidator } from "./dto/validator";
import { UserWriteRepository } from "./repository/write";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const UserServices = {

    getUserById: async (id: string) => {
        const validId = UserValidator.idParamValidator(id);
        if (!validId.success) {
            throw validId.error;
        }
        return UserReadRepository.getUserById(validId.data);
    },

    setAdminStatus: async (id: string, status: boolean) => {
        const validId = UserValidator.idParamValidator(id);
        if (!validId.success) {
            throw validId.error;
        }
        await UserWriteRepository.setAdminStatus(validId.data, status);
    },

    getCurrentUser: async () => {
        const session = await retrieveUserSession()
        return session.user;
    },
    isAdmin: async () => {
        const session = await retrieveUserSession()
        return session.user.isAdmin;
    }
}

const retrieveUserSession = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        throw new Error("User not found");
    }

    return session;
}