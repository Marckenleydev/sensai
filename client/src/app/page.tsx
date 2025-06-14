// Replace your current src/app/page.tsx with this minimal version to test

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Sensai Mern</h1>
        <p className="text-gray-600 mb-8">Welcome to your career platform</p>
        <div className="space-x-4">
          <a 
            href="/onboarding" 
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Get Started
          </a>
          <a 
            href="/dashboard" 
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

// Once this works, gradually add back your components one by one:
// 1. First add back the data imports
// 2. Then add back the UI components
// 3. Finally add back the HeroSection