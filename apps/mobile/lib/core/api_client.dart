import 'package:dio/dio.dart';

// Mock implementation of secure storage to avoid CocoaPods issues during demo
class SecureStorage {
  static final Map<String, String> _data = {};
  Future<void> write({required String key, required String value}) async => _data[key] = value;
  Future<String?> read({required String key}) async => _data[key];
  Future<void> delete({required String key}) async => _data.remove(key);
}

class ApiClient {
  late Dio _dio;
  final _storage = SecureStorage();
  
  // Update this to your local loopback if running on emulator (10.0.2.2 for Android)
  static const String baseUrl = 'http://localhost:4000/api'; 

  ApiClient() {
    _dio = Dio(BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 5),
      receiveTimeout: const Duration(seconds: 3),
      contentType: 'application/json',
    ));

    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _storage.read(key: 'jwt_token');
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (DioException e, handler) {
        // Centralized error handling
        print('API Error: ${e.message}');
        return handler.next(e);
      },
    ));
  }

  Future<Response> login(String email, String password) async {
    final response = await _dio.post('/auth/login', data: {
      'email': email,
      'password': password,
    });
    
    if (response.statusCode == 200 || response.statusCode == 201) {
      final token = response.data['access_token'];
      await _storage.write(key: 'jwt_token', value: token);
    }
    
    return response;
  }

  Future<void> logout() async {
    await _storage.delete(key: 'jwt_token');
  }

  Future<Response> getDashboardStats() async {
    return _dio.get('/analytics/dashboard');
  }

  Future<Response> getContacts() async {
    return _dio.get('/crm/contacts');
  }

  Future<Response> getInvoices() async {
    return _dio.get('/billing/invoices');
  }
}
