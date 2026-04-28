import React from 'react';
import '@/features/owner/components/KPICard.css';

const KPICard = ({ Icon, label, value, subText, trend, trendUp }) => {
  return (
    <div className="kpi-card" role="region" aria-label={`${label} metric`}>
      <div className="kpi-card-header">
        <div className="kpi-icon-container" aria-hidden="true">
          {Icon && <Icon size={20} strokeWidth={2} />}
        </div>
        {trend && (
          <div 
            className={`kpi-trend ${trendUp ? 'trend-up' : 'trend-down'}`}
            aria-label={`Trend: ${trendUp ? 'increased' : 'decreased'} by ${trend}`}
          >
            <span className="trend-arrow">{trendUp ? '▲' : '▼'}</span>
            <span className="trend-value">{trend}</span>
          </div>
        )}
      </div>
      <div className="kpi-card-body">
        <p className="kpi-value">{value}</p>
        <p className="kpi-label">{label}</p>
      </div>
      {subText && (
        <div className="kpi-card-footer">
          <p className="kpi-subtext">{subText}</p>
        </div>
      )}
    </div>
  );
};

export default KPICard;
