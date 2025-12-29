
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { User } from '../src/modules/auth/entities/user.entity';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const dataSource = app.get(DataSource);
    const userRepository = dataSource.getRepository(User);

    const email = 'donwolfonline@gmail.com';
    const password = 'password@123';

    // Check if user exists
    let user = await userRepository.findOne({ where: { email } });

    if (user) {
        console.log(`User ${email} already exists. Updating password...`);
        user.passwordHash = await bcrypt.hash(password, 10);
        user.role = 'client'; // Ensure role is client
        await userRepository.save(user);
        console.log(`User ${email} updated successfully.`);
    } else {
        console.log(`Creating user ${email}...`);
        const passwordHash = await bcrypt.hash(password, 10);
        user = userRepository.create({
            email,
            passwordHash,
            firstName: 'Don',
            lastName: 'Wolf',
            role: 'client',
        });
        await userRepository.save(user);
        console.log(`User ${email} created successfully.`);
    }

    await app.close();
}

bootstrap();
