"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from "@clerk/nextjs";
// import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  const router = useRouter();

  useEffect(() => {
    const role = user?.publicMetadata.role;

    if (role) {
      router.push(`/${role}`);
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-8 py-4">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg">
                <Plus className="h-6 w-6 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-white">MedConnect</h1>
            </div>
            <p className="text-blue-100 mt-2">Hospital Management System</p>
          </div>

          {/* Login Form */}
          <div className="p-8">
            <SignIn.Root>
              <SignIn.Step
                name="start"
                className="flex flex-col gap-4"
              >
                <div className="text-center mb-4">
                  <h2 className="text-gray-700 text-lg font-semibold">Welcome Back</h2>
                  <p className="text-gray-500 text-sm">Please sign in to your account</p>
                </div>

                <Clerk.GlobalError className="text-sm text-red-500 bg-red-50 p-3 rounded-md" />

                <Clerk.Field name="identifier" className="flex flex-col gap-2">
                  <Clerk.Label className="text-sm font-medium text-gray-700">
                    Username
                  </Clerk.Label>
                  <Clerk.Input
                    type="text"
                    required
                    className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                  <Clerk.FieldError className="text-xs text-red-500" />
                </Clerk.Field>

                <Clerk.Field name="password" className="flex flex-col gap-2">
                  <Clerk.Label className="text-sm font-medium text-gray-700">
                    Password
                  </Clerk.Label>
                  <Clerk.Input
                    type="password"
                    required
                    className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                  <Clerk.FieldError className="text-xs text-red-500" />
                </Clerk.Field>

                {/* <div className="flex items-center justify-between mt-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-700">Forgot password?</a>
                </div> */}

                <SignIn.Action
                  submit
                  className="w-full bg-blue-600 text-white rounded-md py-3 font-medium hover:bg-blue-700 transition-colors duration-200 mt-4"
                >
                  Sign In
                </SignIn.Action>

                {/* <div className="text-center mt-4">
                  <p className="text-sm text-gray-600">
                    Need technical support? <a href="#" className="text-blue-600 hover:text-blue-700">Contact IT Help Desk</a>
                  </p>
                </div> */}
              </SignIn.Step>
            </SignIn.Root>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;


import { Plus } from 'lucide-react';
