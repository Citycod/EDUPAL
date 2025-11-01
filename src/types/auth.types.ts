export interface User {
  id: string;
  email: string;
  fullName: string;
  university?: string;
  isVerified: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}