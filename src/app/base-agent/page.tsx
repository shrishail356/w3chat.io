import Link from "next/link";

export default function BaseAgentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-gray-50">
      <header className="py-8 bg-white shadow-md">
        <h1 className="text-center text-4xl font-bold text-purple-600">
          Base Agent
        </h1>
        <p className="text-center mt-2 text-gray-600">Core System Management</p>
      </header>
      <main className="container mx-auto p-8 max-w-4xl">
        <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
          <h2 className="text-2xl font-semibold text-purple-600 mb-4">
            Welcome to Base Agent
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            The foundation of your system management interface. Here you can
            access core functionalities and system controls.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-700 mb-2">
                System Overview
              </h3>
              <p className="text-gray-600">
                Monitor core system metrics and performance
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-700 mb-2">
                Control Center
              </h3>
              <p className="text-gray-600">
                Access system controls and configurations
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
