import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { PrismaClient } from "@/generated/prisma";
import { expo } from "@better-auth/expo";
 
const prisma = new PrismaClient();
export const auth = betterAuth({
    plugins: [expo()],
    trustedOrigins: ["myapp://"],
    database: prismaAdapter(prisma, {
        provider: "sqlite", // or "mysql", "postgresql", ...etc
    }),
});