import { useState, useEffect } from 'react';

interface HealthStatus {
  status: string;
  timestamp: string;
}

function App() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/../health')
      .then((res) => res.json())
      .then(setHealth)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="app">
      <header>
        <h1>Welcome to Your App</h1>
        <p>Your PERN stack application is ready!</p>
      </header>

      <main>
        <section className="status-card">
          <h2>Backend Status</h2>
          {error ? (
            <p className="error">Error: {error}</p>
          ) : health ? (
            <div>
              <p className="success">Status: {health.status}</p>
              <p>Last checked: {new Date(health.timestamp).toLocaleString()}</p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </section>

        <section className="next-steps">
          <h2>Next Steps</h2>
          <ul>
            <li>Review the generated Prisma schema in <code>backend/prisma/schema.prisma</code></li>
            <li>Run <code>npm run db:push</code> to sync the schema with your database</li>
            <li>Use <code>npm run db:studio</code> to browse your data</li>
            <li>Start building your features!</li>
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
