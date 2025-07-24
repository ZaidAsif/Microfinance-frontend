import UserProtectedRoutes from "@/hoc/userProtectedRoutes";


export default function UserLayout({children}: {children: React.ReactNode}) {
  return (
    <UserProtectedRoutes>{children}</UserProtectedRoutes>
  )
}