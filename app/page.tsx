import { LoginForm } from "@/components/login-form"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Footer } from "@/components/ui/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4 relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <LoginForm />
      </div>
      <Footer />
    </div>
  )
}
