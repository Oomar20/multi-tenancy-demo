import { IsUUID } from 'class-validator';

export class AssignGradeDto {
    @IsUUID()
    userId: string;   // the teacher’s user ID

    @IsUUID()
    gradeId: string;  // the Grade ID 
}