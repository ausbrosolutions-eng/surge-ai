"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Target,
  Radio,
  FileCheck2,
  Users,
  DollarSign,
  BookOpen,
  Activity,
} from "lucide-react";

const navItems = [
  { href: "/surge", label: "Cockpit", icon: LayoutDashboard },
  { href: "/surge/pipeline", label: "Pipeline", icon: Target },
  { href: "/surge/signals", label: "Signals", icon: Radio },
  { href: "/surge/audits", label: "Audits", icon: FileCheck2 },
  { href: "/surge/clients", label: "Clients", icon: Users },
  { href: "/surge/revenue", label: "Revenue", icon: DollarSign },
  { href: "/surge/activities", label: "Activities", icon: Activity },
  { href: "/surge/knowledge", label: "Knowledge", icon: BookOpen },
];

export default function SurgeNav() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#111111] border-r border-[#2A2520] flex flex-col">
      <div className="p-6 border-b border-[#2A2520]">
        <Link href="/surge" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[#B87333] flex items-center justify-center">
            <span className="font-display text-sm font-bold text-[#0A0A0A]">S</span>
          </div>
          <div>
            <div className="font-display text-sm font-bold tracking-wider uppercase text-[#E8E2D8]">
              Surge
            </div>
            <div className="font-sans text-[10px] font-medium tracking-widest uppercase text-[#9A9086]">
              Operator
            </div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/surge" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-[2px] text-sm transition-colors ${
                active
                  ? "bg-[#B87333]/15 text-[#B87333] border-l-2 border-[#B87333]"
                  : "text-[#9A9086] hover:bg-[#1A1A1A] hover:text-[#E8E2D8] border-l-2 border-transparent"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="font-sans">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#2A2520]">
        <Link
          href="/"
          className="font-sans text-xs text-[#5A5550] hover:text-[#B87333] transition-colors"
        >
          ← Back to site
        </Link>
      </div>
    </aside>
  );
}
