"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MapPin, UserRound } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { useAssessment } from "@/context/AssessmentContext";

const navItems = [
  { href: "/", label: "Beranda" },
  { href: "/healthtracker", label: "Health Tracker" },
  { href: "/education", label: "Info & Edukasi" },
  { href: "/healthcare", label: "Healthcare" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { location } = useAssessment();

  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const isActive = (href) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    "Akun Saya";

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    async function checkSession() {
      const { data, error } = await supabase.auth.getSession();

      if (mounted) {
        setUser(error ? null : data.session?.user ?? null);
        setIsCheckingAuth(false);
      }
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        setIsCheckingAuth(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="header">
      <Link className="brand" href="/" aria-label="SYCLE Beranda">
        <Image
          src="/sycle-logo.png"
          alt="SYCLE"
          width={80}
          height={32}
          priority
          className="brand-logo"
        />
      </Link>

      <nav className="nav-menu" aria-label="Navigasi utama">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-link ${
              isActive(item.href) ? "nav-active" : ""
            }`}
            aria-current={isActive(item.href) ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="nav-actions">
        {!isCheckingAuth &&
          (user ? (
            <Link
              href="/profile"
              className="nav-account"
              aria-label={`Buka profil ${displayName}`}
            >
              <UserRound size={19} aria-hidden="true" />
              <span>{displayName}</span>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className={`nav-button nav-button-outline ${
                  pathname === "/login" ? "nav-button-active" : ""
                }`}
                aria-current={pathname === "/login" ? "page" : undefined}
              >
                Masuk
              </Link>
              <Link
                href="/signup"
                className={`nav-button ${
                  pathname === "/signup" ? "nav-button-active" : ""
                }`}
                aria-current={pathname === "/signup" ? "page" : undefined}
              >
                Daftar
              </Link>
            </>
          ))}
      </div>
    </header>
  );
}