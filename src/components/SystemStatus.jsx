import React, { useState, useEffect } from 'react';
import { Activity, Wifi, Server, Database, Shield, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SystemStatus = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    overall: 'operational',
    services: {
      database: { status: 'operational', latency: 45, uptime: 99.9 },
      api: { status: 'operational', latency: 120, uptime: 99.8 },
      search: { status: 'operational', latency: 85, uptime: 99.9 },
      chat: { status: 'operational', latency: 200, uptime: 99.7 }
    },
    lastUpdated: new Date()
  });

  const [performanceMetrics, setPerformanceMetrics] = useState({
    cpu: 23,
    memory: 67,
    network: 45,
    disk: 12
  });

  useEffect(() => {
      // Simulate real-time performance data updates
  const interval = setInterval(() => {
    setPerformanceMetrics(prev => ({
      cpu: Math.max(10, Math.min(90, prev.cpu + (Math.random() - 0.5) * 10)),
      memory: Math.max(20, Math.min(85, prev.memory + (Math.random() - 0.5) * 5)),
      network: Math.max(15, Math.min(80, prev.network + (Math.random() - 0.5) * 8)),
      disk: Math.max(5, Math.min(25, prev.disk + (Math.random() - 0.5) * 3))
    }));
  }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'degraded':
        return <AlertCircle className="h-4 w-4 text-yellow-400" />;
      case 'down':
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational':
        return 'text-green-400';
      case 'degraded':
        return 'text-yellow-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'operational':
        return 'Operational';
      case 'degraded':
        return 'Degraded';
      case 'down':
        return 'Down';
      default:
        return 'Unknown';
    }
  };

  const getPerformanceColor = (value) => {
    if (value < 50) return 'text-green-400';
    if (value < 75) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all duration-200"
        aria-label="System status"
      >
        <Activity className="h-5 w-5" />
        {/* Status indicator dot */}
        <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
          systemStatus.overall === 'operational' ? 'bg-green-400' :
          systemStatus.overall === 'degraded' ? 'bg-yellow-400' : 'bg-red-400'
        }`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 mt-2 w-96 bg-gray-800/95 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700 overflow-hidden z-50"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4 border-b border-gray-700 bg-gray-800/80">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-white text-lg">System Status</h3>
                  <p className="text-sm text-gray-400">Real-time monitoring of system operation status</p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(systemStatus.overall)}
                  <span className={`text-sm font-medium ${getStatusColor(systemStatus.overall)}`}>
                    {getStatusText(systemStatus.overall)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Service Status */}
              <div>
                <h4 className="text-sm font-medium text-white mb-3">Service Status</h4>
                <div className="space-y-2">
                  {Object.entries(systemStatus.services).map(([service, info]) => (
                    <div key={service} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(info.status)}
                        <div>
                          <div className="text-sm font-medium text-white capitalize">{service}</div>
                          <div className="text-xs text-gray-400">Latency: {info.latency}ms</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${getStatusColor(info.status)}`}>
                          {getStatusText(info.status)}
                        </div>
                                                  <div className="text-xs text-gray-400">Uptime: {info.uptime}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Metrics */}
              <div>
                <h4 className="text-sm font-medium text-white mb-3">Performance Metrics</h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(performanceMetrics).map(([metric, value]) => (
                    <div key={metric} className="p-3 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400 capitalize">{metric}</span>
                        <span className={`text-sm font-medium ${getPerformanceColor(value)}`}>
                          {Math.round(value)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            value < 50 ? 'bg-green-400' : value < 75 ? 'bg-yellow-400' : 'bg-red-400'
                          }`}
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Information */}
              <div className="pt-3 border-t border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Last Updated</span>
                  <span className="text-white">
                    {systemStatus.lastUpdated.toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-400">System Version</span>
                  <span className="text-white">v1.0.0</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SystemStatus;
