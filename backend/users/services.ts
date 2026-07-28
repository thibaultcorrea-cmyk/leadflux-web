
import { UserReadRepository } from "./repository/read";
import { UserValidator } from "./dto/validator";
import { UserWriteRepository } from "./repository/write";

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
    }
}