import { redirect } from '@sveltejs/kit';
import { eden } from 'libs';

const allowedRoutes = ['/signin', '/signup', '/forgot-password'];

export const handle = async ({ event, resolve }) => {
  const sessionCookie = event.cookies.get('session');

  // For some reason, the request doesn't send
  // the session cookie on this file, so we manually
  // get the cookie from the headers and set it.
  // It works fine on other files
  const user = await eden.auth.profile.get({
    $fetch: {
      credentials: 'include',
      headers: {
        Cookie: `session=${sessionCookie}`,
      },
    },
  });

  // If not signed in, redirect to sign in page
  if (user.error && !allowedRoutes.includes(event.url.pathname)) {
    throw redirect(303, '/signin');
  }

  // If signed in, redirect to home page
  if (!user.error && allowedRoutes.includes(event.url.pathname)) {
    event.locals.user = user.data;
    throw redirect(303, '/products');
  }

  return await resolve(event);
};
