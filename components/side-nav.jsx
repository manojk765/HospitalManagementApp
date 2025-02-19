"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart2, ChevronDown, ChevronRight, AlertCircle, BarChart3, Bed, CalendarDays, FileText, Stethoscope, Users, Wallet, Factory, Pill, Rows3 } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";

const sidebarItems = [
  {
    title: "Dashboard",
    icon: BarChart3,
    href: "/admin",
    visible: ["admin"]
  },
  {
    title: "Hospital Dashboard",
    icon: BarChart3,
    href: "/staff",
    visible: ["admin", "staff"]
  },
  {
    title: "Pharmacy Dashboard",
    icon: BarChart2,
    href: "/pharma",
    visible: ["admin", "pharma"]
  },

  // Patients
  {
    title: "Patient Management",
    icon: Users,
    submenu: [
      { title: "Add Patient", href: "/list/patients/add" },
      { title: "IPD/OPD Patients", href: "/list/patients/list" },
      { title: "Patient Profile", href: "/list/patients/profile" },
    ],
    visible: ["admin", "staff"]
  },
  {
    title: "Patient Management",
    icon: Users,
    href: "/list/patients/list", 
    visible: ["pharma"]
  } ,

  {
    title: "Staff Management",
    icon: Stethoscope,
    submenu: [
      { title: "Department List", href: "/list/staff/departments" },
      { title: "Staff List", href: "/list/staff/staff-list" },
      { title: "Doctor List", href: "/list/staff/doctor-list" },
    ],
    visible: ["admin"]
  },

  {
    title: "Monitor Births",
    icon: Bed,
    submenu: [
      { title: "Add Birth", href: "/list/hospital/add-birth" },
      { title: "Birth Report", href: "/list/hospital/birth-reports" },
    ],
    visible: ["admin", "staff"]
  },

  {
    title: "Beds Management",
    icon: FileText,
    submenu: [
      { title: "Bed Group", href: "/list/beds/list" },
      { title: "Add Admission", href: "/list/beds/add" },
    ],
    visible: ["admin", "staff"]
  },

  {
    title: "Services",
    icon: Rows3,
    submenu: [
      { title: "Service List", href: "/list/services/list" },
      { title: "Tests List", href: "/list/services/tests" },
      { title: "Surgeries List", href: "/list/services/surgery" },
    ],
    visible: ["admin"]
  },

  {
    title: "Pharmacy and Inventory",
    icon: Factory,
    submenu: [
      { title: "Add Inventory", href: "/list/inventory/add-inventory" },
      { title: "Inventory Item Lists", href: "/list/inventory/inventory-list" },
      { title: "Medicine List", href: "/list/medicine/medicines" },
      { title: "Manufacturer List", href: "/list/medicine/manufacturers" },
    ],
    visible: ["admin", "pharma"]
  },

  {
    title: "Finance",
    icon: Wallet,
    submenu: [
      { title: "Add Invoice", href: "/finance/invoice" },
      { title: "Invoice List", href: "/finance/invoice-list" },
      { title: "Invoice Details", href: "/finance/invoice-details" },
    ],
    visible: ["admin"]
  }
];


export default function SidebarNav() {
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const { user } = useUser();
  const role = user?.publicMetadata?.role;

  const handleToggleSubmenu = (title) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };

  const isActiveLink = (href) => pathname === href;

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-white border-r shadow-md flex flex-col">
      <div className="border-b p-4 flex items-center gap-2">
        <AlertCircle className="h-6 w-6 text-primary" />
        <span className="font-semibold">Hospital Management</span>
      </div>
      <div className="p-4 flex-1 overflow-y-auto">
        <ul>
          {sidebarItems.map((item) => {
            if (!item.visible.includes(role)) return null;

            return (
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
                      className={`flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer transition duration-200 ease-in-out ${
                        isActiveLink(item.href) ? "bg-gray-100" : ""
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  )}
                  {item.submenu && openSubmenu === item.title && (
                    <motion.ul
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      className="space-y-1"
                    >
                      {item.submenu.map((subItem) => (
                        <li key={subItem.title}>
                          <Link
                            href={subItem.href}
                            className={`block pl-8 pr-4 py-2 rounded-md hover:bg-gray-100 cursor-pointer transition duration-200 ease-in-out ${
                              isActiveLink(subItem.href) ? "bg-gray-100" : ""
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
            );
          })}
        </ul>
        <div className="border-t p-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
      
    </div>
  );
}
