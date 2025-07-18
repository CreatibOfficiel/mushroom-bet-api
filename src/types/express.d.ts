import { AuthUser, RequestCookies } from './index';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      cookies: RequestCookies;
    }
    
    // Override the default User interface
    interface User extends AuthUser {}
  }
} 