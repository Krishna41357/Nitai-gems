import { Package, Users, Calendar, Ticket } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome back! Here's your overview</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Products */}
        <div className="relative group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
          
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/20 group-hover:scale-110 transition-transform duration-300">
                <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Total Products
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                --
              </p>
            </div>
          </div>
        </div>

        {/* Total Users */}
        <div className="relative group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
          
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/20 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Total Users
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                --
              </p>
            </div>
          </div>
        </div>

        {/* Events */}
        <div className="relative group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
          
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Events
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                --
              </p>
            </div>
          </div>
        </div>

        {/* Active Coupons */}
        <div className="relative group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
          
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/20 group-hover:scale-110 transition-transform duration-300">
                <Ticket className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Active Coupons
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                --
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}