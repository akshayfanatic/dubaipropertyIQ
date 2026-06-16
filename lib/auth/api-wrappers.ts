import { requireRoleApi } from './api-guards';

type ApiHandler = (...args: unknown[]) => Promise<Response>;

export function withAdminApi(handler: ApiHandler): ApiHandler {
  return async (...args) => {
    const authError = await requireRoleApi('admin');
    if (authError) return authError;

    return handler(...args);
  };
}

export function withCustomerApi(handler: ApiHandler): ApiHandler {
  return async (...args) => {
    const authError = await requireRoleApi('customer');
    if (authError) return authError;

    return handler(...args);
  };
}
