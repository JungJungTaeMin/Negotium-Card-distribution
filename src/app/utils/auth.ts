import { loginRequest, sendEmailCode, signupRequest, verifyEmailCode } from "./api";

export const AUTH_TOKEN_KEY = "negotium_auth_token";
export const USER_KEY = "negotium_user";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export const login = async (email: string, password: string): Promise<AuthUser> => {
  const response = await loginRequest(email, password);
  const user = {
    id: email,
    email,
    name: email.split("@")[0],
  };

  localStorage.setItem(AUTH_TOKEN_KEY, response.accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  return user;
};

export const sendSignupCode = async (email: string) => {
  await sendEmailCode(email);
};

export const verifySignupCode = async (email: string, code: string) => {
  await verifyEmailCode(email, code);
};

export const signup = async (email: string, password: string, name: string): Promise<AuthUser> => {
  await signupRequest(name, email, password);
  const user = {
    id: email,
    email,
    name,
  };

  return user;
};

export const logout = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getCurrentUser = (): AuthUser | null => {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem(AUTH_TOKEN_KEY);
};
