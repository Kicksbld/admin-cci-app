import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { PrismaClient } from "@/generated/prisma";
import { expo } from "@better-auth/expo";
import { admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { sendEmail } from "./email";

const prisma = new PrismaClient();
export const auth = betterAuth({
    plugins: [expo(), admin(), nextCookies()],
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        sendResetPassword: async ({ user, url, token }, request) => {
            await sendEmail({
                to: user.email,
                subject: "Reset your password",
                text: `Click the link to reset your password: ${url}`,
            });
        },
    },
    trustedOrigins: ["myapp://"],
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
});