export type AuthResult = {
  error?: string;
  success?: boolean;
};

export type ProfileData = {
  email: string;
  display_name?: string;
  created_at: string;
};
