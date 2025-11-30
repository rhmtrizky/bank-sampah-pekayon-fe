import React from "react";
import {
  GridIcon,
  CalenderIcon,
  ListIcon,
  UserCircleIcon,
  TableIcon,
  PieChartIcon,
  BoxCubeIcon,
} from "../icons/index";

export type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

export const rwNavItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/rw/dashboard",
  },
  {
    icon: <ListIcon />,
    name: "Transactions",
    path: "/rw/transactions",
  },
  {
    icon: <BoxCubeIcon />,
    name: "Online Requests",
    path: "/rw/online-requests",
  },
  {
    icon: <TableIcon />,
    name: "Price List",
    path: "/rw/price-list",
  },
  {
    icon: <CalenderIcon />,
    name: "Schedules",
    path: "/rw/schedules",
  },
  {
    icon: <BoxCubeIcon />,
    name: "Bulk Sales",
    path: "/rw/bulk-sales",
  },
  {
    icon: <PieChartIcon />,
    name: "Reports",
    path: "/rw/reports",
  },
  {
    icon: <UserCircleIcon />,
    name: "Settings",
    path: "/rw/settings",
  },
];

export const kelurahanNavItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/kelurahan/dashboard",
  },
  {
    icon: <UserCircleIcon />,
    name: "RW Management",
    path: "/kelurahan/rw-management",
  },
  {
    icon: <TableIcon />,
    name: "Price List",
    path: "/kelurahan/ppsu-price-list",
  },
  {
    icon: <CalenderIcon />,
    name: "Schedules",
    path: "/kelurahan/ppsu-schedules",
  },
  {
    icon: <BoxCubeIcon />,
    name: "Bulk Sales",
    path: "/kelurahan/bulk-sales",
  },
  {
    icon: <PieChartIcon />,
    name: "Reports",
    path: "/kelurahan/reports",
  },
  {
    icon: <UserCircleIcon />,
    name: "Settings",
    path: "/kelurahan/settings",
  },
];
