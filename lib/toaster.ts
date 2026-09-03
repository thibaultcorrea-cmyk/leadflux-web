import { IToast, PromiseToastParams, ToastParams } from "@/types/toast";


class Toast implements IToast {
    info(args: ToastParams) {
        const { title, description } = args
        console.log(title, description)
    }
    success(args: ToastParams) {
        const { title, description } = args
        console.log(title, description)

    }
    warning(args: ToastParams) {
        const { title, description } = args
        console.log(title, description)
    }
    error(args: ToastParams) {

        const { title, description } = args
        console.log(title, description)

    }


    async promise<T>(promise: Promise<T>, args: PromiseToastParams<T>): Promise<T> {
        const { loading, success, error } = args
        console.log(promise, loading, success, error)
        return await promise
    }
}


export const toast = new Toast();