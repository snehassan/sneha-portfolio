"use client";

import { useRouter } from "next/navigation";

/** The 12×12 footer pixel button → navigates to the secret game. */
export function SecretPixel() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.push("/game")}
      aria-label="Secret"
      title="?"
      className="footer-pixel"
    />
  );
}
