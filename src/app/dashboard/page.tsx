export default function DashboardPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-display text-4xl text-white mb-4">Dashboard</h1>
        <p className="text-ash-300 text-lg max-w-md">
          Dashboard requires a database connection. We&apos;re setting up
          Turso DB — it&apos;ll be live soon!
        </p>
      </div>
    </div>
  );
}
