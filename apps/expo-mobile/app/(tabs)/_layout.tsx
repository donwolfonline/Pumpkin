import { Tabs } from 'expo-router';
import { PumpkinTheme } from '@/lib/theme';
import { LayoutDashboard, Users, Receipt, Settings } from 'lucide-react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerStyle: {
                    backgroundColor: PumpkinTheme.colors.background,
                    borderBottomWidth: 1,
                    borderBottomColor: PumpkinTheme.colors.border,
                },
                headerTintColor: PumpkinTheme.colors.primary,
                headerTitleStyle: {
                    fontFamily: 'Outfit_700Bold',
                    fontSize: 18,
                    letterSpacing: 1,
                },
                tabBarStyle: {
                    backgroundColor: PumpkinTheme.colors.background,
                    borderTopWidth: 1,
                    borderTopColor: PumpkinTheme.colors.border,
                    height: 85,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: PumpkinTheme.colors.primary,
                tabBarInactiveTintColor: PumpkinTheme.colors.textSecondary,
                tabBarLabelStyle: {
                    fontFamily: 'Outfit_700Bold',
                    fontSize: 10,
                    marginBottom: 4,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'DASHBOARD',
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color }) => <LayoutDashboard size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="crm"
                options={{
                    title: 'CRM',
                    tabBarLabel: 'CRM',
                    tabBarIcon: ({ color }) => <Users size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="invoices"
                options={{
                    title: 'INVOICES',
                    tabBarLabel: 'Invoices',
                    tabBarIcon: ({ color }) => <Receipt size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'SETTINGS',
                    tabBarLabel: 'Settings',
                    tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}
