"use client";

import { useState } from "react";
import { Download, Filter, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// MOCK DATA STANDIN
const mockBarData = [
  { name: 'Jan', processed: 400, errors: 24 },
  { name: 'Feb', processed: 300, errors: 13 },
  { name: 'Mar', processed: 200, errors: 48 },
  { name: 'Apr', processed: 278, errors: 39 },
  { name: 'May', processed: 189, errors: 48 },
  { name: 'Jun', processed: 239, errors: 38 },
];

const mockPieData = [
  { name: 'Matches', value: 400 },
  { name: 'Mismatches', value: 300 },
  { name: 'Failed', value: 300 },
];
const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("Last 6 Months");

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
          <button className="inline-flex items-center bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm">
            <Download size={16} className="mr-2" /> Export
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="bg-white border border-gray-200 rounded-2xl p-6 lg:col-span-2 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-gray-900 flex items-center">
              <BarChart3 className="mr-2 text-indigo-500" size={18} /> Processing Volume
            </h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockBarData}
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
          </div>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-semibold text-gray-900 flex items-center">
              <PieChartIcon className="mr-2 text-indigo-500" size={18} /> Outcome Distribution
            </h2>
          </div>
          <div className="h-[250px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {mockPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#374151', fontSize: '13px', fontWeight: '500' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {mockPieData.map((entry, index) => (
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
        {[
          { label: "Total Processed", value: "1,604", change: "+12.5%", positive: true },
          { label: "Match Rate", value: "85.2%", change: "+2.1%", positive: true },
          { label: "Avg Processing Time", value: "1.2s", change: "-0.3s", positive: true },
          { label: "Critical Errors", value: "24", change: "+4", positive: false }
        ].map((stat, i) => (
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
    </motion.div>
  );
}
