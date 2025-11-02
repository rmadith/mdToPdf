"use client"

import dynamic from "next/dynamic"

// Dynamically import the heavy client component
const AppContent = dynamic(() => import("@/components/app-content"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading editor...</p>
      </div>
    </div>
  ),
})

export default function Home() {
  return <AppContent />
}
