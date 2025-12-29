import 'package:flutter/material.dart';
import '../core/api_client.dart';

class AuthProvider extends ChangeNotifier {
  final ApiClient _apiClient = ApiClient();
  bool _isAuthenticated = false;
  bool _isLoading = false;

  bool get isAuthenticated => _isAuthenticated;
  bool get isLoading => _isLoading;

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _apiClient.login(email, password);
      if (response.statusCode == 200 || response.statusCode == 201) {
        _isAuthenticated = true;
        _isLoading = false;
        notifyListeners();
        return true;
      }
    } catch (e) {
      print('Login Error: $e');
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  Future<void> logout() async {
    await _apiClient.logout();
    _isAuthenticated = false;
    notifyListeners();
  }
}
