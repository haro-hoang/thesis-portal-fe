export interface User {
  id: string;
  username: string;
  password: string;
  email: string;
  fullName: string;
  isActive: boolean;
  roles?: Role[];
}

export interface CreateUserDto {
  username: string;
  password: string;
  email: string;
  fullName: string;
  isActive: boolean;
  roleIds?: string[]; // or Role[], depending on your API
}

export interface UpdateUserDto extends Partial<CreateUserDto> { }

export interface Role {
  id: string;
  name: string;
}