import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'core/theme.dart';
import 'providers/auth_provider.dart';
import 'providers/crm_provider.dart';
import 'providers/invoices_provider.dart';
import 'screens/login_screen.dart';
import 'screens/main_screen.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => CrmProvider()),
        ChangeNotifierProvider(create: (_) => InvoicesProvider()),
      ],
      child: const PumpkinApp(),
    ),
  );
}

class PumpkinApp extends StatelessWidget {
  const PumpkinApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Pumpkin 🎃',
      debugShowCheckedModeBanner: false,
      theme: PumpkinTheme.darkTheme,
      home: Consumer<AuthProvider>(
        builder: (context, auth, _) {
          return auth.isAuthenticated ? const MainScreen() : const LoginScreen();
        },
      ),
    );
  }
}
