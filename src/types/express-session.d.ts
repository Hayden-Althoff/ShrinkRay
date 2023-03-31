import 'express-session';

declare module 'express-session' {
  export interface Session {
    clearSession(): Promise<void>; // DO NOT MODIFY THIS!

    AuthenticatedUserData: {
      userId: string;
      isPro: boolean;
      isAdmin: boolean;
      userName: string;
    };
    isLoggedIn: boolean;
  }
}
