import { Redirect } from 'expo-router';
import { useAuthStore } from '../store';

export default function Index() {
    const { isAuthenticated } = useAuthStore();

    if (isAuthenticated) {
        return <Redirect href="/(tabs)/home" />;
    }

    return <Redirect href="/onboarding" />;
}
