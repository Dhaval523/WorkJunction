import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Home,
  Users,
  Briefcase,
  DollarSign,
  Settings,
  Star,
  Check,
  X,
} from "lucide-react";

const data = [
  { name: "Plumbers", jobs: 40 },
  { name: "Carpenters", jobs: 25 },
  { name: "Electricians", jobs: 32 },
  { name: "Painters", jobs: 20 },
];

export default function AdminPanel() {
  const [active, setActive] = useState("Dashboard");
  const [workers, setWorkers] = useState([
    {
      name: "Rajesh Kumar",
      skill: "Plumber",
      location: "Delhi",
      status: "Pending",
    },
    {
      name: "Amit Shah",
      skill: "Carpenter",
      location: "Mumbai",
      status: "Inactive",
    },
    {
      name: "Ravi Singh",
      skill: "Electrician",
      location: "Pune",
      status: "Active",
    },
  ]);

  const updateStatus = (index, newStatus) => {
    const updated = [...workers];
    updated[index].status = newStatus;
    setWorkers(updated);
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-blue-50 to-cyan-100">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-cyan-500 to-blue-600 text-white shadow-2xl flex flex-col">
        <div className="p-6 text-2xl font-bold tracking-wide">
          Work Junction
        </div>
        <nav className="flex-1 px-4 space-y-3">
          {[
            { name: "Dashboard", icon: <Home size={20} /> },
            { name: "Workers", icon: <Briefcase size={20} /> },
            { name: "Users", icon: <Users size={20} /> },
            { name: "Bookings", icon: <Star size={20} /> },
            { name: "Payments", icon: <DollarSign size={20} /> },
            { name: "Settings", icon: <Settings size={20} /> },
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => setActive(item.name)}
              className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-300 ${
                active === item.name
                  ? "bg-white text-blue-700 shadow-md"
                  : "hover:bg-blue-400/30"
              }`}
            >
              {item.icon} {item.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Dashboard */}
        {active === "Dashboard" && (
          <>
            <h1 className="text-2xl font-semibold mb-6 text-gray-700">
              Admin Dashboard
            </h1>
            <div className="flex flex-col md:flex-row">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:w-1/2">
                {[
                  { title: "Total Workers", value: "1,240" },
                  { title: "Active Users", value: "3,480" },
                  { title: "Ongoing Jobs", value: "210" },
                  { title: "Revenue", value: "$12,400" },
                ].map((card, i) => (
                  <div
                    key={i}
                    className="p-6 bg-gradient-to-r from-white to-cyan-50 shadow-lg rounded-2xl text-center"
                  >
                    <h2 className="text-gray-500 mb-4">{card.title}</h2>
                    <p className="text-2xl font-bold text-cyan-700">
                      {card.value}
                    </p>
                  </div>
                ))}
              </div>
              {/* Chart Section */}
              <div className="md:ml-10 mt-6 md:mt-0 p-6 bg-white rounded-2xl shadow-lg md:w-1/2">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">
                  Jobs by Category
                </h2>
                <ResponsiveContainer height={300}>
                  <BarChart data={data}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="jobs" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* New Worker Requests */}
            <div className="mt-10 p-6 bg-white rounded-2xl shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                New Worker Requests
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-cyan-50 text-left">
                      <th className="p-3">Name</th>
                      <th className="p-3">Skill</th>
                      <th className="p-3">Location</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 min-w-[140px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workers
                      .filter((w) => w.status === "Pending")
                      .map((worker, i) => (
                        <tr key={i} className="border-b hover:bg-cyan-50/50">
                          <td className="p-3">{worker.name}</td>
                          <td className="p-3">{worker.skill}</td>
                          <td className="p-3">{worker.location}</td>
                          <td className="p-3">
                            <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-600">
                              {worker.status}
                            </span>
                          </td>
                          <td className="p-3 flex flex-wrap gap-2 min-w-[140px]">
                            <button
                              onClick={() => updateStatus(i, "Active")}
                              className="flex items-center gap-1 px-2 py-1 text-sm rounded-lg bg-green-100 text-green-700 hover:bg-green-200"
                            >
                              <Check size={14} /> Accept
                            </button>
                            <button
                              onClick={() => updateStatus(i, "Rejected")}
                              className="flex items-center gap-1 px-2 py-1 text-sm rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                            >
                              <X size={14} /> Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Workers */}
        {active === "Workers" && (
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Workers Management
            </h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-cyan-50 text-left">
                  <th className="p-3">Name</th>
                  <th className="p-3">Skill</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {workers.map((worker, i) => (
                  <tr key={i} className="border-b hover:bg-cyan-50/50">
                    <td className="p-3">{worker.name}</td>
                    <td className="p-3">{worker.skill}</td>
                    <td className="p-3">{worker.location}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          worker.status === "Active"
                            ? "bg-green-100 text-green-600"
                            : worker.status === "Pending"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {worker.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// import React, { useMemo, useState } from "react";
// import { motion } from "framer-motion";
// import {
//   LayoutDashboard,
//   Users,
//   Package,
//   Settings,
//   PieChart as PieChartIcon,
//   BarChart3,
//   Bell,
//   Search,
//   Sun,
//   Moon,
//   ChevronDown,
//   Plus,
//   LogOut,
//   CreditCard,
//   BadgeDollarSign,
// } from "lucide-react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";

// // --- Dummy Data ---
// const revenueData = [
//   { month: "Jan", revenue: 12000 },
//   { month: "Feb", revenue: 14500 },
//   { month: "Mar", revenue: 13800 },
//   { month: "Apr", revenue: 16200 },
//   { month: "May", revenue: 14900 },
//   { month: "Jun", revenue: 17500 },
//   { month: "Jul", revenue: 18200 },
//   { month: "Aug", revenue: 19950 },
//   { month: "Sep", revenue: 21000 },
//   { month: "Oct", revenue: 22600 },
//   { month: "Nov", revenue: 21900 },
//   { month: "Dec", revenue: 24500 },
// ];

// const signupsData = [
//   { month: "Jan", users: 320 },
//   { month: "Feb", users: 410 },
//   { month: "Mar", users: 380 },
//   { month: "Apr", users: 520 },
//   { month: "May", users: 480 },
//   { month: "Jun", users: 690 },
//   { month: "Jul", users: 720 },
//   { month: "Aug", users: 760 },
//   { month: "Sep", users: 800 },
//   { month: "Oct", users: 880 },
//   { month: "Nov", users: 860 },
//   { month: "Dec", users: 940 },
// ];

// const trafficData = [
//   { name: "Direct", value: 35 },
//   { name: "Organic", value: 28 },
//   { name: "Social", value: 18 },
//   { name: "Referral", value: 12 },
//   { name: "Email", value: 7 },
// ];

// const orders = [
//   {
//     id: "ORD-1001",
//     customer: "Aarav Shah",
//     item: "Pro Headphones",
//     status: "Shipped",
//     date: "2025-08-18",
//     amount: 129.99,
//     method: "Card",
//   },
//   {
//     id: "ORD-1002",
//     customer: "Isha Patel",
//     item: "Smartwatch X2",
//     status: "Processing",
//     date: "2025-08-19",
//     amount: 199.99,
//     method: "UPI",
//   },
//   {
//     id: "ORD-1003",
//     customer: "Rohan Kumar",
//     item: "USB-C Hub",
//     status: "Delivered",
//     date: "2025-08-20",
//     amount: 59.0,
//     method: "COD",
//   },
//   {
//     id: "ORD-1004",
//     customer: "Neha Verma",
//     item: "4K Monitor",
//     status: "Cancelled",
//     date: "2025-08-20",
//     amount: 379.99,
//     method: "Card",
//   },
//   {
//     id: "ORD-1005",
//     customer: "Arjun Mehta",
//     item: "Mechanical Keyboard",
//     status: "Delivered",
//     date: "2025-08-21",
//     amount: 89.99,
//     method: "UPI",
//   },
// ];

// // --- Helpers ---
// function classNames(...arr) {
//   return arr.filter(Boolean).join(" ");
// }

// const StatCard = ({ icon: Icon, label, value, delta, positive = true }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 12 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ duration: 0.4 }}
//     className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur p-5 shadow-sm hover:shadow-md transition-shadow"
//   >
//     <div className="flex items-center justify-between">
//       <div>
//         <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
//         <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
//       </div>
//       <div className="h-12 w-12 rounded-2xl grid place-content-center border border-gray-200 dark:border-gray-800">
//         <Icon className="h-6 w-6" />
//       </div>
//     </div>
//     <div className="mt-4 text-xs">
//       <span className={classNames(
//         "px-2 py-1 rounded-full",
//         positive ? "text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-900/30" : "text-rose-700 bg-rose-50 dark:text-rose-300 dark:bg-rose-900/30"
//       )}>
//         {positive ? "+" : ""}{delta}%
//       </span>
//       <span className="ml-2 text-gray-500 dark:text-gray-400">vs last month</span>
//     </div>
//   </motion.div>
// );

// const StatusPill = ({ status }) => {
//   const map = {
//     Delivered: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
//     Processing: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
//     Shipped: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
//     Cancelled: "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
//   };
//   return (
//     <span className={classNames("px-2.5 py-1 rounded-full text-xs font-medium", map[status])}>{status}</span>
//   );
// };

// const SidebarLink = ({ icon: Icon, label, active = false }) => (
//   <a
//     href="#"
//     className={classNames(
//       "flex items-center gap-3 px-4 py-2 rounded-xl transition-colors",
//       active
//         ? "bg-gray-900 text-white"
//         : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
//     )}
//   >
//     <Icon className="h-5 w-5" />
//     <span className="text-sm font-medium">{label}</span>
//   </a>
// );

// export default function AdminPanel() {
//   const [dark, setDark] = useState(true);
//   const [range, setRange] = useState("Last 12 months");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const filteredOrders = useMemo(() => {
//     if (statusFilter === "All") return orders;
//     return orders.filter((o) => o.status === statusFilter);
//   }, [statusFilter]);

//   return (
//     <div className={classNames("min-h-screen", dark ? "dark" : "")}>
//       <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 text-gray-900 dark:text-gray-100">
//         {/* Shell */}
//         <div className="grid grid-cols-12 gap-6 p-4 md:p-6">
//           {/* Sidebar */}
//           <aside className="col-span-12 md:col-span-3 lg:col-span-2 sticky top-4 self-start">
//             <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur p-4">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center gap-2">
//                   <div className="h-9 w-9 rounded-2xl grid place-content-center bg-gray-900 text-white">A</div>
//                   <div>
//                     <p className="text-sm font-semibold leading-none">Admin</p>
//                     <p className="text-xs text-gray-500">Dashboard</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setDark((d) => !d)}
//                   className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
//                   aria-label="Toggle theme"
//                 >
//                   {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
//                 </button>
//               </div>

//               <nav className="space-y-1">
//                 <SidebarLink icon={LayoutDashboard} label="Overview" active />
//                 <SidebarLink icon={Users} label="Users" />
//                 <SidebarLink icon={Package} label="Products" />
//                 <SidebarLink icon={BarChart3} label="Analytics" />
//                 <SidebarLink icon={PieChartIcon} label="Reports" />
//                 <SidebarLink icon={CreditCard} label="Billing" />
//                 <SidebarLink icon={Settings} label="Settings" />
//               </nav>

//               <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
//                 <button className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 bg-gray-900 text-white hover:opacity-90">
//                   <Plus className="h-4 w-4" /> New Item
//                 </button>
//                 <button className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800">
//                   <LogOut className="h-4 w-4" /> Logout
//                 </button>
//               </div>
//             </div>
//           </aside>

//           {/* Main */}
//           <main className="col-span-12 md:col-span-9 lg:col-span-10 space-y-6">
//             {/* Header */}
//             <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur p-4">
//               <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//                 <div>
//                   <h1 className="text-2xl font-bold tracking-tight">Welcome back, Admin 👋</h1>
//                   <p className="text-sm text-gray-500">Here is what’s happening with your store today.</p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                     <input
//                       placeholder="Search..."
//                       className="pl-9 pr-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-950/50 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-700"
//                     />
//                   </div>
//                   <button className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800">
//                     <Bell className="h-5 w-5" />
//                   </button>
//                   <img
//                     src="https://avatars.githubusercontent.com/u/9919?s=200&v=4"
//                     alt="avatar"
//                     className="h-9 w-9 rounded-xl border border-gray-200 dark:border-gray-800"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* KPIs */}
//             <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
//               <StatCard icon={Users} label="Total Users" value="12,340" delta={8.4} />
//               <StatCard icon={BadgeDollarSign} label="Monthly Revenue" value="$24,500" delta={5.2} />
//               <StatCard icon={Package} label="Orders" value="1,284" delta={-1.1} positive={false} />
//               <StatCard icon={BarChart3} label="Conversion" value="4.2%" delta={0.6} />
//             </section>

//             {/* Charts */}
//             <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
//               {/* Revenue Line Chart */}
//               <motion.div
//                 initial={{ opacity: 0, y: 12 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.4 }}
//                 className="xl:col-span-2 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur p-4"
//               >
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h3 className="font-semibold">Revenue</h3>
//                     <p className="text-xs text-gray-500">{range}</p>
//                   </div>
//                   <button className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-800">
//                     {range} <ChevronDown className="h-4 w-4" />
//                   </button>
//                 </div>
//                 <div className="mt-3 h-64">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <LineChart data={revenueData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
//                       <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
//                       <XAxis dataKey="month" tickLine={false} axisLine={false} />
//                       <YAxis tickLine={false} axisLine={false} />
//                       <Tooltip cursor={{ strokeDasharray: "3 3" }} />
//                       <Line type="monotone" dataKey="revenue" strokeWidth={3} dot={false} />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </div>
//               </motion.div>

//               {/* Signups Bar Chart */}
//               <motion.div
//                 initial={{ opacity: 0, y: 12 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.4, delay: 0.05 }}
//                 className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur p-4"
//               >
//                 <div className="flex items-center justify-between">
//                   <h3 className="font-semibold">New Signups</h3>
//                   <span className="text-xs text-gray-500">Monthly</span>
//                 </div>
//                 <div className="mt-3 h-64">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <BarChart data={signupsData}>
//                       <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
//                       <XAxis dataKey="month" tickLine={false} axisLine={false} />
//                       <YAxis tickLine={false} axisLine={false} />
//                       <Tooltip cursor={{ fillOpacity: 0.1 }} />
//                       <Bar dataKey="users" radius={[8, 8, 0, 0]} />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>
//               </motion.div>
//             </section>

//             {/* Table + Pie */}
//             <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
//               {/* Orders Table */}
//               <motion.div
//                 initial={{ opacity: 0, y: 12 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.4 }}
//                 className="xl:col-span-2 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur"
//               >
//                 <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
//                   <h3 className="font-semibold">Recent Orders</h3>
//                   <div className="flex items-center gap-2">
//                     <select
//                       value={statusFilter}
//                       onChange={(e) => setStatusFilter(e.target.value)}
//                       className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm"
//                     >
//                       <option>All</option>
//                       <option>Delivered</option>
//                       <option>Processing</option>
//                       <option>Shipped</option>
//                       <option>Cancelled</option>
//                     </select>
//                     <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-800 text-sm">
//                       Export
//                     </button>
//                   </div>
//                 </div>

//                 <div className="overflow-x-auto">
//                   <table className="min-w-full text-sm">
//                     <thead>
//                       <tr className="text-left border-b border-gray-200 dark:border-gray-800">
//                         <th className="p-4">Order ID</th>
//                         <th className="p-4">Customer</th>
//                         <th className="p-4">Item</th>
//                         <th className="p-4">Status</th>
//                         <th className="p-4">Date</th>
//                         <th className="p-4">Amount</th>
//                         <th className="p-4">Method</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {filteredOrders.map((o) => (
//                         <tr key={o.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/60 dark:hover:bg-gray-800/40">
//                           <td className="p-4 font-medium">{o.id}</td>
//                           <td className="p-4">{o.customer}</td>
//                           <td className="p-4">{o.item}</td>
//                           <td className="p-4"><StatusPill status={o.status} /></td>
//                           <td className="p-4">{o.date}</td>
//                           <td className="p-4">${o.amount.toFixed(2)}</td>
//                           <td className="p-4">{o.method}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </motion.div>

//               {/* Traffic Pie */}
//               <motion.div
//                 initial={{ opacity: 0, y: 12 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.4, delay: 0.05 }}
//                 className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur p-4"
//               >
//                 <div className="flex items-center justify-between">
//                   <h3 className="font-semibold">Traffic Sources</h3>
//                   <span className="text-xs text-gray-500">This month</span>
//                 </div>
//                 <div className="h-64 mt-4">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie dataKey="value" data={trafficData} innerRadius={60} outerRadius={90} paddingAngle={2}>
//                         {trafficData.map((_, idx) => (
//                           <Cell key={idx} />
//                         ))}
//                       </Pie>
//                       <Tooltip />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>
//                 <ul className="mt-4 space-y-2 text-sm">
//                   {trafficData.map((t, i) => (
//                     <li key={i} className="flex items-center justify-between">
//                       <span>{t.name}</span>
//                       <span className="text-gray-500">{t.value}%</span>
//                     </li>
//                   ))}
//                 </ul>
//               </motion.div>
//             </section>

//             {/* Activity */}
//             <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//               <motion.div
//                 initial={{ opacity: 0, y: 12 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.4 }}
//                 className="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur p-4"
//               >
//                 <h3 className="font-semibold">Quick Actions</h3>
//                 <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
//                   {[
//                     { icon: Users, label: "Add User" },
//                     { icon: Package, label: "Add Product" },
//                     { icon: BadgeDollarSign, label: "Create Invoice" },
//                     { icon: Settings, label: "System Check" },
//                   ].map(({ icon: Icon, label }, i) => (
//                     <button key={i} className="group rounded-2xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow">
//                       <Icon className="h-6 w-6" />
//                       <p className="mt-2 text-sm font-medium">{label}</p>
//                       <p className="text-xs text-gray-500">Open {label.toLowerCase()}</p>
//                     </button>
//                   ))}
//                 </div>
//               </motion.div>

//               <motion.div
//                 initial={{ opacity: 0, y: 12 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.4, delay: 0.05 }}
//                 className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur p-4"
//               >
//                 <h3 className="font-semibold">Recent Activity</h3>
//                 <ul className="mt-3 space-y-3 text-sm">
//                   {[
//                     "You shipped order ORD-1001",
//                     "New signup: Neha Verma",
//                     "Refund processed for ORD-0994",
//                     "Inventory sync completed",
//                   ].map((item, i) => (
//                     <li key={i} className="flex items-start gap-3">
//                       <span className="mt-1 h-2.5 w-2.5 rounded-full bg-gray-400" />
//                       <span className="text-gray-700 dark:text-gray-300">{item}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </motion.div>
//             </section>

//             <footer className="py-6 text-center text-xs text-gray-500">
//               © 2025 Admin Panel UI · Built with React + Tailwind
//             </footer>
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// }
