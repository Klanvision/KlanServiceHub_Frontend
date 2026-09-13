import { companyApi } from '@/lib/api-client';

export const getWorkspaces = async () => {
  try {
    const res = await companyApi.getWorkspaces();
    const list = res?.data || [];
    return {
      documents: list,
      total: list.length,
    };
  } catch {
    return { documents: [], total: 0 };
  }
};
