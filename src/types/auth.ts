export interface RegisterRequest {
  email: string;
  password: string;
  is_admin: boolean;
}

export interface RegisterResponse {
  email: string;
  id: number;
  is_admin: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  email: string;
  id: number;
  is_admin: boolean;
}
