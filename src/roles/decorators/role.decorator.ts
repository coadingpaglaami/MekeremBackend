import { Reflector } from "@nestjs/core";

export const ROLES = ['ADMIN', 'CARRIER', 'TRAVELLER'] as const;

export type Role = (typeof ROLES)[number];
export const Roles = Reflector.createDecorator<Role[]>();