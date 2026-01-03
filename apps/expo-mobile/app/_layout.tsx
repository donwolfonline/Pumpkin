import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
    return (
        <>
            <StatusBar style="light" />
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#051c1c',
                    },
                    headerTintColor: '#f97316',
                    contentStyle: {
                        backgroundColor: '#051c1c',
                    }
                }}
            >
                <Stack.Screen name="index" options={{ headerShown: false }} />
            </Stack>
        </>
    );
}
