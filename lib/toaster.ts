import { IToast, PromiseToastParams, ToastParams } from "@/types/toast";
import { toast as toastComponent } from "@/components/ui/toast"

class Toast implements IToast {
    info(args: ToastParams) {
        const { title, description } = args
        toastComponent.add({
            title,
            description,
            type: "info",
        })
    }
    success(args: ToastParams) {
        const { title, description } = args
        toastComponent.add({
            title,
            description,
            type: "success",
        })

    }
    warning(args: ToastParams) {
        const { title, description } = args
        toastComponent.add({
            title,
            description,
            type: "warning",
        })
    }
    error(args: ToastParams) {

        const { title, description } = args
        toastComponent.add({
            title,
            description,
            type: "error",
        })

    }


    async promise<T>(promise: Promise<T>, args: PromiseToastParams<T>): Promise<T> {
        const { loading, success, error } = args
        const executor = new Promise<T>((resolve, reject) => {
            try {
                resolve(promise);
            } catch (error) {
                reject(error);
            }
        }) as Promise<T>;

        return toastComponent.promise(executor, {
            loading,
            success,
            error,
        });

    }
}


export const toast = new Toast();