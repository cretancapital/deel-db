import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <main className="text-center space-y-6">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">
          Deel Integration SaaS
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Manage your Deel contractors, assign skills, and search your global workforce with ease.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/auth/signin">
            <Button size="lg">Sign In</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
