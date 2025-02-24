import { useState } from "react";
import { FiMic, FiUsers, FiEye, FiHeart, FiClock, FiTrendingUp, FiDollarSign } from "react-icons/fi";
import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell, Tooltip, Legend, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  LineChart, Line, ResponsiveContainer 
} from "recharts";

const Dashboard = () => {
  // Dummy Data for Charts
  const [monthlyPodcasts] = useState([
    { month: "Jan", value: 120 },
    { month: "Feb", value: 180 },
    { month: "Mar", value: 220 },
    { month: "Apr", value: 150 },
    { month: "May", value: 240 },
    { month: "Jun", value: 320 },
  ]);

  const [voiceUsage] = useState([
    { name: "Male AI", value: 40 },
    { name: "Female AI", value: 60 },
  ]);

  const [viewsGrowth] = useState([
    { month: "Jan", views: 20000 },
    { month: "Feb", views: 35000 },
    { month: "Mar", views: 50000 },
    { month: "Apr", views: 70000 },
    { month: "May", views: 100000 },
    { month: "Jun", views: 125000 },
  ]);

  const [categoryDistribution] = useState([
    { name: "Business", value: 30 },
    { name: "Tech", value: 25 },
    { name: "Health", value: 20 },
    { name: "Entertainment", value: 15 },
    { name: "Others", value: 10 },
  ]);

  const [engagementTrends] = useState([
    { month: "Jan", likes: 5000, views: 20000 },
    { month: "Feb", likes: 7000, views: 35000 },
    { month: "Mar", likes: 10000, views: 50000 },
    { month: "Apr", likes: 13000, views: 70000 },
    { month: "May", likes: 17000, views: 100000 },
    { month: "Jun", likes: 20000, views: 125000 },
  ]);

  return (
    <div className="container mx-auto p-6">
      {/* Dashboard Header */}
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview 🎙</h2>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard icon={FiMic} title="Total Podcasts Created" value="1,250" trend="Growing" color="bg-blue-100 text-blue-600" />
        <MetricCard icon={FiUsers} title="Total Users" value="15,320" trend="Active" color="bg-green-100 text-green-600" />
        <MetricCard icon={FiEye} title="Total Views" value="1.2M" trend="High Engagement" color="bg-purple-100 text-purple-600" />
        <MetricCard icon={FiHeart} title="Total Likes" value="350K" trend="Popular" color="bg-red-100 text-red-600" />
        <MetricCard icon={FiClock} title="Avg Podcast Duration" value="18 mins" trend="Standard" color="bg-yellow-100 text-yellow-600" />
        <MetricCard icon={FiTrendingUp} title="Top Podcast" value="The AI Revolution 🎧" trend="Trending" color="bg-indigo-100 text-indigo-600" />
        <MetricCard icon={FiUsers} title="Most Used Voice Type" value="Female AI (60%)" trend="Popular Choice" color="bg-pink-100 text-pink-600" />
        <MetricCard icon={FiDollarSign} title="Total Revenue" value="$14,750" trend="Growing" color="bg-gray-100 text-gray-600" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        
        {/* Bar Chart - Monthly Podcasts Created */}
        <ChartContainer title="Monthly Podcast Creations">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyPodcasts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Pie Chart - AI Voice Usage */}
        <ChartContainer title="AI Voice Usage">
          <PieChart width={400} height={300}>
            <Pie data={voiceUsage} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
              <Cell fill="#3B82F6" />
              <Cell fill="#F59E0B" />
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ChartContainer>

        {/* Line Chart - Views Growth */}
        <ChartContainer title="Total Views Growth">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={viewsGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="views" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Pie Chart - Podcast Category Distribution */}
        <ChartContainer title="Podcast Category Distribution">
          <PieChart width={400} height={300}>
            <Pie data={categoryDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
              {categoryDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={["#3B82F6", "#F59E0B", "#10B981", "#EF4444", "#6366F1"][index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ChartContainer>

        {/* Bar Chart - Engagement Trends */}
        <ChartContainer title="Likes & Views Over Time">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={engagementTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="likes" fill="#EF4444" name="Likes" />
              <Bar dataKey="views" fill="#3B82F6" name="Views" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ icon: Icon, title, value, trend, color }) => (
  <motion.div whileHover={{ scale: 1.02 }} className="bg-white p-6 rounded-xl shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold mt-2">{value}</p>
        <span className={`text-sm px-2 py-1 rounded-full ${color}`}>{trend}</span>
      </div>
      <Icon className="w-12 h-12 text-gray-400" />
    </div>
  </motion.div>
);

// Chart Container
const ChartContainer = ({ title, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

export default Dashboard;
