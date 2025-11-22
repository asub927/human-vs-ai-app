import { IsString, IsNotEmpty, MinLength, IsArray, IsOptional } from 'class-validator';

export class CreateProjectDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    name: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    taskNames?: string[];
}

export class UpdateProjectDto {
    @IsOptional()
    @IsString()
    @MinLength(1)
    name?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    taskNames?: string[];
}
