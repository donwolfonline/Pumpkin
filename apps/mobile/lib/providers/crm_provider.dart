import 'package:flutter/material.dart';
import '../core/api_client.dart';

class CrmProvider extends ChangeNotifier {
  final ApiClient _apiClient = ApiClient();
  List<dynamic> _contacts = [];
  bool _isLoading = false;
  String? _error;

  List<dynamic> get contacts => _contacts;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> fetchContacts() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _apiClient.getContacts();
      if (response.statusCode == 200) {
        _contacts = response.data;
      } else {
        _error = 'Failed to load contacts';
      }
    } catch (e) {
      _error = 'Error: $e';
    }

    _isLoading = false;
    notifyListeners();
  }
}
