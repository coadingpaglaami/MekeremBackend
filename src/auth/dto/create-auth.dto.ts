// export enum Role {
//     TRAVELLER = 'TRAVELLER',
//     ADMIN = 'ADMIN',
//     CARRIER = 'CARRIER'
// }
import { Role } from 'src/database/prisma-client/enums.js';
export class CreateAuthDto {
    name: string;
    email: string;
    password: string;
    role: Role;
}

export class SignUpResponse {
    message: string;
    user: Omit<CreateAuthDto,'password'>;
}