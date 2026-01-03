import 'package:flutter/material.dart';
import '../core/api_client.dart';

class InvoicesProvider extends ChangeNotifier {
  final ApiClient _apiClient = ApiClient();
  List<dynamic> _invoices = [];
  bool _isLoading = false;
  String? _error;

  List<dynamic> get invoices => _invoices;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> fetchInvoices() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _apiClient.getInvoices();
      if (response.statusCode == 200) {
        _invoices = response.data;
      } else {
        _error = 'Failed to load invoices';
      }
    } catch (e) {
      _error = 'Error: $e';
    }

    _isLoading = false;
    notifyListeners();
  }
}
