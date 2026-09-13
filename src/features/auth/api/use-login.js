import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { client } from '@/lib/hono';
import { setAuthToken } from '@/lib/api-client';

export const useLogin = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async ({ json }) => {
            const response = await client.api.auth.login['$post']({ json });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Email or Password is incorrect!');
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
            toast.error(error.message || 'Email or Password is incorrect!');
        },
    });
    return mutation;
};
