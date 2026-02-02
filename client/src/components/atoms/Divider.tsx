interface DividerProps {
    orientation?: 'horizontal' | 'vertical';
    className?: string;
}

export const Divider: React.FC<DividerProps> = ({
    orientation = 'horizontal',
    className = ''
}) => {
    if (orientation === 'vertical') {
        return (
            <div
                className={`
          w-px h-full
          bg-[var(--color-border)]
          ${className}
        `}
            />
        );
    }

    return (
        <div
            className={`
        w-full h-px
        bg-[var(--color-border)]
        ${className}
      `}
        />
    );
};
