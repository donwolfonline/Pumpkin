import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/invoices_provider.dart';
import '../core/theme.dart';

class InvoicesScreen extends StatefulWidget {
  const InvoicesScreen({super.key});

  @override
  State<InvoicesScreen> createState() => _InvoicesScreenState();
}

class _InvoicesScreenState extends State<InvoicesScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<InvoicesProvider>().fetchInvoices();
    });
  }

  @override
  Widget build(BuildContext context) {
    final invoices = context.watch<InvoicesProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'INVOICES',
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w900,
            letterSpacing: 4,
            color: PumpkinTheme.primary,
          ),
        ),
      ),
      body: invoices.isLoading
          ? const Center(child: CircularProgressIndicator(color: PumpkinTheme.primary))
          : invoices.invoices.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.receipt_long_outlined, size: 64, color: PumpkinTheme.surface),
                      const SizedBox(height: 16),
                      Text(
                        'No invoices found',
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
                  itemCount: invoices.invoices.length,
                  itemBuilder: (context, index) {
                    final invoice = invoices.invoices[index];
                    final isPaid = invoice['status'] == 'paid';

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
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: isPaid ? PumpkinTheme.success.withOpacity(0.1) : PumpkinTheme.primary.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Icon(
                              isPaid ? Icons.check_circle_outline : Icons.pending_outlined,
                              color: isPaid ? PumpkinTheme.success : PumpkinTheme.primary,
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  invoice['clientName'] ?? 'Unknown Client',
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16,
                                    color: Colors.white,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  '#${invoice['number'] ?? 'INV-000'}',
                                  style: const TextStyle(
                                    color: PumpkinTheme.textSecondary,
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Text(
                                '\$${(invoice['total'] ?? 0).toStringAsFixed(2)}',
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                  color: Colors.white,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                (invoice['status'] ?? '').toString().toUpperCase(),
                                style: TextStyle(
                                  color: isPaid ? PumpkinTheme.success : PumpkinTheme.primary,
                                  fontSize: 10,
                                  fontWeight: FontWeight.w900,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    );
                  },
                ),
    );
  }
}
