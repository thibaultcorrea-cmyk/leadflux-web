import { auth } from "@/lib/auth"
import { ENV } from "@/core/env"
import { UserServices } from "@/features/users/services"

const ADMIN_USER = {
    email: ENV.ADMIN_EMAIL,
    password: ENV.ADMIN_PASSWORD,
    name: ENV.ADMIN_NAME,
}

const DEMO_USER = {
    email: "user@leadflux.com",
    password: "password",
    name: "Demo User",
}


export const createAdminUser = async () => {

    const user = await auth.api.signUpEmail({
        body: {
            name: ADMIN_USER.name,
            email: ADMIN_USER.email,
            password: ADMIN_USER.password,
            rememberMe: true,

        }
    })

    if (user) {
        const id = (user.user as any).id as string;
        await UserServices.setAdminStatus(id, true);
    }


}



export const createDemoUser = async () => {

    await auth.api.signUpEmail({
        body: {
            name: DEMO_USER.name,
            email: DEMO_USER.email,
            password: DEMO_USER.password,
            rememberMe: true,

        }
    })



}
