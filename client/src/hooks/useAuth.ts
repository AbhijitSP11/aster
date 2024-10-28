import { useGetAuthUserQuery } from "@/state/api";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export function useAuth(requireAuth = true) {
  const { data: session, status } = useSession();
  
  const router = useRouter();
  const pathname = usePathname();
  const {
    data: authUser,
    error,
    isLoading: isLoadingUser,
  } = useGetAuthUserQuery(undefined, {
    skip: !session?.user?.id,
  });

  useEffect(() => {
    if (requireAuth && status === "authenticated") {
      router.push('/dashboard'); // Redirect to the dashboard on successful login
    } else if (requireAuth && status === "unauthenticated") {
      router.push('/api/auth/signin'); // Redirect to the sign-in page if not authenticated
    }
  }, [requireAuth, status, router]);
  

  return {
    session,
    status,
    isLoading: status === "loading" || isLoadingUser,
    isAuthenticated: status === "authenticated",
    user: authUser?.user,
    userDetails: authUser?.userDetails,
    error,
  };
}