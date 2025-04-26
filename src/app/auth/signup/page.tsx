"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession, signIn } from "next-auth/react";
import dynamic from "next/dynamic";
import { Eye, EyeOff } from "lucide-react"; 


const DefaultLayout = dynamic(
  () => import("@/components/Layouts/DefaultLayout"),
  { ssr: false }
);

const SignUp: React.FC = () => {
  const router = useRouter();
  const { setUser } = useUser();
  const { data: session, status } = useSession();
  useEffect(() => {
      const syncUser = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google-login`, {
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
          router.push("/formQuestion");
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
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onChangeInputs = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setusercreds((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateInputs = () => {
    const { username, email, password, confirmPassword } = usercreds;

    if (!username.trim()) {
      toast.error("Username is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{6,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be at least 6 characters and include 1 capital letter, 1 number, and 1 special character"
      );
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleUserCreation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;

    const makeReq = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          username: usercreds.username,
          email: usercreds.email,
          password: usercreds.password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (makeReq.ok) {
      const response = await makeReq.json();
      setUser(response);
      localStorage.setItem("userToken", response.token);
      localStorage.setItem("userData", JSON.stringify(response));
      toast.success("Account created successfully");
      setTimeout(() => {
        router.push("/formQuestion");
      }, 1000);
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <DefaultLayout>
        <Breadcrumb pageName="Sign Up" />
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex justify-center w-full">
            <div className="w-full max-w-lg border border-stroke bg-white p-6 sm:p-10 shadow-default dark:border-strokedark dark:bg-boxdark rounded-xl">
              <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
                <h2 className="mb-5  text-2xl sm:text-3xl font-bold text-center text-black dark:text-white">
                  Sign Up to <br /> Startup Simulator
                </h2>
                <form>
                  {/* Username */}
                  <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      onChange={onChangeInputs}
                      value={usercreds.username}
                      placeholder="Enter Username"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 
                      text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Email
                    </label>
                    <input
                      type="email"
                      onChange={onChangeInputs}
                      value={usercreds.email}
                      name="email"
                      placeholder="Enter email"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  {/* Password */}
                  <div className="mb-4 relative">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        onChange={onChangeInputs}
                        value={usercreds.password}
                        placeholder="Enter password"
                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-12 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      <span
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-500" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-500" />
                        )}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Must be at least 6 characters, include 1 capital letter,
                      1 number and 1 special character.
                    </p>
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-6 relative">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Re-type Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        onChange={onChangeInputs}
                        value={usercreds.confirmPassword}
                        name="confirmPassword"
                        placeholder="Re-enter your password"
                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-12 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      <span
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-500" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-500" />
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="mb-5">
                    <input
                      type="submit"
                      value="Create account"
                      onClick={handleUserCreation}
                      className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                    />
                  </div>
                  <button 
                    type="button"
                   onClick={() => signIn("google", { callbackUrl: "/" })}
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
                  {/* Already have account */}
                  <div className="mt-6 text-center">
                    <p>
                      Already have an account?{" "}
                      <Link href="/auth/signin" className="text-primary">
                        Sign in
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </DefaultLayout>
    </>
  );
};

export default SignUp;
