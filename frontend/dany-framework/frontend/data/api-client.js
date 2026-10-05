export function createApiClient({
    baseUrl,
    token
}) {
    return {
        fetch(path, options = {}) {
            const headers = new Headers(options.headers);
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return window.fetch(`${baseUrl}${path}`, {
                ...options,
                headers
            });
        }
    };
}
