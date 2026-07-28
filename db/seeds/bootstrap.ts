import { createAdminUser } from "./functions/users";


export const bootstrapSeed = {

    users: {
        message: {
            start: "Creating users",
            end: "Users created"
        },
        handler: createAdminUser

    }

}