
import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';

interface StatusIndicatorProps {
  daysLeft: number;
  type: 'expiry' | 'deadline';
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ daysLeft, type }) => {
  const getIndicator = () => {
    if (daysLeft < 0) {
      return (
        <div title={type === 'expiry' ? 'Vencida' : 'Prazo vencido'}>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </div>
      );
    }
    
    if (type === 'expiry') {
      if (daysLeft <= 3) {
        return (
          <div title={`${daysLeft} dias restantes`}>
            <Clock className="h-4 w-4 text-orange-500" />
          </div>
        );
      } else if (daysLeft <= 7) {
        return (
          <div title={`${daysLeft} dias restantes`}>
            <Clock className="h-4 w-4 text-yellow-500" />
          </div>
        );
      }
    } else {
      if (daysLeft <= 7) {
        return (
          <div title={`${daysLeft} dias restantes`}>
            <Clock className="h-4 w-4 text-red-500" />
          </div>
        );
      } else if (daysLeft <= 30) {
        return (
          <div title={`${daysLeft} dias restantes`}>
            <Clock className="h-4 w-4 text-orange-500" />
          </div>
        );
      }
    }
    
    return null;
  };

  return <>{getIndicator()}</>;
};
