/// <reference types="lucia" />

declare namespace Lucia {
  type Auth = import('@/lib/lucia').Auth;
  interface DatabaseUserAttributes {
    username: string;
    email?: string;
    emailVerified?: boolean;
    avatar?: string;
    phoneNumber?: string;
    description?: string;
  }
  type DatabaseSessionAttributes = Record<string, unknown>;
}
