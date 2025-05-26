export class RegisterDto {
  username!: string;
  email!: string;
  password!: string;
  role?: 'player' | 'admin';
}

export class LoginDto {
  username!: string;
  password!: string;
}
