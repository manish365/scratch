import { defineConfig } from "prisma/config";
import "dotenv/config";

const DATABASE_URL = process.env.DATABASE_URL!;

export default defineConfig({
    earlyAccess: true,
    schema: "prisma/schema.prisma",
    datasource: {
        url: DATABASE_URL,
    },
    migrate: {
        async adapter() {
            const { PrismaPg } = await import("@prisma/adapter-pg");
            return new PrismaPg({ connectionString: DATABASE_URL });
        },
    },
});
