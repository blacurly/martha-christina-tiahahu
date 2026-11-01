import Link from "next/link";
import {
  UserRound,
  Settings,
  ShieldCheck,
  ClipboardList,
  LogOut,
  UserRoundX,
  ChevronRight,
} from "lucide-react";

import { Suspense } from "react";
import { connection } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import { logout } from "./actions";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Profil | Sycle",
};

const profileMenus = [
  {
    title: "Pengaturan",
    description: "Pengaturan akun dan preferensi penggunaan.",
    icon: Settings,
    status: "Segera tersedia",
  },
  {
    title: "Privasi",
    description: "Pelajari kebijakan privasi dan penggunaan data.",
    icon: ShieldCheck,
    href: "/profile/privacy",
  },
  {
    title: "Pengelolaan Data Pengguna",
    description: "Lihat kembali catatan dan riwayat Health Tracker.",
    icon: ClipboardList,
    href: "/healthtracker/history",
  },
];

function MenuCard({ item }) {
  const Icon = item.icon;

  const content = (
    <div className="flex items-center gap-4">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#F8E8EF] text-[#B84E73]">
        <Icon size={21} />
      </div>

      <div className="min-w-0 flex-1">
        <h2 className="font-extrabold text-[#332A35]">
          {item.title}
        </h2>
        <p className="mt-1 text-sm leading-6 text-[#6F6570]">
          {item.description}
        </p>

        {item.status && (
          <p className="mt-2 text-xs font-bold text-[#8A7D89]">
            {item.status}
          </p>
        )}
      </div>

      {item.href && (
        <ChevronRight
          size={20}
          className="shrink-0 text-[#8A7D89]"
        />
      )}
    </div>
  );

  const className =
    "block rounded-[22px] border border-[#F0E5EB] bg-white p-5 transition-colors";

  if (item.href) {
    return (
      <Link
        href={item.href}
        className={`${className} hover:border-[#DDB3C3] hover:bg-[#FFFBFD]`}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className={`${className} opacity-80`}>
      {content}
    </div>
  );
}

async function ProfileContent({ searchParams }) {
  await connection();
  const user = await getCurrentUser();
  const params = await searchParams;

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <p className="text-sm font-extrabold uppercase tracking-wider text-[#B84E73]">
          Akun Saya
        </p>

        <h1 className="mt-2 text-3xl font-extrabold text-[#332A35]">
          Profil
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-[#6F6570]">
          Kelola akun, privasi, dan catatan kesehatanmu di Sycle.
        </p>
      </header>

      <section className="mb-8 rounded-[22px] bg-[#F8E8EF] p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white text-[#B84E73]">
            <UserRound size={28} />
          </div>

          <div className="min-w-0">
            <h2 className="text-xl font-extrabold text-[#332A35]">
              Akun Pengguna
            </h2>
            <p className="mt-1 break-words text-sm text-[#6F6570]">
              {user.displayName}
            </p>
            <p className="mt-1 break-words text-sm text-[#6F6570]">
              {user.email}
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-extrabold text-[#332A35]">
          Pengaturan dan Pengelolaan Akun
        </h2>

        <div className="grid gap-3">
          {profileMenus.map((item) => (
            <MenuCard key={item.title} item={item} />
          ))}

          <div className="rounded-[22px] border border-[#F0E5EB] bg-white p-5">
            <div className="flex items-center gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#F8E8EF] text-[#B84E73]">
                <UserRoundX size={21} />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="font-extrabold text-[#332A35]">
                  Penghapusan Data atau Akun
                </h2>
                <p className="mt-1 text-sm leading-6 text-[#6F6570]">
                  Kelola permintaan penghapusan data pribadi atau akunmu.
                </p>
                <p className="mt-2 text-xs font-bold text-[#8A7D89]">
                  Pengaturan penghapusan akan disiapkan berikutnya.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-[22px] border border-[#F0E5EB] bg-white p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-extrabold text-[#332A35]">
              Keluar dari Akun
            </h2>
            <p className="mt-1 text-sm leading-6 text-[#6F6570]">
              Akhiri sesi masukmu di perangkat ini.
            </p>
          </div>

          <form action={logout}>
            <Button
              type="submit"
              variant="outline"
              size="lg"
              className="w-full border-[#B84E73] text-[#8E3E5E] hover:bg-[#F8E8EF] sm:w-auto"
            >
              <LogOut size={18} />
              Keluar dari Akun
            </Button>
          </form>
        </div>

        {params?.error === "logout" && (
          <p className="mt-4 text-sm text-red-700">
            Logout belum berhasil. Silakan coba kembali.
          </p>
        )}
      </section>
    </main>
  );
}

export default function ProfilePage({ searchParams }) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
          <p className="text-sm text-[#6F6570]">
            Memuat profil...
          </p>
        </main>
      }
    >
      <ProfileContent searchParams={searchParams} />
    </Suspense>
  );
}