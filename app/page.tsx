"use client";

import { useEffect, useMemo, useState } from "react";
import { vpnServers } from "@/lib/vpnServers";

type IpInfo = {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  country_code?: string;
  latitude?: number;
  longitude?: number;
  org?: string;
  postal?: string;
  timezone?: string;
};

type IpStatus = "loading" | "ready" | "error";

const fallbackServers = ["https://ipapi.co/json/", "https://ipwho.is/"];

function flagEmoji(countryCode?: string) {
  if (!countryCode) return "🌐";
  const codePoints = countryCode
    .trim()
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

function formatRelativeTime(date?: Date) {
  if (!date) return "—";
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.round(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.round(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
}

type ConnectionInsight = {
  headline: string;
  accent: string;
  detail: string;
};

function buildInsights(ipInfo: IpInfo | null, latency: number): ConnectionInsight[] {
  if (!ipInfo) {
    return [
      {
        headline: "Resolving Network Footprint",
        accent: "Awaiting provider intel",
        detail:
          "We are mapping your ingress path and pulling the carrier graph. Hold tight."
      }
    ];
  }
  const insights: ConnectionInsight[] = [];
  const org = ipInfo.org ?? "Unknown Operator";
  if (org.toLowerCase().includes("vpn")) {
    insights.push({
      headline: "Shielded Hop Detected",
      accent: org,
      detail:
        "Your uplink is encapsulated through a VPN-grade provider. Traffic is obfuscated."
    });
  } else {
    insights.push({
      headline: "Direct Backbone Link",
      accent: org,
      detail:
        "We routed your session over a direct ISP uplink. Consider enabling multi-hop for stealth."
    });
  }

  if (latency < 40) {
    insights.push({
      headline: "Ultra-Low Latency",
      accent: `${latency} ms baseline`,
      detail: "Excellent for streaming, trading, and live collaboration."
    });
  } else if (latency < 90) {
    insights.push({
      headline: "Stable Transit Path",
      accent: `${latency} ms transit`,
      detail: "Optimized for HD streaming and secure browsing."
    });
  } else {
    insights.push({
      headline: "Long-Haul Route Active",
      accent: `${latency} ms latency`,
      detail: "Switch to a closer edge for gaming or low-variance traffic."
    });
  }

  insights.push({
    headline: "Geo Masking Vector",
    accent: `${ipInfo.city ?? "Unknown City"}, ${ipInfo.country ?? "Globe"}`,
    detail:
      "Mask alignment active. Content providers observe this point-of-presence for your session."
  });

  return insights;
}

export default function Page() {
  const [ipInfo, setIpInfo] = useState<IpInfo | null>(null);
  const [ipStatus, setIpStatus] = useState<IpStatus>("loading");
  const [lastUpdated, setLastUpdated] = useState<Date | undefined>();
  const [selectedServerId, setSelectedServerId] = useState(vpnServers[0]?.id);

  const selectedServer = useMemo(
    () => vpnServers.find((server) => server.id === selectedServerId) ?? vpnServers[0],
    [selectedServerId]
  );

  const fleetHealth = useMemo(() => {
    const online = vpnServers.filter((server) => server.status === "online").length;
    const maintenance = vpnServers.filter(
      (server) => server.status === "maintenance"
    ).length;
    const offline = vpnServers.filter((server) => server.status === "offline").length;
    const avgLatency =
      vpnServers.reduce((acc, server) => acc + server.latency, 0) / vpnServers.length;
    const avgLoad =
      vpnServers.reduce((acc, server) => acc + server.load, 0) / vpnServers.length;
    return { online, maintenance, offline, avgLatency, avgLoad };
  }, []);

  const insights = useMemo(
    () => buildInsights(ipInfo, selectedServer?.latency ?? 120),
    [ipInfo, selectedServer?.latency]
  );

  useEffect(() => {
    let isMounted = true;

    async function hydrateIp() {
      setIpStatus("loading");

      for (const endpoint of fallbackServers) {
        try {
          const res = await fetch(endpoint, { cache: "no-store" });
          if (!res.ok) continue;
          const payload = await res.json();
          const normalized: IpInfo = {
            ip: payload.ip ?? payload.query ?? payload.ip_address,
            city: payload.city ?? payload.region ?? payload.location?.city,
            region: payload.region ?? payload.region_name,
            country: payload.country ?? payload.country_name,
            country_code: payload.country_code ?? payload.country_code2,
            latitude: payload.latitude ?? payload.lat ?? payload.location?.latitude,
            longitude: payload.longitude ?? payload.lon ?? payload.location?.longitude,
            org: payload.org ?? payload.connection?.isp ?? payload.asn?.name,
            postal: payload.postal ?? payload.zip,
            timezone: payload.timezone ?? payload.time_zone
          };
          if (!normalized.ip) throw new Error("No IP in payload");
          if (!isMounted) return;
          setIpInfo(normalized);
          setIpStatus("ready");
          setLastUpdated(new Date());
          return;
        } catch (error) {
          // continue
        }
      }

      if (!isMounted) return;
      setIpStatus("error");
    }

    hydrateIp();
    const interval = setInterval(hydrateIp, 30_000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <main className="relative overflow-hidden">
      <section className="bg-grid relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-brand-500/25 via-transparent to-transparent blur-3xl" />
        <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 pb-24 pt-20 lg:px-10">
          <header className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-brand-200">
                  AetherVPN OpsCore
                </p>
                <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
                  Live IP telemetry & planetary VPN command
                </h1>
              </div>
              <div className="glass flex max-w-xs flex-col gap-2 rounded-2xl px-5 py-4">
                <p className="text-xs uppercase tracking-[0.25em] text-brand-200">
                  Fleet Health
                </p>
                <div className="flex items-center justify-between text-sm text-slate-200">
                  <span>Operational</span>
                  <span className="font-mono text-brand-100">
                    {fleetHealth.online}/ {vpnServers.length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Latency Vector</span>
                  <span>{Math.round(fleetHealth.avgLatency)} ms</span>
                </div>
              </div>
            </div>
            <p className="max-w-3xl text-lg text-slate-300">
              Monitor ingress IP posture, latency budgets, and the global VPN mesh in real
              time. Sync your session with elite gateways engineered for zero-trust
              routing, double-hop privacy, and entertainment unblocking.
            </p>
          </header>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="glass relative overflow-hidden rounded-3xl border border-slate-800/60">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-brand-300/5" />
              <div className="relative flex flex-col gap-6 p-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-sm uppercase tracking-[0.3em] text-brand-200">
                      Current Identity
                    </h2>
                    <p className="mt-2 text-3xl font-semibold text-slate-50">
                      {ipStatus === "ready"
                        ? ipInfo?.ip
                        : ipStatus === "loading"
                        ? "Resolving…"
                        : "Unavailable"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <span className="rounded-full border border-brand-400/40 px-3 py-1 font-mono text-brand-100">
                      {ipStatus === "ready" ? "LIVE" : ipStatus === "loading" ? "SYNC" : "ERROR"}
                    </span>
                    <span>Updated {formatRelativeTime(lastUpdated)}</span>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <StatCard
                    label="Geofence"
                    value={`${flagEmoji(ipInfo?.country_code)} ${ipInfo?.city ?? "—"}, ${
                      ipInfo?.country ?? "—"
                    }`}
                    hint={ipInfo?.region ?? "Locating region"}
                  />
                  <StatCard
                    label="Carrier Graph"
                    value={ipInfo?.org ?? "Reconciling…"}
                    hint={ipInfo?.timezone ?? "Timezone sync pending"}
                  />
                  <StatCard
                    label="Coordinates"
                    value={
                      ipInfo?.latitude && ipInfo.longitude
                        ? `${ipInfo.latitude.toFixed(2)}°, ${ipInfo.longitude.toFixed(2)}°`
                        : "Encrypted"
                    }
                    hint={ipInfo?.postal ? `Postal ${ipInfo.postal}` : "Postal obfuscated"}
                  />
                  <StatCard
                    label="Preferred Gateway"
                    value={selectedServer?.name ?? "Select server"}
                    hint={`${selectedServer?.location ?? "—"} • ${selectedServer?.latency ?? 0} ms`}
                  />
                </div>

                <div className="rounded-2xl border border-brand-400/15 bg-slate-900/60 p-4">
                  <h3 className="text-xs uppercase tracking-[0.25em] text-brand-200">
                    Live Telemetry
                  </h3>
                  <ul className="mt-3 space-y-3">
                    {insights.map((item) => (
                      <li
                        key={item.headline}
                        className="rounded-xl border border-brand-400/10 bg-slate-900/60 p-3"
                      >
                        <p className="text-sm font-semibold text-slate-100">
                          {item.headline}
                        </p>
                        <p className="text-xs text-brand-200">{item.accent}</p>
                        <p className="mt-1 text-sm text-slate-300">{item.detail}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="glass rounded-3xl border border-slate-800/60 p-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-sm uppercase tracking-[0.3em] text-brand-200">
                      Gateway Matrix
                    </h2>
                    <p className="mt-2 text-2xl font-semibold text-slate-50">
                      {vpnServers.length} global exits
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-full border border-brand-400/40 bg-brand-500/10 px-5 py-2 text-sm font-medium text-brand-100 transition hover:border-brand-300 hover:bg-brand-400/20"
                  >
                    Auto-Tune Mesh
                  </button>
                </div>
                <p className="mt-4 text-sm text-slate-300">
                  Choose the optimal tunnel for latency, privacy, or streaming unlocks.
                  Mesh AI continuously re-routes to maintain stealth-level anonymity.
                </p>
              </div>

              <div className="grid gap-4">
                {vpnServers.map((server) => (
                  <ServerCard
                    key={server.id}
                    server={server}
                    active={server.id === selectedServerId}
                    onSelect={() => setSelectedServerId(server.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function StatCard({
  label,
  value,
  hint
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-brand-400/10 bg-slate-900/50 p-4 shadow-card">
      <p className="text-xs uppercase tracking-[0.25em] text-brand-200">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-50">{value}</p>
      <p className="text-xs text-slate-400">{hint}</p>
    </div>
  );
}

type ServerCardProps = {
  server: (typeof vpnServers)[number];
  active: boolean;
  onSelect: () => void;
};

function ServerCard({ server, active, onSelect }: ServerCardProps) {
  const statusDot =
    server.status === "online"
      ? "bg-emerald-400"
      : server.status === "maintenance"
      ? "bg-amber-400"
      : "bg-rose-500";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group flex flex-col gap-3 rounded-2xl border px-5 py-4 text-left transition ${
        active
          ? "border-brand-400/60 bg-brand-500/10 shadow-card"
          : "border-brand-400/10 bg-slate-900/50 hover:border-brand-400/25 hover:bg-slate-900/70"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-100">{server.name}</p>
          <p className="text-xs text-slate-400">
            {flagEmoji(server.countryCode)} {server.location}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span className={`h-2.5 w-2.5 rounded-full ${statusDot}`} />
          <span className="uppercase tracking-widest">
            {server.status === "online"
              ? "LIVE"
              : server.status === "maintenance"
              ? "MAINT"
              : "DOWN"}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
        <span className="rounded-full border border-brand-400/20 px-2 py-1 font-mono text-brand-100">
          {server.latency} ms
        </span>
        <span className="rounded-full border border-brand-400/20 px-2 py-1 font-mono text-brand-100">
          {server.load}% load
        </span>
        {server.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-brand-400/10 bg-brand-500/5 px-2 py-1 text-[11px] uppercase tracking-[0.25em] text-brand-100"
          >
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}
