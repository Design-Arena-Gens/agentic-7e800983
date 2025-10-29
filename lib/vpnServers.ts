export type VpnServer = {
  id: string;
  name: string;
  location: string;
  countryCode: string;
  latency: number;
  load: number;
  status: "online" | "maintenance" | "offline";
  tags: string[];
};

export const vpnServers: VpnServer[] = [
  {
    id: "nyc-edge-1",
    name: "Aether Prime",
    location: "New York, United States",
    countryCode: "US",
    latency: 18,
    load: 42,
    status: "online",
    tags: ["Premium", "Quantum Shield", "WireGuard"]
  },
  {
    id: "lon-core-2",
    name: "Cerulean Gate",
    location: "London, United Kingdom",
    countryCode: "GB",
    latency: 26,
    load: 65,
    status: "online",
    tags: ["Standard", "OpenVPN", "Tor Fusion"]
  },
  {
    id: "sgp-phoenix-1",
    name: "Helios Array",
    location: "Singapore",
    countryCode: "SG",
    latency: 72,
    load: 51,
    status: "online",
    tags: ["Premium", "WireGuard", "Streaming"]
  },
  {
    id: "syd-aurora-1",
    name: "Aurora Tide",
    location: "Sydney, Australia",
    countryCode: "AU",
    latency: 104,
    load: 58,
    status: "maintenance",
    tags: ["Standard", "OpenVPN"]
  },
  {
    id: "fra-lumen-3",
    name: "Lumen Pillar",
    location: "Frankfurt, Germany",
    countryCode: "DE",
    latency: 38,
    load: 34,
    status: "online",
    tags: ["Premium", "WireGuard", "Double-Hop"]
  },
  {
    id: "bue-horizon-1",
    name: "Horizon Echo",
    location: "Buenos Aires, Argentina",
    countryCode: "AR",
    latency: 128,
    load: 71,
    status: "offline",
    tags: ["Standard", "WireGuard"]
  }
];
