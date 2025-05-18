import React from 'react';

interface ToggleProps {
  isEnabled: boolean;
  onChange: () => void;
  label?: string;
  disabled?: boolean;
}

const Toggle: React.FC<ToggleProps> = ({
  isEnabled,
  onChange,
  label,
  disabled = false,
}) => {
  return (
    <div className="flex items-center">
      <button
        type="button"
        className={`
          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full 
          border-2 border-transparent transition-colors duration-200 ease-in-out 
          focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2
          ${isEnabled ? 'bg-primary-600' : 'bg-gray-200'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        role="switch"
        aria-checked={isEnabled}
        onClick={disabled ? undefined : onChange}
        disabled={disabled}
      >
        <span
          className={`
            pointer-events-none inline-block h-5 w-5 transform rounded-full 
            bg-white shadow ring-0 transition duration-200 ease-in-out
            ${isEnabled ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </button>
      {label && (
        <span className="ml-3 text-sm font-medium text-gray-900">{label}</span>
      )}
    </div>
  );
};

export default Toggle;