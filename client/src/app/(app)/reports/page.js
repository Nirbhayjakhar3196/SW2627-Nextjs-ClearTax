"use client";

import { useState, useEffect } from "react";
import { Download, Filter, BarChart3, PieChart as PieChartIcon, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from "@/lib/axios";
import { toast } from "sonner";

const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("Last 6 Months");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/reports/statistics?dateRange=${encodeURIComponent(dateRange)}`);
        if (response.data.success) {
          setStats(response.data.data.stats);
          setBarData(response.data.data.barData);
          setPieData(response.data.data.pieData);
        } else {
          throw new Error(response.data.message || "Failed to fetch reports statistics");
        }
      } catch (err) {
        console.error("Error fetching reports data:", err);
        setError(err.response?.data?.message || err.message || "Failed to load reports statistics");
        toast.error("Failed to load reports data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [dateRange]);

  const handleExport = () => {
    if (!barData || barData.length === 0) {
      toast.error("No data available to export");
      return;
    }
    try {
      const headers = ["Period", "Successfully Processed", "Errors/Failed"];
      const rows = barData.map(row => [row.name, row.processed, row.errors]);
      
      const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `ClearTax_Report_${dateRange.replace(/\s+/g, "_")}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Report exported successfully!");
    } catch (err) {
      console.error("Export error:", err);
      toast.error("Failed to export report");
    }
  };

  const statsList = stats ? [
    { label: "Total Processed", value: stats.totalProcessed.value, change: stats.totalProcessed.change, positive: stats.totalProcessed.positive },
    { label: "Match Rate", value: stats.matchRate.value, change: stats.matchRate.change, positive: stats.matchRate.positive },
    { label: "Avg Processing Time", value: stats.avgProcessingTime.value, change: stats.avgProcessingTime.change, positive: stats.avgProcessingTime.positive },
    { label: "Critical Errors", value: stats.criticalErrors.value, change: stats.criticalErrors.change, positive: stats.criticalErrors.positive }
  ] : [
    { label: "Total Processed", value: "0", change: "0%", positive: true },
    { label: "Match Rate", value: "0%", change: "0%", positive: true },
    { label: "Avg Processing Time", value: "0s", change: "0s", positive: true },
    { label: "Critical Errors", value: "0", change: "0", positive: false }
  ];

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500 mt-1 text-sm">Gain insights into your invoice processing performance.</p>
        </div>
        <div className="flex space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium"
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 6 Months</option>
              <option>Year to Date</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <Filter size={14} />
            </div>
          </div>
          <button 
            onClick={handleExport}
            disabled={loading}
            className="inline-flex items-center bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <Download size={16} className="mr-2" /> Export
          </button>
        </div>
      </motion.div>

      {error && (
        <motion.div 
          variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} 
          className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start text-red-700"
        >
          <AlertCircle className="mr-3 mt-0.5 flex-shrink-0" size={18} />
          <div>
            <h3 className="font-semibold text-sm">Error Loading Reports</h3>
            <p className="text-xs text-red-600 mt-0.5">{error}</p>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <Loader2 className="animate-spin text-indigo-500 h-10 w-10 mb-2" />
          <p className="text-gray-500 text-sm font-medium">Fetching real-time analytics...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="bg-white border border-gray-200 rounded-2xl p-6 lg:col-span-2 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-semibold text-gray-900 flex items-center">
                  <BarChart3 className="mr-2 text-indigo-500" size={18} /> Processing Volume
                </h2>
              </div>
              <div className="h-[300px] w-full">
                {barData.length === 0 || barData.every(b => b.processed === 0 && b.errors === 0) ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm">
                    No processing records found for this period.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={barData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                        itemStyle={{ color: '#374151', fontSize: '13px' }}
                        labelStyle={{ color: '#111827', fontWeight: 'bold', marginBottom: '4px' }}
                      />
                      <Bar dataKey="processed" name="Successfully Processed" fill="#6366F1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="errors" name="Errors/Failed" fill="#F87171" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-base font-semibold text-gray-900 flex items-center">
                    <PieChartIcon className="mr-2 text-indigo-500" size={18} /> Outcome Distribution
                  </h2>
                </div>
                <div className="h-[250px] w-full flex items-center justify-center">
                  {pieData.every(p => p.value === 0) ? (
                    <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                      No distribution data.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                          itemStyle={{ color: '#374151', fontSize: '13px', fontWeight: '500' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                {pieData.map((entry, index) => (
                  <div key={entry.name} className="flex flex-col items-center">
                    <div className="flex items-center text-xs text-gray-500 font-medium mb-1">
                      <div className="w-2.5 h-2.5 rounded-full mr-1.5" style={{ backgroundColor: COLORS[index] }}></div>
                      {entry.name}
                    </div>
                    <span className="text-sm font-bold text-gray-900">{entry.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
          
          <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsList.map((stat, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{stat.label}</span>
                <div className="flex items-end justify-between mt-1">
                  <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${stat.positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
