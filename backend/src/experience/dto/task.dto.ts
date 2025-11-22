import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @Min(0)
    humanTime: number;

    @IsNumber()
    @Min(0)
    aiTime: number;

    @IsString()
    @IsNotEmpty()
    projectId: string;
}

export class UpdateTaskDto {
    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsNumber()
    @Min(0)
    humanTime?: number;

    @IsNumber()
    @Min(0)
    aiTime?: number;
}
