import { AlertTriangle, Database } from 'lucide-react';

export default function ErrorFallback({ message }: { message: string }) {
  if (message === 'MISSING_SUPABASE_ENV_VARS') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-2xl bg-white rounded-3xl p-10 shadow-2xl border border-red-100 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Database className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-dark mb-4">Database Connection Required</h1>
          <p className="text-gray-600 mb-8 text-lg">
            CoopServe is currently in Step 3 and requires a real Supabase database to function. The environment variables are missing.
          </p>
          
          <div className="bg-gray-50 rounded-xl p-6 text-left border border-gray-200">
            <h3 className="font-bold text-dark mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" /> How to fix this:
            </h3>
            <ol className="list-decimal pl-5 space-y-3 text-sm text-gray-700">
              <li>Create a project on <strong>Supabase</strong>.</li>
              <li>Run the SQL scripts located in <code className="bg-gray-200 px-1.5 py-0.5 rounded text-red-600">supabase/migrations/0001_initial_schema.sql</code> and <code className="bg-gray-200 px-1.5 py-0.5 rounded text-red-600">supabase/seed.sql</code> in your Supabase SQL Editor.</li>
              <li>Create a <code className="bg-gray-200 px-1.5 py-0.5 rounded text-red-600">.env</code> file in the root of this project.</li>
              <li>Add <code className="bg-gray-200 px-1.5 py-0.5 rounded text-red-600">VITE_SUPABASE_URL</code> and <code className="bg-gray-200 px-1.5 py-0.5 rounded text-red-600">VITE_SUPABASE_ANON_KEY</code> to the <code className="bg-gray-200 px-1.5 py-0.5 rounded text-red-600">.env</code> file.</li>
              <li>Restart the development server.</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md bg-white rounded-3xl p-8 shadow-xl text-center border border-red-100">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-dark mb-2">Something went wrong</h1>
        <p className="text-gray-500 mb-6">We couldn't load this information right now.</p>
        <button onClick={() => window.location.reload()} className="bg-dark text-white px-6 py-3 rounded-xl font-bold hover:bg-deepBlue transition-colors w-full">
          Try Again
        </button>
        <p className="text-xs text-gray-400 mt-4 break-all">{message}</p>
      </div>
    </div>
  );
}
