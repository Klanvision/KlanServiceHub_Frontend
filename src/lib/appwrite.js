// Safe Client-side Shim for Legacy Appwrite References
export async function createSessionClient() {
  return {
    get account() {
      return {
        get: async () => null,
      };
    },
    get databases() {
      return {};
    },
    get storage() {
      return {};
    },
  };
}

export async function createAdminClient() {
  return {
    get account() {
      return {
        createOAuth2Token: async (provider, successUrl, failureUrl) => successUrl,
      };
    },
    get users() {
      return {};
    },
  };
}
