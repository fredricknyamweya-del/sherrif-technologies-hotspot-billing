import {
  Activity,
  BellRing,
  ChartNoAxesCombined,
  CircleHelp,
  CreditCard,
  Gauge,
  Megaphone,
  MessageSquareText,
  MonitorCog,
  Network,
  Package,
  Radio,
  Router,
  Server,
  Settings,
  ShieldCheck,
  Ticket,
  Users,
  WalletCards,
  Wifi,
  WifiOff,
} from 'lucide-react'

export const adminNavigation = [
  {
    group: 'Overview',
    items: [{ to: '/admin/dashboard', label: 'Dashboard', icon: Gauge }],
  },
  {
    group: 'Network',
    items: [
      { to: '/admin/hotspots', label: 'Hotspots', icon: Wifi },
      { to: '/admin/routers', label: 'Routers', icon: Router },
      { to: '/admin/freeradius', label: 'FreeRADIUS', icon: ShieldCheck },
      { to: '/admin/mikrotik-monitor', label: 'MikroTik Monitor', icon: MonitorCog },
      { to: '/admin/router-migration', label: 'Router Migration', icon: WifiOff },
      { to: '/admin/network-settings', label: 'Network Settings', icon: Network },
    ],
  },
  {
    group: 'Customers',
    items: [
      { to: '/admin/packages', label: 'Packages', icon: Package },
      { to: '/admin/vouchers', label: 'Vouchers', icon: Ticket },
      { to: '/admin/transactions', label: 'Transactions', icon: CreditCard },
      { to: '/admin/active-users', label: 'Active Users', icon: Activity },
      { to: '/admin/sessions', label: 'Sessions', icon: Radio },
      { to: '/admin/clients', label: 'Clients', icon: Users },
      { to: '/admin/support-tickets', label: 'Support Tickets', icon: MessageSquareText },
      { to: '/admin/sms-marketing', label: 'SMS Marketing', icon: BellRing },
    ],
  },
  {
    group: 'System',
    items: [
      { to: '/admin/reports', label: 'Reports', icon: ChartNoAxesCombined },
      { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
      { to: '/admin/appearance', label: 'Appearance', icon: Settings },
      { to: '/admin/system-logs', label: 'System Logs', icon: Server },
      { to: '/admin/care-settings', label: 'Care Settings', icon: CircleHelp },
      { to: '/admin/password', label: 'Password', icon: WalletCards },
    ],
  },
]

export const adminSections = adminNavigation.flatMap(({ items }) =>
  items.map(({ to, label }) => ({ to, label, section: to.split('/').at(-1) })),
)
