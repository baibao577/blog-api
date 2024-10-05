export class AuthResponseDto {
  id: number;
  name: string;
  access_token: string;

  constructor(partial: Partial<AuthResponseDto>) {
    Object.assign(this, partial);
  }
}
