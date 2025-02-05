import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50">
      <header className="py-8 bg-white shadow-md">
        <h1 className="text-center text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Agent Portal
        </h1>
        <p className="text-center mt-2 text-gray-600">
          Select an agent to get started
        </p>
      </header>
      <main className="container mx-auto p-8 max-w-5xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <Link
            href="/bridge-agent"
            className="transform hover:scale-105 transition duration-300"
          >
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl border border-gray-100">
              <h2 className="text-2xl font-semibold text-blue-600 mb-3">
                Bridge Agent
              </h2>
              <p className="text-gray-600">
                Manage and monitor bridge operations
              </p>
            </div>
          </Link>
          <Link
            href="/base-agent"
            className="transform hover:scale-105 transition duration-300"
          >
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl border border-gray-100">
              <h2 className="text-2xl font-semibold text-purple-600 mb-3">
                Base Agent
              </h2>
              <p className="text-gray-600">
                Core system management and control
              </p>
            </div>
          </Link>
          <Link
            href="/scheduler-agent"
            className="transform hover:scale-105 transition duration-300"
          >
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl border border-gray-100">
              <h2 className="text-2xl font-semibold text-indigo-600 mb-3">
                Scheduler Agent
              </h2>
              <p className="text-gray-600">Task scheduling and automation</p>
            </div>
          </Link>
          <Link
            href="/warden-agent"
            className="transform hover:scale-105 transition duration-300"
          >
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl border border-gray-100">
              <h2 className="text-2xl font-semibold text-teal-600 mb-3">
                Warden Agent
              </h2>
              <p className="text-gray-600">Security and access management</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
