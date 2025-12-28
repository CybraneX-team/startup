"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { Bounce, ToastContainer } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { useSession, signIn } from "next-auth/react";

const SignIn: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { setUser, user } = useUser();
  useEffect(() => {
    const syncUser = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google-login`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: session?.user?.email,
            username: session?.user?.name,
          }),
        });
  
        if (!response.ok) {
          const error = await response.json();
          console.error("Google login failed:", error.message);
          return;
        }
  
        const data = await response.json();

        localStorage.setItem("userToken", data.token);
        localStorage.setItem("userData", JSON.stringify(data));        
        setUser(data);
        router.replace(data?.isAiCustomizationDone ? "/" : "/formQuestion");
      } catch (err) {
        console.error("Sync error:", err);
      }
    };
  
    if (
      status === "authenticated" &&
      session?.user?.email &&
      !localStorage.getItem("userToken") // ✅ avoid repeated sync
    ) {
      syncUser();
    }
  }, [session, status, router, setUser]);
  
  const [usercreds, setusercreds] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const onChangeInputs = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setusercreds((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const makeReq = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        email: usercreds.email,
        password: usercreds.password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (makeReq.ok) {
      const response = await makeReq.json();
      setUser(response);
      localStorage.setItem("userToken", response.token);
      localStorage.setItem("userData", JSON.stringify(response));
      router.replace( response.isAiCustomizationDone ? "/" : "/formQuestion");
    } else {
      alert("Invalid credentials or server error.");
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <DefaultLayout>
        <Breadcrumb pageName="Sign In" />

        <div className="flex justify-center w-full">
          <div className="w-full max-w-lg border border-stroke bg-white p-6 sm:p-10 shadow-default dark:border-strokedark dark:bg-boxdark rounded-xl">
            <h2 className="mb-8 text-2xl sm:text-3xl font-bold text-center text-black dark:text-white leading-tight">
              Sign In to <br /> Unicorn Simulator
            </h2>

            <form onSubmit={handleUserLogin}>
              {/* Email Input */}
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white capitalize">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={usercreds.email}
                  onChange={onChangeInputs}
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              {/* Password Input with Show/Hide */}
              <div className="mb-4 relative">
                <label className="mb-2.5 block font-medium text-black dark:text-white capitalize">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={usercreds.password}
                    onChange={onChangeInputs}
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 pr-12 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-500" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-500" />
                    )}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mb-5">
                <input
                  type="submit"
                  value="Sign In"
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                />
              </div>

              {/* Google Sign-in Button */}
              <button 
              type="button"
              onClick={() => signIn("google")}
              className="flex w-full items-center justify-center gap-3.5 rounded-lg border border-stroke bg-gray p-4 hover:bg-opacity-50 dark:border-strokedark dark:bg-meta-4 dark:hover:bg-opacity-50">
              <span className="h-5 w-5">
              <svg viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
                <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.6-34-4.6-50.2H272v95h147.1c-6.3 34.4-25 63.5-53.4 83v68h86.1c50.2-46.2 79.7-114.2 79.7-195.8z" />
                <path fill="#34A853" d="M272 544.3c72.6 0 133.6-24.1 178.1-65.3l-86.1-68c-24 16-55 25.3-92 25.3-70.8 0-130.7-47.8-152.1-112.2h-89.6v70.6c44.5 88.1 135.5 149.6 241.7 149.6z" />
                <path fill="#FBBC05" d="M119.9 324c-10.3-30-10.3-62.4 0-92.4v-70.6h-89.6c-38.8 77.6-38.8 165.9 0 243.5l89.6-70.5z" />
                <path fill="#EA4335" d="M272 107.7c39.5-.6 77.3 13.7 106.4 40.7l79.3-79.3C415.7 24.7 345.8-1.7 272 0 166.8 0 75.8 61.5 31.3 149.6l89.6 70.6C141.3 155.5 201.2 107.7 272 107.7z" />
              </svg>
            </span>

            <span className="text-black dark:text-white font-medium">
              Sign in with Google
            </span>
          </button>


              {/* Signup Redirect */}
              <div className="mt-6 text-center">
                <p>
                  Don’t have an account?{" "}
                  <Link href="/auth/signup" className="text-primary underline">
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </DefaultLayout>
    </>
  );
};

export default SignIn;
