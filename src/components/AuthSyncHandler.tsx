"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function AuthSyncHandler() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { setUser } = useUser();

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

  return null; // This component doesn't render anything
}

