import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../core/theme.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'DASHBOARD',
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w900,
            letterSpacing: 4,
            color: PumpkinTheme.primary,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, size: 20),
            onPressed: () => context.read<AuthProvider>().logout(),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Good Morning,',
              style: GoogleFonts.outfit(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: PumpkinTheme.textSecondary,
                letterSpacing: 1,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'Pumpkin Master',
              style: Theme.of(context).textTheme.displayMedium,
            ),
            const SizedBox(height: 32),
            
            // Stats Row
            Row(
              children: [
                Expanded(
                  child: _buildStatCard(
                    context,
                    title: 'TOTAL REVENUE',
                    value: '\$14,250',
                    trend: '+12.5%',
                    icon: Icons.account_balance_wallet,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: _buildStatCard(
                    context,
                    title: 'PROJECTS',
                    value: '12',
                    trend: 'Active',
                    icon: Icons.assignment,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 32),
            
            // Efficiency Score Card
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: PumpkinTheme.surface,
                borderRadius: BorderRadius.circular(32),
                border: Border.all(color: Colors.white.withOpacity(0.05)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      const Text(
                        'HARVEST EFFICIENCY',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 2,
                          color: PumpkinTheme.primary,
                        ),
                      ),
                      Icon(Icons.bolt, color: PumpkinTheme.primary, size: 16),
                    ],
                  ),
                  const SizedBox(height: 24),
                  Row(
                    children: [
                      Text(
                        '94%',
                        style: GoogleFonts.outfit(
                          fontSize: 48,
                          fontWeight: FontWeight.w900,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(width: 16),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Optimizing your time',
                              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                            ),
                            Text(
                              'You are 5% more efficient than last month.',
                              style: TextStyle(color: PumpkinTheme.textSecondary, fontSize: 11),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 48),
            const Text(
              'RECENT ACTIVITY',
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w900,
                letterSpacing: 4,
                color: PumpkinTheme.textSecondary,
              ),
            ),
            const SizedBox(height: 24),
            _buildActivityItem(
              'Invoice Paid',
              'Design System for Solaris Corp',
              '\$2,500.00',
              '2h ago',
              Icons.check_circle,
              Colors.emerald,
            ),
            _buildActivityItem(
              'New Proposal',
              'Mobile App Revamp',
              'Pending Sign',
              '5h ago',
              Icons.description,
              PumpkinTheme.primary,
            ),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        backgroundColor: PumpkinTheme.background,
        selectedItemColor: PumpkinTheme.primary,
        unselectedItemColor: PumpkinTheme.textSecondary,
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.dashboard_rounded), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.people_rounded), label: 'CRM'),
          BottomNavigationBarItem(icon: Icon(Icons.receipt_long_rounded), label: 'Invoices'),
          BottomNavigationBarItem(icon: Icon(Icons.settings_rounded), label: 'Settings'),
        ],
      ),
    );
  }

  Widget _buildStatCard(BuildContext context, {
    required String title,
    required String value,
    required String trend,
    required IconData icon,
  }) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: PumpkinTheme.surface,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: PumpkinTheme.primary, size: 20),
          const SizedBox(height: 16),
          Text(
            title,
            style: const TextStyle(
              fontSize: 8,
              fontWeight: FontWeight.w900,
              letterSpacing: 1.5,
              color: PumpkinTheme.textSecondary,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: GoogleFonts.outfit(
              fontSize: 24,
              fontWeight: FontWeight.w900,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            trend,
            style: TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.bold,
              color: trend.startsWith('+') ? Colors.emerald : PumpkinTheme.primary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActivityItem(String title, String subtitle, String amount, String time, IconData icon, Color iconColor) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.03),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: iconColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: iconColor, size: 20),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                Text(subtitle, style: const TextStyle(color: PumpkinTheme.textSecondary, fontSize: 11)),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(amount, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
              Text(time, style: const TextStyle(color: PumpkinTheme.textSecondary, fontSize: 10)),
            ],
          ),
        ],
      ),
    );
  }
}
