"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  DollarSign,
  ClipboardList,
  Users,
  GraduationCap,
  Wrench,
  BarChart3,
  Shield,
  Plug,
} from "lucide-react";

export default function PlatformNav({ clientId }: { clientId: string }) {
  const pathname = usePathname();

  const navItems = [
    { href: `/platform/${clientId}`, label: "Cockpit", icon: LayoutDashboard },
    { href: `/platform/${clientId}/collections`, label: "Collections", icon: DollarSign },
    { href: `/platform/${clientId}/claims`, label: "Claims", icon: Shield },
    { href: `/platform/${clientId}/actions`, label: "Action Queue", icon: ClipboardList },
    { href: `/platform/${clientId}/jobs`, label: "Jobs", icon: Wrench },
    { href: `/platform/${clientId}/team`, label: "Team", icon: Users },
    { href: `/platform/${clientId}/academy`, label: "Academy", icon: GraduationCap },
    { href: `/platform/${clientId}/integrations`, label: "Integrations", icon: Plug },
    { href: `/platform/${clientId}/reports`, label: "Reports", icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-[#111111] border-r border-[#2A2520] flex flex-col">
      <div className="p-6 border-b border-[#2A2520]">
        <Link href={`/platform/${clientId}`} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[#B87333] flex items-center justify-center">
            <span className="font-display text-sm font-bold text-[#0A0A0A]">S</span>
          </div>
          <div>
            <div className="font-display text-sm font-bold tracking-wider uppercase text-[#E8E2D8]">
              Surge
            </div>
            <div className="font-sans text-[10px] font-medium tracking-widest uppercase text-[#B87333]">
              Platform
            </div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const active =
            pathname === item.href || (item.href.split("/").pop() !== "" && pathname.startsWith(item.href));
          const isCockpit = item.href === `/platform/${clientId}`;
          const isActive = isCockpit ? pathname === item.href : active;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-[2px] text-sm transition-colors ${
                isActive
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
        <p className="font-sans text-[10px] uppercase tracking-widest text-[#5A5550] mb-1">
          Powered by
        </p>
        <Link
          href="https://surgeadvisory.co"
          target="_blank"
          className="font-display text-xs font-bold text-[#E8E2D8] hover:text-[#B87333]"
        >
          Surge Advisory
        </Link>
      </div>
    </aside>
  );
}
