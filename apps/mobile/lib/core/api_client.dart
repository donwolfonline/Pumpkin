import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ApiClient {
  late Dio _dio;
  final _storage = const FlutterSecureStorage();
  
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
}
