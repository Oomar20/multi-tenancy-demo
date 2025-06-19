import { IsInt, Min, Max, IsString, Matches } from 'class-validator';

export class CreateGradeDto {
    @IsInt()
    @Min(1)
    @Max(12)
    level: number;               // e.g. 11

    @IsString()
    @Matches(/^[A-Z]$/, {
        message: 'section must be a single uppercase letter (e.g. “A”, “B”)',
    })
    section: string;             // e.g. "B"

    @IsString()
    tenantKey: string;           // must match an existing School
}