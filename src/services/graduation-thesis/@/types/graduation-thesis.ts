import { Student } from "@/services/students/@/types/student";
import { Teacher } from "@/services/teachers/@/types/teacher";

interface ThesisStudent {
    studentId: string;
    thesisId: string;
    assignedAt: Date;
    student: Student;
}

export interface GraduationThesis {
    id: string;
    title: string;
    description?: string;
    lecturerId: string;
    createdAt: Date;
    updatedAt: Date;
    lecturer?: Teacher;
    students?: ThesisStudent[];
    status?: string;
    objectives?: string;
    expectedResults?: string;
    startDate?: Date;
    endDate?: Date;
    assignedDate?: Date;

}

export interface CreateGraduationThesisDto {
    title: string;
    description?: string;
    lecturerId: string;
    students?: string[];
}

export interface UpdateGraduationThesisDto extends Partial<CreateGraduationThesisDto> { }