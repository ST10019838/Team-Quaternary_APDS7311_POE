import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface Session {
  username: string;
  isAdmin: boolean;
  isEmployee: boolean;
  token: string;
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Get users details
  let cookie = request.cookies.get('session');
  const hasSession = request.cookies.has('session');
  const user: Session | undefined = hasSession
    ? JSON.parse(cookie?.value!)
    : null;

  // // cookie = response.cookies.get('vercel');
  // // console.log(cookie);

  // return response;

  // Redirect user to login or register if no session is found
  // if (
  //   !request.cookies.has('session') &&
  //   !path.startsWith('/login') &&
  //   !path.startsWith('/register')
  // ) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  if (path.startsWith('/login')) {
    if (hasSession) {
      if (user?.isAdmin || user?.isEmployee) {
        return NextResponse.redirect(
          new URL('/admin/payments-verification', request.url)
        );
      }

      return NextResponse.redirect(new URL('/payments', request.url));
      // return NextResponse.redirect(
      //   new URL(user?.isAdmin ? '/admin/payments' : '/payments', request.url)
      // );
    }

    return NextResponse.next();
  }

  // // Add route protection

  if (path.startsWith('/payments')) {
    if (hasSession) {
      if (user?.isAdmin || user?.isEmployee) {
        return NextResponse.redirect(
          new URL('/admin/payments-verification', request.url)
        );
        // return NextResponse.redirect(new URL('/admin/payments', request.url));
      }

      return NextResponse.next();
    }

    return NextResponse.redirect(new URL('/login', request.url));
  }

  // if (path.startsWith('/admin')) {
  //   if (hasSession) {
  //     if (user?.isAdmin) return NextResponse.next();

  //     return NextResponse.redirect(new URL('/payments', request.url));
  //   }

  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  if (path.startsWith('/admin')) {
    if (hasSession) {
      if (user?.isAdmin) return NextResponse.next();

      if (user?.isEmployee && path.startsWith('/admin/payments-verification'))
        return NextResponse.next();
      // return NextResponse.redirect(
      //   new URL('/admin/payments-verification', request.url)
      // );

      return NextResponse.redirect(new URL('/payments', request.url));
    }

    return NextResponse.redirect(new URL('/login', request.url));
  }

  // if (path.startsWith('/admin/payments-verification')) {
  //   if (hasSession) {
  //     if (user?.isAdmin || user?.isEmployee) return NextResponse.next();

  //     return NextResponse.redirect(new URL('/payments', request.url));
  //   }

  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  // if (path.startsWith('/admin/user-management')) {
  //   if (hasSession) {
  //     if (user?.isAdmin) return NextResponse.next();

  //     if (user?.isEmployee)
  //       return NextResponse.redirect(
  //         new URL('/admin/payments-verification', request.url)
  //       );

  //     return NextResponse.redirect(new URL('/payments', request.url));
  //   }

  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  if (path == '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // if (path.startsWith('/payments') || path.startsWith('/admin')) {
  //   if (hasSession) {
  //     return NextResponse.redirect(
  //       new URL(user?.isAdmin ? '/admin/payments' : '/payments', request.url)
  //     );
  //   }

  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  // Assume a "Cookie:nextjs=fast" header to be present on the incoming request
  // Getting cookies from the request using the `RequestCookies` API
  // let cookie = request.cookies.get('nextjs');
  // console.log(cookie); // => { name: 'nextjs', value: 'fast', Path: '/' }
  // const allCookies = request.cookies.getAll();
  // console.log(allCookies); // => [{ name: 'nextjs', value: 'fast' }]

  // request.cookies.has('nextjs'); // => true
  // request.cookies.delete('nextjs');
  // request.cookies.has('nextjs'); // => false

  // // Setting cookies on the response using the `ResponseCookies` API
  // const response = NextResponse.next();
  // response.cookies.set('vercel', 'fast');
  // response.cookies.set({
  //   name: 'vercel',
  //   value: 'fast',
  //   path: '/',
  // });
  // cookie = response.cookies.get('vercel');
  // console.log(cookie); // => { name: 'vercel', value: 'fast', Path: '/' }
  // The outgoing response will have a `Set-Cookie:vercel=fast;path=/` header.

  // return response;
}

// export const config = {
//   matcher: ['/hi/:path*', '/payments', '/admin/:path*'],
// };
