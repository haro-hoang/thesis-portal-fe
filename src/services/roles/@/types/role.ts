export interface Role {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
}

export interface CreateRoleDto {
    name: string;
    description: string;
    isActive: boolean;
}

export interface UpdateRoleDto extends Partial<CreateRoleDto> { }