import { authApi } from './api-client.js';

export async function onOAuth(provider) {
  // Social login provider handler for client SPA
  try {
    const dummyEmail = `user_${provider.toLowerCase()}@example.com`;
    const res = await authApi.socialLogin({
      provider: provider.toLowerCase(),
      email: dummyEmail,
      name: `${provider} User`,
    });
    if (res?.workspaceId) {
      window.location.href = `/workspaces/${res.workspaceId}`;
    } else {
      window.location.href = '/';
    }
  } catch (err) {
    console.error('OAuth redirect error:', err);
    throw err;
  }
}
