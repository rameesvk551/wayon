// Travel-inspired design system aligned to the web UI

export const colors = {
    primary: {
        DEFAULT: "#0B7C7A",
        hover: "#086462",
        light: "#CFF4F2",
        subtle: "#EFFBFA",
    },
    secondary: {
        DEFAULT: "#118AB2",
        hover: "#0C6E8F",
        light: "#D9F0FA",
        subtle: "#F0FAFE",
    },
    accent: {
        DEFAULT: "#FF7A59",
        hover: "#F25F3A",
        light: "#FFF1EB",
    },
    success: {
        DEFAULT: "#10B981",
        light: "#D1FAE5",
    },
    warning: {
        DEFAULT: "#F59E0B",
        light: "#FEF3C7",
    },
    error: {
        DEFAULT: "#EF4444",
        light: "#FEE2E2",
    },
    background: {
        DEFAULT: "#F6F7FB",
        secondary: "#FFFFFF",
        tertiary: "#EEF2F6",
        elevated: "#FFFFFF",
        chat: "#F8FAFC",
        immersive: "#0F172A",
    },
    text: {
        primary: "#0F172A",
        secondary: "#334155",
        muted: "#64748B",
        light: "#94A3B8",
        inverse: "#FFFFFF",
    },
    border: {
        DEFAULT: "#E1E8F0",
        light: "#F0F4F8",
        focus: "#0B7C7A",
    },
    white: "#FFFFFF",
    black: "#000000",
};

export const gradients = {
    primary: ["#0B7C7A", "#118AB2"],
    primaryStrong: ["#0B7C7A", "#0D8B8A", "#118AB2"],
    accent: ["#FF7A59", "#F25F3A"],
    home: ["#F97316", "#EA580C"],
};

export const fonts = {
    display: "Fraunces_700Bold",
    displayBold: "Fraunces_800ExtraBold",
    body: "Sora_400Regular",
    bodyMedium: "Sora_500Medium",
    bodySemibold: "Sora_600SemiBold",
    bodyBold: "Sora_700Bold",
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 48,
    "2xl": 24,
    "3xl": 32,
    "4xl": 40,
    "5xl": 48,
    "6xl": 64,
    "7xl": 80,
};

export const borderRadius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    "2xl": 24,
    "3xl": 32,
    full: 9999,
};

export const fontSize = {
    xs: 12,
    sm: 13,
    base: 15,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
    display: 48,
};

export const shadows = {
    xs: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 2,
        elevation: 1,
    },
    sm: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    md: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 4,
    },
    lg: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 8,
    },
    xl: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.16,
        shadowRadius: 32,
        elevation: 12,
    },
};
