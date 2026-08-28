import { sendEmailSchema } from "./schema";

export const smtpValidator = {
    send: (inputs: unknown) => sendEmailSchema.safeParse(inputs)
}