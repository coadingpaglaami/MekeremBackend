import { Module } from "@nestjs/common";
import { RolesGuard } from "./guard/roles.guard.js";

@Module({
    providers:[RolesGuard],
    exports:[RolesGuard]
})

export class RoleModule{}