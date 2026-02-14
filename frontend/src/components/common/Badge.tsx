import React from 'react';
import clsx from 'clsx';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'success' | 'error' | 'warning' | 'info' | 'default';
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'default',
    className,
}) => {
    const variantStyles = {
        success: 'badge-success',
        error: 'badge-error',
        warning: 'badge-warning',
        info: 'badge-info',
        default: 'bg-gray-100 text-gray-700',
    };

    return (
        <span className={clsx('badge', variantStyles[variant], className)}>
            {children}
        </span>
    );
};

interface ProgressBarProps {
    value: number;
    max?: number;
    className?: string;
    showLabel?: boolean;
    color?: 'primary' | 'success' | 'warning' | 'error';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    value,
    max = 100,
    className,
    showLabel = false,
    color = 'primary',
}) => {
    const percentage = Math.min((value / max) * 100, 100);

    const colorStyles = {
        primary: 'bg-primary',
        success: 'bg-success',
        warning: 'bg-warning',
        error: 'bg-error',
    };

    return (
        <div className={clsx('w-full', className)}>
            {showLabel && (
                <div className="flex justify-between text-sm mb-1">
                    <span>{value}</span>
                    <span>{max}</span>
                </div>
            )}
            <div className="progress-bar">
                <div
                    className={clsx('progress-fill', colorStyles[color])}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};
