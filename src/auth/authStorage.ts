import { getToken, removeToken } from "../api/api";

export const hasStoredToken = async (): Promise<boolean> => {
  const token = await getToken();
  return token !== null;
};

export const clearStoredSession = async (): Promise<void> => {
  await removeToken();
};
