'use client';

import useAuthStore from "@/store/authstore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminProtectedRoutes({ children }: { children: React.ReactNode }) {
    const user = useAuthStore((state) => state.user);
    const router = useRouter();

    useEffect(() => {
        if (!user || user.isAdmin !== true) {
            router.push('/login');
        }
    }, [user, router]);

    return (
        <>
            {children}
        </>
    );
}