import { AdminLoginForm } from "@/components/admin-login-form"
import { AdminAuthProvider } from "@/components/admin-auth-provider"

export default function AdminLoginPage() {
  return (
    <AdminAuthProvider>
      <AdminLoginForm />
    </AdminAuthProvider>
  )
}