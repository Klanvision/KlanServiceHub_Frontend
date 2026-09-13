import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { client } from '@/lib/hono';
import { setAuthToken } from '@/lib/api-client';

export const useRegister = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async ({ json }) => {
            const response = await client.api.auth.register['$post']({ json });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to register!');
            }
            const data = await response.json();
            if (data?.token || data?.sessionSecret) {
                setAuthToken(data.token || data.sessionSecret);
            }
            return data;
        },
        onSuccess: (data) => {
            if (data?.token || data?.sessionSecret) {
                setAuthToken(data.token || data.sessionSecret);
            }
            queryClient.invalidateQueries({
                queryKey: ['current'],
            });
            if (data?.workspaceId) {
                router.push(`/workspaces/${data.workspaceId}`);
            } else {
                router.push('/');
            }
            router.refresh();
        },
        onError: (error) => {
            console.error('[REGISTER]: ', error);
            toast.error(error.message || 'Failed to register!');
        },
    });
    return mutation;
};
