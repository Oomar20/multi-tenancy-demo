import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

async function main() {
    const prisma = new PrismaClient();

    const email = 'admin@demo.com';
    const rawPass = 'SuperSecret123!';

    const password = await bcrypt.hash(rawPass, 10);

    const admin = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            password,
            role: Role.ADMIN
        },
    });

    console.log('✅ Super-admin created:', admin.email);
    await prisma.$disconnect();
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
