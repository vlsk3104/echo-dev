"use client";

import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import AuthLayout from "../layouts/auth-layout";
import SignInView from "../views/sign-in-view";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AuthLoading>
        <AuthLayout>
          <p>ローディング中...</p>
        </AuthLayout>
      </AuthLoading>
      <Authenticated>{children}</Authenticated>
      <Unauthenticated>
        <AuthLayout>
          <SignInView />
        </AuthLayout>
      </Unauthenticated>
    </>
  );
};

export default AuthGuard;
