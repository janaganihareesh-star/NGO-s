import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ImpactCharts = () => {
  const barData = {
    labels: ['Women', 'Girls', 'Children', 'LGBTQ+', 'Elders', 'Environment'],
    datasets: [
      {
        label: 'Impact Reach %',
        data: [85, 92, 78, 65, 70, 88],
        backgroundColor: '#C9933A',
        borderRadius: 8,
        barThickness: 20,
      },
    ],
  };

  const donutData = {
    labels: ['Programs', 'Outreach', 'Admin', 'Emergency'],
    datasets: [
      {
        data: [60, 20, 12, 8],
        backgroundColor: ['#C9933A', '#8B2252', '#0F7A6E', '#1A1A24'],
        borderWidth: 0,
        hoverOffset: 15,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1A1A24',
        titleFont: { family: 'Playfair Display', size: 14 },
        bodyFont: { family: 'DM Sans', size: 12 },
        padding: 12,
        cornerRadius: 10,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: 'rgba(245, 240, 232, 0.5)', font: { size: 10 } },
      },
      y: {
        grid: { color: 'rgba(245, 240, 232, 0.05)' },
        ticks: { color: 'rgba(245, 240, 232, 0.5)', font: { size: 10 } },
      },
    },
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#F5F0E8',
          font: { family: 'DM Sans', size: 11 },
          padding: 20,
          usePointStyle: true,
        },
      },
    },
  };

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-black mb-4">DETAILED IMPACT ANALYSIS</h2>
          <div className="h-1 w-24 bg-primary-gold mx-auto" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass p-8 rounded-[2rem] border-primary-gold/10"
          >
            <h3 className="text-xl font-heading mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-primary-gold rounded-full" />
              Cause-wise Reach (%)
            </h3>
            <div className="h-[300px] chart-container">
              <Bar data={barData} options={chartOptions} />
            </div>
          </motion.div>

          {/* Donut Chart */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass p-8 rounded-[2rem] border-primary-gold/10"
          >
            <h3 className="text-xl font-heading mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-primary-rose rounded-full" />
              Budget Allocation
            </h3>
            <div className="h-[300px] relative">
              <Doughnut data={donutData} options={donutOptions} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none pb-12">
                <div className="text-3xl font-heading font-black text-primary-gold">FY25</div>
                <div className="text-[10px] uppercase tracking-widest text-primary-offwhite/40 font-bold">Financial Year</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Progress Rings */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          {[
            { label: 'Yearly Growth', val: 88, color: '#C9933A' },
            { label: 'Resource Efficiency', val: 94, color: '#8B2252' },
            { label: 'Community Trust', val: 98, color: '#0F7A6E' },
            { label: 'Social Return', val: 82, color: '#F5F0E8' },
          ].map((ring, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center glass p-6 rounded-3xl"
            >
              <div className="relative w-24 h-24 mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    className="text-white/5"
                  />
                  <motion.circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke={ring.color}
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={251.2}
                    initial={{ strokeDashoffset: 251.2 }}
                    whileInView={{ strokeDashoffset: 251.2 - (251.2 * ring.val) / 100 }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    viewport={{ once: true }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-heading font-bold text-lg">
                  {ring.val}%
                </div>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-primary-offwhite/50 text-center font-bold">
                {ring.label}
              </span>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Link 
            to="/impact"
            className="px-10 py-4 border border-primary-gold/20 text-primary-gold font-bold rounded-full hover:bg-primary-gold/5 transition-all shimmer inline-block"
          >
            READ FULL IMPACT REPORT
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ImpactCharts;
