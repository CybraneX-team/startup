import { jwtDecode } from "jwt-decode";

// utils/tokenUtils.
export const isTokenExpired = (token: string): boolean => {
  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    return Date.now() > exp * 1000;
  } catch {
    return true; // Invalid token or decoding error
  }
};
