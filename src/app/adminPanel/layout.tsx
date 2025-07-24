import AdminProtectedRoutes from "@/hoc/adminProtectedRoutes";


export default function AdminLayout ({children}: {children: React.ReactNode}) {
  return (
    <AdminProtectedRoutes>{children}</AdminProtectedRoutes>
  )
}