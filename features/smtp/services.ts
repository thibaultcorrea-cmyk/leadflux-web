import { SendEmailDto, sendEmailSchema } from "./dto/schema";
import { NodeMailerRepository } from "./repositories/smp-server";


export const SMTPServiceImpl = {
    send: async (input: SendEmailDto) => {
        try {
            const validateData = sendEmailSchema.safeParse(input);
            if (!validateData.success) {
                throw new Error(validateData.error.message);
            }
            const nodeMailerRepository = new NodeMailerRepository();
            await nodeMailerRepository.ready();
            const sendResult = await nodeMailerRepository.send(validateData.data);
            await nodeMailerRepository.close();
            return sendResult;
        } catch (error: any) {
            throw new Error(error.message);
        }

    }
}

