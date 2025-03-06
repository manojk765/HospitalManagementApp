"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart2, ChevronDown, ChevronRight, AlertCircle, BarChart3, Bed, Calendar , CalendarFold , Stethoscope, Users, Wallet, Factory, Pill, Rows3  , IndianRupee, User } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";

const sidebarItems = [
  {
    title: "Dashboard",
    icon: BarChart3,
    href: "/admin",
    visible: ["admin"]
  },
  {
    title: "Add new user",
    icon: User,
    href: "/admin/add-user",
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

  {
    title: "Patient Management",
    icon: Users,
    submenu: [
      { title: "Add IPD Patient", href: "/list/patients/add/ipd" },
      { title: "IPD Patients", href: "/list/patients/ipd" },
      {title:"Add OPD Patient", href:"/list/patients/add/opd"},
      { title: "OPD Patients", href: "/list/patients/opd" },
    ],
    visible: ["admin", "staff"] 
  },
  {
    title:"Patient Services",
    icon: Users,
    submenu:[
      {title: "Services",href:"/patient-services"},
      {title:"Tests", href:"/patient-tests"},
      {title:"Sample",href:"/list/admissions/sample"}
    ], 
    visible: ["admin", "staff"]
  },
  {
    title: "Payments",
    icon: IndianRupee ,
    submenu:[
      { title:"Add Payment",href:"/list/payments/add"},
      {title:"View Payment History",href:"/list/payments/history"}
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
    title: "Admission Info",
    icon: CalendarFold ,
    submenu:[
      { title: "Add admission" , href: "/list/admissions/add" },
      {title: "Admission List",href: "/list/admissions/list"},
      {title: "Discharges",href: "/list/admissions/discharges"},
    ],
    visible: ["admin", "staff"]
  },
  {
    title: "Monitor Births",
    icon: Calendar,
    submenu: [
      { title: "Add Birth", href: "/list/births/add-birth" },
      { title: "Birth Report", href: "/list/births/birth-reports" },
    ],
    visible: ["admin", "staff"]
  },
  {
    title: "Beds Management",
    icon: Bed,
    submenu: [
      { title: "Bed Group", href: "/list/beds" },
      { title: "Add a new bed", href: "/list/beds/add" },
    ],
    visible: ["admin"]
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
      { title: "Expense Management", href: "/finance/expense" },
      { title: "Income Management", href: "/finance/expense-list" },
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
