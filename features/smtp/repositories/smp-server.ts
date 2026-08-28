/* eslint-disable @typescript-eslint/no-explicit-any */

import { ENV } from "@/core/env";
import nodemailer from "nodemailer";
import { SendEmailDto } from "../dto/schema";
import { smtpValidator } from "../dto/validate";
import { NodmailerTransportResponse } from "../entities/nodmalier";

export class NodeMailerRepository {
    transporter: any;
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: ENV.SMTP_HOST,
            port: ENV.SMTP_PORT,
            secure: false,
            auth: {
                user: ENV.SMTP_USER,
                pass: ENV.SMTP_PASS,
            },
        });
    }

    async ready(): Promise<boolean> {
        try {
            await this.transporter.verify();
            console.log("Server is ready to take our messages");
            return true;
        } catch (err) {
            console.error("Verification failed:", err);
            return false;
        }
    }

    async send(data: SendEmailDto): Promise<NodmailerTransportResponse> {
        if (!this.ready()) {
            throw new Error("Server is not ready to take our messages");
        }

        const validateData = smtpValidator.send(data);

        if (!validateData.success) {
            throw new Error(validateData.error.message);
        }
        const from = ENV.SMTP_FROM_ALIAS ? `${ENV.SMTP_FROM_ALIAS} <${validateData.data.from}>` : validateData.data.from
        const result = await this.transporter.sendMail({
            from,
            to: validateData.data.to,
            subject: validateData.data.subject,
            html: validateData.data.html,
        });

        return result as NodmailerTransportResponse;
    }

    async close() {
        this.transporter.close();
    }
}


