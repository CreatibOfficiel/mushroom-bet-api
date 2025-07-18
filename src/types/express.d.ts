import { AuthUser, RequestCookies } from './index';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      cookies: RequestCookies;
    }

    // Override the default User interface to match our AuthUser type
    interface User {
      id: string;
      email: string;
      displayName: string | null;
      skin: import('./index').Skin | null;
    }
  }
}
