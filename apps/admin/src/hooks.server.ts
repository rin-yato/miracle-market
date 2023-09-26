import { redirect } from '@sveltejs/kit';
import { eden } from 'libs';

const allowedRoutes = ['/signin', '/signup', '/forgot-password'];

export const handle = async ({ event, resolve }) => {
  const user = await eden.auth.profile.get({
    $fetch: {
      credentials: 'include',
      headers: {
        Cookie: 'session=' + event.cookies.get('session'),
      },
    },
  });

  console.log('user', user);

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
