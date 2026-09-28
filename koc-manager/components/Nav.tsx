import Link from "next/link";

export default function Nav() {
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold text-[15px]">
          KOC Manager <span className="text-muted font-normal text-xs ml-1">MVP</span>
        </Link>
        <nav className="flex gap-5 text-sm text-muted">
          <Link href="/" className="hover:text-ink">Dashboard</Link>
          <Link href="/koc" className="hover:text-ink">KOC</Link>
          <Link href="/campaigns" className="hover:text-ink">Chiến dịch</Link>
        </nav>
      </div>
    </header>
  );
}
