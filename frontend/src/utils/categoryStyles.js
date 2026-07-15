import {
  Siren,
  HeartPulse,
  UtensilsCrossed,
  Home,
  UserSearch,
  CircleHelp,
} from "lucide-react";

// Central place to map each category to an icon + color scheme so
// cards, badges, and filters all stay visually consistent.
export const CATEGORY_META = {
  "Critical Alert": {
    icon: Siren,
    color: "text-accent-400",
    bg: "bg-accent-600/15",
    ring: "ring-accent-600/30",
  },
  Medical: {
    icon: HeartPulse,
    color: "text-rose-400",
    bg: "bg-rose-500/15",
    ring: "ring-rose-500/30",
  },
  Food: {
    icon: UtensilsCrossed,
    color: "text-amber-400",
    bg: "bg-amber-500/15",
    ring: "ring-amber-500/30",
  },
  Shelter: {
    icon: Home,
    color: "text-sky-400",
    bg: "bg-sky-500/15",
    ring: "ring-sky-500/30",
  },
  "Missing Person": {
    icon: UserSearch,
    color: "text-violet-400",
    bg: "bg-violet-500/15",
    ring: "ring-violet-500/30",
  },
  Other: {
    icon: CircleHelp,
    color: "text-gray-400",
    bg: "bg-gray-500/15",
    ring: "ring-gray-500/30",
  },
};

export const CATEGORIES = Object.keys(CATEGORY_META);
