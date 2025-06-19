import { IsNotEmpty, Matches } from 'class-validator';

export class CreateTenantDto {
    @IsNotEmpty() name: string;
    @Matches(/^[a-z0-9-]+$/) tenantKey: string;  // e.g. “school-123”
}