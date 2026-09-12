
import { UserReadRepository } from "./repository/read";
import { UserValidator } from "./dto/validator";
import { UserWriteRepository } from "./repository/write";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { CreateInitialAdminDto } from "./dto/schema";
import { SettingsServicesImpl } from "../settings/services";

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
    },

    needsInitialSetup: async () => {
        const total = await UserReadRepository.count();
        return total === 0;
    },

    createInitialAdmin: async (data: CreateInitialAdminDto) => {
        const validData = UserValidator.createInitialAdminValidator(data);
        if (!validData.success) {
            throw validData.error;
        }

        // Re-vérifié ici (pas seulement côté page) : la page /creation-admin
        // ne suffit pas à empêcher un second appel concurrent (double onglet).
        const needsSetup = await UserServices.needsInitialSetup();
        if (!needsSetup) {
            throw new Error("Un compte administrateur existe déjà.");
        }

        const created = await auth.api.signUpEmail({
            body: {
                name: validData.data.name,
                email: validData.data.email,
                password: validData.data.password,
            },
        });

        const id = (created.user as { id: string }).id;
        await UserWriteRepository.setAdminStatus(id, true);
        await SettingsServicesImpl.initializeForUser(id);

        return created.user;
    },
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