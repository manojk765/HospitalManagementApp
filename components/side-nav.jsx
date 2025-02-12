"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart2, ChevronDown, ChevronRight, AlertCircle, BarChart3, Bed, CalendarDays, FileText, Stethoscope, Users, Wallet, Factory, Pill } from "lucide-react";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Appointment List",
    icon: CalendarDays,
    submenu: [
      {
        title: "Add Appointment",
        href: "/appointments/add",
      },
      {
        title: "Appointment List",
        href: "/appointments/list",
      },
    ],
  },
  {
    title: "Patient",
    icon: Users,
    submenu: [
      {
        title: "Add Patient",
        href: "/patients/add",
      },
      {
        title: "IPD/OPD Patients",
        href: "/patients/list",
      },
      {
        title: "Patient Profile",
        href: "/patients/profile",
      },
    ],
  },
  {
    title: "Staff",
    icon: Stethoscope,
    submenu: [
      {
        title: "Add Doctor/Nurse",
        href: "/staff/add",
      },
      {
        title: "Departement list",
        href: "/staff/departments"
      },
      {
        title: "Staff List",
        href: "/staff/staff-list",
      },
      {
        title: "Doctor List",
        href: "/staff/doctor-list",
      }
    ],
  },
  {
    title: "Finance",
    icon: Wallet,
    submenu: [
      {
        title: "Add Invoice",
        href: "/finance/invoice",
      },
      {
        title: "Invoice List",
        href: "/finance/invoice-list",
      },
      {
        title: "Invoice Details",
        href: "/finance/invoice-details",
      }
    ]
  },
  {
    title: "Monitor Hospital",
    icon: Bed,
    submenu: [
      {
        title: "Add Birth",
        href: "/hospital/add-birth"
      },
      {
        title: "Birth Report",
        href: "/hospital/birth-reports",
      },
    ],
  },
  {
    title: "Beds",
    icon: FileText,
    submenu: [
      {
        title: "Bed Group",
        href: "/beds/add",
      },
      {
        title: "Bed Allotment",
        href: "/beds/list",
      },
    ],
  },
  {
    title: "Pharmacy DashBoard",
    icon: BarChart2,
    href: "/pharmacy-dashboard"
  },
  {
    title: "Inventory",
    icon: Factory,
    submenu: [
      {
        title: "Add Inventory",
        href: "/inventory/add-inventory"
      },
      {
        title: "Inventory Item Lists",
        href: "/inventory/inventory-list",
      },
    ]
  },
  {
    title: "Medicine",
    icon: Pill,
    submenu: [
      {
        title: "Medicine List",
        href: "/medicine/medicines"
      },
      {
        title: "Manufacturer List",
        href: '/medicine/manufacturers'
      },
    ]
  },
  {
    title: "User Profile",
    href: "/profile",
    icon: Users,
  },
];

export default function SidebarNav() {
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const handleToggleSubmenu = (title) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };

  const isActiveLink = (href) => {
    return pathname === href;
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-white border-r shadow-md flex flex-col">
      <div className="border-b p-4 flex items-center gap-2">
        <AlertCircle className="h-6 w-6 text-primary" />
        <span className="font-semibold">Hospital Management</span>
      </div>
      <div className="p-4 flex-1 overflow-y-auto">
        <ul>
          {sidebarItems.map((item) => (
            <li key={item.title}>
              <div className={`mb-2 ${item.submenu ? "space-y-1" : ""}`}>
                {item.submenu ? (
                  <div
                    className={`flex items-center justify-between gap-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer transition duration-200 ease-in-out ${
                      openSubmenu === item.title ? "bg-gray-100" : ""
                    }`}
                    onClick={() => handleToggleSubmenu(item.title)}
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </div>
                    {openSubmenu === item.title ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition duration-200 ease-in-out ${
                      isActiveLink(item.href) ? "bg-[#11c393]" : ""
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                )}
                {item.submenu && openSubmenu === item.title && (
                  <motion.ul
                    className="ml-4 space-y-1"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.submenu.map((subItem) => (
                      <li key={subItem.href}>
                        <Link
                          href={subItem.href}
                          className={`block p-2 rounded-md text-sm hover:bg-gray-100 transition duration-200 ease-in-out ${
                            isActiveLink(subItem.href) ? "bg-[#11c393]" : ""
                          }`}
                        >
                          {subItem.title}
                        </Link>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}