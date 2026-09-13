import { authApi } from '@/lib/api-client';

export const getCurrent = async () => {
  try {
    const res = await authApi.getCurrentUser();
    return res?.data || null;
  } catch {
    return null;
  }
};
