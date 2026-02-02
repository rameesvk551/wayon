type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
    src?: string;
    alt?: string;
    name?: string;
    size?: AvatarSize;
    className?: string;
}

const sizeStyles: Record<AvatarSize, { container: string; text: string }> = {
    sm: { container: 'w-8 h-8', text: 'text-xs' },
    md: { container: 'w-10 h-10', text: 'text-sm' },
    lg: { container: 'w-12 h-12', text: 'text-base' },
    xl: { container: 'w-16 h-16', text: 'text-lg' }
};

const getInitials = (name: string): string => {
    return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

const getColorFromName = (name: string): string => {
    const colors = [
        'bg-teal-500',
        'bg-sky-500',
        'bg-violet-500',
        'bg-rose-500',
        'bg-amber-500',
        'bg-emerald-500'
    ];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
};

export const Avatar: React.FC<AvatarProps> = ({
    src,
    alt = 'Avatar',
    name = 'User',
    size = 'md',
    className = ''
}) => {
    const styles = sizeStyles[size];

    if (src) {
        return (
            <img
                src={src}
                alt={alt}
                className={`
          ${styles.container}
          rounded-full
          object-cover
          ring-2 ring-white
          shadow-sm
          ${className}
        `}
            />
        );
    }

    return (
        <div
            className={`
        ${styles.container}
        rounded-full
        flex items-center justify-center
        ${getColorFromName(name)}
        text-white
        font-medium
        ${styles.text}
        ring-2 ring-white
        shadow-sm
        ${className}
      `}
        >
            {getInitials(name)}
        </div>
    );
};
