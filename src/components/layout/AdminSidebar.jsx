import { NavLink } from "react-router-dom";
import { cn } from "../../lib/utils";
import { 
  Users, 
  Package, 
  Calendar, 
  Ticket, 
  LayoutDashboard,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { title: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { title: "Users", path: "/admin/users", icon: Users },
  { title: "Products", path: "/admin/products", icon: Package },
  { title: "Events", path: "/admin/events", icon: Calendar },
  { title: "Coupons", path: "/admin/coupons", icon: Ticket },
];

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300 shadow-lg",
        collapsed ? "w-20" : "w-72"
      )}
    >
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <LayoutDashboard size={24} />
            </div>
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden",
                "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white",
                !isActive && "hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-sm",
                isActive && "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:shadow-lg",
                collapsed && "justify-center"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className={cn(
                  "relative z-10 transition-transform duration-200",
                  !collapsed && "group-hover:scale-110"
                )}>
                  <item.icon size={22} />
                </div>
                {!collapsed && (
                  <span className="relative z-10 text-sm font-medium">
                    {item.title}
                  </span>
                )}
                {isActive && !collapsed && (
                  <div className="absolute right-3 w-1.5 h-8 bg-white/40 rounded-full" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className={cn(
          "px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl",
          collapsed && "px-2"
        )}>
          {!collapsed ? (
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <p className="font-semibold text-gray-800 dark:text-gray-200">Admin Mode</p>
              <p className="mt-1">Manage your platform</p>
            </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg mx-auto" />
          )}
        </div>
      </div>
    </aside>
  );
}