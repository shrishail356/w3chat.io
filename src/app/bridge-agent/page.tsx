import Link from "next/link";

export default function BridgrAgentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50">
      <header className="py-8 bg-white shadow-md">
        <h1 className="text-center text-4xl font-bold text-blue-600">
          Bridge Agent
        </h1>
        <p className="text-center mt-2 text-gray-600">
          Bridge Operations Management
        </p>
      </header>
      <main className="container mx-auto p-8 max-w-4xl">
        <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">
            Welcome to Bridgr e Agent
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Your central hub for managing and monitoring bridge operations. This
            interface provides comprehensive tools for bridge management and
            operational oversight.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">
                Bridge Status
              </h3>
              <p className="text-gray-600">
                Monitor real-time bridge operations and status
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">
                Operations
              </h3>
              <p className="text-gray-600">
                Manage and control bridge functions
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
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
