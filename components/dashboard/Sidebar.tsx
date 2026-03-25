"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Target,
  CheckSquare,
  PlusCircle,
  BookOpen,
  MapPin,
  Star,
  Search,
  Bot,
  Shield,
  DollarSign,
  Share2,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Waves,
  Menu,
  X,
  FileText,
  Sparkles,
  FileSignature,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Client } from "@/lib/types";
import ProgressRing from "./ProgressRing";

const tradeIcon: Record<string, string> = {
  restoration: "🌊",
  hvac: "❄️",
  plumbing: "🔧",
  electrical: "⚡",
  roofing: "🏠",
  landscaping: "🌿",
  pest_control: "🐛",
  cleaning: "✨",
  painting: "🎨",
  garage_doors: "🚪",
  gutters: "🏗️",
  windows: "🪟",
  general: "🔨",
};

const mainNav = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/clients", icon: Users, label: "Clients" },
  { href: "/dashboard/leads", icon: Target, label: "Leads" },
  { href: "/dashboard/tasks", icon: CheckSquare, label: "Tasks" },
  { href: "/dashboard/proposals", icon: FileText, label: "Proposals" },
  { href: "/dashboard/contracts", icon: FileSignature, label: "Contracts & SOW" },
  { href: "/dashboard/outreach", icon: Target, label: "Cold Outreach" },
  { href: "/dashboard/onboarding", icon: PlusCircle, label: "New Client" },
  { href: "/dashboard/knowledge", icon: BookOpen, label: "Knowledge Base" },
];

const clientModules = [
  { key: "gbp", href: "gbp", icon: MapPin, label: "GBP Optimization" },
  { key: "lsa", href: "lsa", icon: Star, label: "LSA Management" },
  { key: "seo", href: "seo", icon: Search, label: "Local SEO" },
  { key: "ai-search", href: "ai-search", icon: Bot, label: "AI Search / AEO" },
  { key: "reputation", href: "reputation", icon: Shield, label: "Reputation" },
  { key: "ads", href: "ads", icon: DollarSign, label: "Google Ads" },
  { key: "social", href: "social", icon: Share2, label: "Social Media" },
  { key: "content", href: "content", icon: Sparkles, label: "AI Content" },
  { key: "reports", href: "reports", icon: BarChart3, label: "Reports" },
];

interface Props {
  clients: Client[];
  selectedClientId?: string;
}

export default function Sidebar({ clients, selectedClientId }: Props) {
  const pathname = usePathname();
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const selectedClient = clients.find((c) => c.id === selectedClientId);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gray-900 border-r border-gray-800">
      {/* Logo */}
      <div className="p-5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center glow-teal">
            <Waves className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">Surge <span className="text-blue-400">AI</span></p>
            <p className="text-xs text-gray-500 mt-0.5">Agency OS</p>
          </div>
        </div>
      </div>

      {/* Client Switcher */}
      <div className="p-3 border-b border-gray-800">
        <button
          onClick={() => setClientDropdownOpen(!clientDropdownOpen)}
          className="w-full flex items-center justify-between gap-2 bg-gray-800 hover:bg-gray-750 rounded-lg px-3 py-2.5 transition-colors"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-base">
              {selectedClient ? tradeIcon[selectedClient.trade] : "👥"}
            </span>
            <span className="text-sm text-gray-200 truncate">
              {selectedClient ? selectedClient.businessName : "Select Client"}
            </span>
          </div>
          {clientDropdownOpen ? (
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
          )}
        </button>

        {clientDropdownOpen && (
          <div className="mt-1 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <Link
              href="/dashboard/clients"
              onClick={() => setClientDropdownOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:bg-gray-700 hover:text-white transition-colors border-b border-gray-700"
            >
              <Users className="w-3 h-3" />
              All Clients
            </Link>
            {clients.map((client) => (
              <Link
                key={client.id}
                href={`/dashboard/clients/${client.id}`}
                onClick={() => setClientDropdownOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-700 transition-colors",
                  client.id === selectedClientId
                    ? "bg-blue-600/20 text-blue-300"
                    : "text-gray-300"
                )}
              >
                <span>{tradeIcon[client.trade]}</span>
                <span className="truncate">{client.businessName}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {mainNav.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                active
                  ? "bg-blue-600/20 text-blue-300 font-medium"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}

        {/* Client-specific modules */}
        {selectedClient && (
          <div className="pt-3">
            <p className="text-xs text-gray-600 uppercase tracking-wider px-3 mb-1.5 font-medium">
              {selectedClient.businessName}
            </p>
            {clientModules.map(({ href, icon: Icon, label, key }) => {
              const fullHref = `/dashboard/clients/${selectedClient.id}/${href}`;
              const active = pathname === fullHref;
              const score = (selectedClient.scores as unknown as Record<string, number>)[key] ?? 0;
              return (
                <Link
                  key={href}
                  href={fullHref}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                    active
                      ? "bg-blue-600/20 text-blue-300 font-medium"
                      : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1">{label}</span>
                  {score > 0 && (
                    <span
                      className={cn(
                        "text-xs font-medium",
                        score >= 80
                          ? "text-emerald-400"
                          : score >= 60
                          ? "text-amber-400"
                          : "text-red-400"
                      )}
                    >
                      {score}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Agency health score */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Agency Health</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {clients.filter((c) => c.status === "active").length} active clients
            </p>
          </div>
          {clients.length > 0 && (
            <ProgressRing
              score={Math.round(
                clients.reduce((s, c) => s + c.scores.overall, 0) / clients.length
              )}
              size={44}
              strokeWidth={4}
              showLabel
            />
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden xl:flex w-60 flex-shrink-0 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="xl:hidden fixed top-4 left-4 z-50 bg-gray-800 border border-gray-700 rounded-lg p-2"
      >
        <Menu className="w-5 h-5 text-gray-300" />
      </button>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="xl:hidden fixed inset-0 z-50 flex">
          <div className="w-60 flex-shrink-0 h-full">
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/50 relative" onClick={() => setMobileOpen(false)}>
            <button className="absolute top-4 right-4 text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
