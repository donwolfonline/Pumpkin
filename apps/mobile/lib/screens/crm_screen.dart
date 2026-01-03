import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/crm_provider.dart';
import '../core/theme.dart';

class CrmScreen extends StatefulWidget {
  const CrmScreen({super.key});

  @override
  State<CrmScreen> createState() => _CrmScreenState();
}

class _CrmScreenState extends State<CrmScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<CrmProvider>().fetchContacts();
    });
  }

  @override
  Widget build(BuildContext context) {
    final crm = context.watch<CrmProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'CRM',
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w900,
            letterSpacing: 4,
            color: PumpkinTheme.primary,
          ),
        ),
      ),
      body: crm.isLoading
          ? const Center(child: CircularProgressIndicator(color: PumpkinTheme.primary))
          : crm.contacts.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.people_outline, size: 64, color: PumpkinTheme.surface),
                      const SizedBox(height: 16),
                      Text(
                        'No contacts found',
                        style: const TextStyle(
                          color: PumpkinTheme.textSecondary,
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                    ],
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: crm.contacts.length,
                  itemBuilder: (context, index) {
                    final contact = crm.contacts[index];
                    return Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: PumpkinTheme.surface,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Colors.white.withOpacity(0.05)),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 48,
                            height: 48,
                            decoration: BoxDecoration(
                              color: PumpkinTheme.primary.withOpacity(0.1),
                              shape: BoxShape.circle,
                            ),
                            child: Center(
                              child: Text(
                                (contact['firstName']?[0] ?? '').toUpperCase(),
                                style: const TextStyle(
                                  color: PumpkinTheme.primary,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 18,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  '${contact['firstName']} ${contact['lastName']}',
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16,
                                    color: Colors.white,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  contact['email'] ?? 'No email',
                                  style: const TextStyle(
                                    color: PumpkinTheme.textSecondary,
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: PumpkinTheme.success.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: PumpkinTheme.success.withOpacity(0.2)),
                            ),
                            child: const Text(
                              'CLIENT',
                              style: TextStyle(
                                color: PumpkinTheme.success,
                                fontSize: 10,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
    );
  }
}
