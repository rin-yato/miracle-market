import type { Handler } from 'elysia';
import { isWithinExpiration } from 'lucia/utils';
import { db } from '@/lib/db/drizzle';
import { luciaClient } from '@/lib/lucia';
import { emailVerifications } from '@/lib/db/schema';

export const sessionGuard: Handler = async ({ set, cookie: { session } }) => {
  if (!session.value) {
    set.status = 'Unauthorized';
    return 'Unauthorized';
  }

  try {
    await luciaClient.validateSession(session.value);
  } catch (error) {
    set.status = 'Unauthorized';

    return 'Unauthorized';
  }
};

// Handle token generation for email verification
const EMAIL_VERIFICATION_TOKEN_EXPIRES_IN = 1000 * 60 * 60; // 1 hour

export async function generateEmailVerificationToken (userId: string) {
  const storedUserTokens = await db.query.emailVerifications.findMany({
    where: (field, operator) => {
      return operator.eq(field.userId, userId);
    },
  });

  if (storedUserTokens.length > 0) {
    const reuseableStoredToken = storedUserTokens.find((token) => {
      // Check if token is within 30mn of expiration
      return isWithinExpiration(
        Number(token.expires) - EMAIL_VERIFICATION_TOKEN_EXPIRES_IN / 2,
      );
    });

    if (reuseableStoredToken) return reuseableStoredToken.id;
  }

  try {
    const newEmailVerificationToken = await db
      .insert(emailVerifications)
      .values({
        userId,
        expires: new Date().getTime() + EMAIL_VERIFICATION_TOKEN_EXPIRES_IN,
      })
      .returning();

    if (!newEmailVerificationToken[0]) {
      throw new Error('Could not generate email verification token');
    }

    return newEmailVerificationToken[0].id;
  } catch (error) {
    throw new Error('Could not generate email verification token');
  }
}

// Handle token validation for email verification
export async function validateEmailVerificationToken (token: string) {
  const storedToken = await db.transaction(async (trx) => {
    const storedToken = await trx.query.emailVerifications.findFirst({
      where: (field, operator) => operator.eq(field.id, token),
    });

    if (!storedToken) throw new Error('Invalid token');

    return storedToken;
  });

  const tokenExpires = Number(storedToken.expires);

  if (!isWithinExpiration(tokenExpires)) throw new Error('Token expired');

  return storedToken.userId;
}
