"use client";

import { ChevronDown, TrendingDown } from 'lucide-react';

interface Props { conversion: number[] }

export function ConversionFunnelChart({ conversion }: Props) {
  // conversion is array of percentages between stages
  const stages = [
    { name: 'Lead', icon: '👤' },
    { name: 'Qualified', icon: '✓' },
    { name: 'Proposal', icon: '📄' },
    { name: 'Negotiation', icon: '🤝' },
    { name: 'Closed Won', icon: '🎉' }
  ];

  const data = conversion.map((v, i) => ({
    ...stages[i] || { name: `Stage ${i + 1}`, icon: '•' },
    percentage: v,
    value: Math.round(v)
  }));

  // Modern gradient colors - purple to pink
  const colors = [
    'from-violet-500 to-violet-600',
    'from-purple-500 to-purple-600',
    'from-fuchsia-500 to-fuchsia-600',
    'from-pink-500 to-pink-600',
    'from-rose-500 to-rose-600'
  ];

  const getWidth = (percentage: number) => {
    // Minimum 20% width for visibility, max 100%
    return Math.max(20, Math.min(100, percentage));
  };

  return (
    <div className="space-y-3 py-4">
      {data.map((stage, index) => {
        const width = getWidth(stage.percentage);
        const dropoff = index > 0 ? data[index - 1].percentage - stage.percentage : 0;
        
        return (
          <div key={index} className="relative">
            {/* Conversion Rate Indicator */}
            {index > 0 && dropoff > 0 && (
              <div className="flex items-center justify-end mb-1 mr-2">
                <div className="flex items-center gap-1 text-xs text-red-500">
                  <TrendingDown className="h-3 w-3" />
                  <span className="font-medium">-{dropoff.toFixed(1)}%</span>
                </div>
              </div>
            )}
            
            {/* Funnel Stage */}
            <div className="flex items-center gap-3">
              {/* Stage Bar */}
              <div 
                className={`relative h-16 rounded-lg bg-gradient-to-r ${colors[index % colors.length]} shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-between px-6 group`}
                style={{ width: `${width}%` }}
              >
                {/* Icon & Name */}
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{stage.icon}</span>
                  <div className="text-white">
                    <p className="font-semibold text-sm">{stage.name}</p>
                    <p className="text-xs opacity-90">{stage.value} leads</p>
                  </div>
                </div>

                {/* Percentage Badge */}
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-white font-bold text-sm">{stage.percentage.toFixed(1)}%</span>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-lg transition-all duration-300" />
              </div>

              {/* Percentage on the right for narrow bars */}
              {width < 60 && (
                <span className="text-sm font-semibold text-gray-700">
                  {stage.percentage.toFixed(1)}%
                </span>
              )}
            </div>

            {/* Connecting Arrow */}
            {index < data.length - 1 && (
              <div className="flex justify-center my-1">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            )}
          </div>
        );
      })}

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {data.length > 0 ? data[0].percentage.toFixed(1) : 0}%
            </p>
            <p className="text-xs text-gray-600">Start Rate</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {data.length > 0 ? data[data.length - 1].percentage.toFixed(1) : 0}%
            </p>
            <p className="text-xs text-gray-600">Conversion Rate</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {data.length > 0 ? (data[0].percentage - data[data.length - 1].percentage).toFixed(1) : 0}%
            </p>
            <p className="text-xs text-gray-600">Drop-off</p>
          </div>
        </div>
      </div>
    </div>
  );
}
