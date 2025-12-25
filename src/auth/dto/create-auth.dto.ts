export enum Role {
    TRAVELLER = 'TRAVELLER',
    ADMIN = 'ADMIN',
    CARRIER = 'CARRIER'
}

export class CreateAuthDto {
    name: string;
    email: string;
    password: string;
    role: Role;
}

export class SignUpResponse {
    message: string;
    user: Partial<CreateAuthDto>;
}