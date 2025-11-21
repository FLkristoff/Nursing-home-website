import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  const baseClasses = 'p-4 rounded-lg shadow-lg flex items-start gap-3 pointer-events-auto max-w-sm';

  const typeClasses = {
    success: 'bg-green-50 border border-green-200',
    error: 'bg-red-50 border border-red-200',
    warning: 'bg-yellow-50 border border-yellow-200',
    info: 'bg-blue-50 border border-blue-200',
  };

  const textClasses = {
    success: 'text-green-700',
    error: 'text-red-700',
    warning: 'text-yellow-700',
    info: 'text-blue-700',
  };

  const iconClasses = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
  };

  const iconMap = {
    success: <CheckCircle className={`w-5 h-5 ${iconClasses.success} flex-shrink-0 mt-0.5`} />,
    error: <AlertCircle className={`w-5 h-5 ${iconClasses.error} flex-shrink-0 mt-0.5`} />,
    warning: <AlertTriangle className={`w-5 h-5 ${iconClasses.warning} flex-shrink-0 mt-0.5`} />,
    info: <Info className={`w-5 h-5 ${iconClasses.info} flex-shrink-0 mt-0.5`} />,
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]} animate-in fade-in slide-in-from-right`}>
      {iconMap[type]}
      <div className="flex-1">
        <p className={`text-sm font-medium ${textClasses[type]}`}>{message}</p>
      </div>
      <button
        onClick={onClose}
        className={`flex-shrink-0 mt-0.5 hover:opacity-75 transition`}
        aria-label="Close"
      >
        <X className={`w-5 h-5 ${iconClasses[type]}`} />
      </button>
    </div>
  );
}
