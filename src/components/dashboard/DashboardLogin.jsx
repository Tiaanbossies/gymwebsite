export default function DashboardLogin({ onSubmit, pass, setPass, error }) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="card-surface rounded-2xl p-8 w-full max-w-sm flex flex-col gap-6">
        <div>
          <span className="eyebrow">Analytics</span>
          <h1 className="mt-2 font-display text-2xl tracking-headline text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-ink-400">Enter the passphrase to continue.</p>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            className="input"
            placeholder="Passphrase"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            autoFocus
          />
          {error && (
            <p className="text-sm text-brand-400">Incorrect passphrase. Try again.</p>
          )}
          <button type="submit" className="btn btn-primary justify-center">
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
}
