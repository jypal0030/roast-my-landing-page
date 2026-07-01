import { Flame } from "lucide-react";
import Link from "next/link";

export default function RoastDetailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <Flame className="h-12 w-12 text-fire-500 mx-auto mb-4" />
        <h1 className="font-display text-4xl text-white mb-4">Roast Detail</h1>
        <p className="text-ash-300 text-lg max-w-md mb-6">
          Roast history requires a database. The roast engine is live —
          go roast a landing page now!
        </p>
        <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-fire-500 px-6 py-3 text-sm font-semibold text-white hover:bg-fire-600">
          Roast a Website
        </Link>
      </div>
    </div>
  );
}
