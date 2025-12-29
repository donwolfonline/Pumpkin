import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class PumpkinTheme {
  static const Color primary = Color(0xFFF97316); // Orange
  static const Color background = Color(0xFF051C1C); // Deep Teal/Green
  static const Color surface = Color(0xFF0A2C28); // Lighter Teal/Green
  static const Color textMain = Colors.white;
  static const Color textSecondary = Color(0xFF94A3B8); // Zinc 400

  static ThemeData get darkTheme {
    return ThemeData(
      brightness: Brightness.dark,
      scaffoldBackgroundColor: background,
      primaryColor: primary,
      colorScheme: const ColorScheme.dark(
        primary: primary,
        secondary: primary,
        surface: surface,
        background: background,
      ),
      textTheme: GoogleFonts.interTextTheme(ThemeData.dark().textTheme).copyWith(
        displayLarge: GoogleFonts.outfit(
          color: textMain,
          fontWeight: FontWeight.w900,
          letterSpacing: -1.5,
        ),
        displayMedium: GoogleFonts.outfit(
          color: textMain,
          fontWeight: FontWeight.w900,
          letterSpacing: -1,
        ),
        titleLarge: GoogleFonts.outfit(
          color: textMain,
          fontWeight: FontWeight.w800,
          letterSpacing: -0.5,
        ),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: background,
        elevation: 0,
        centerTitle: true,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primary,
          foregroundColor: Colors.white,
          textStyle: const TextStyle(
            fontWeight: FontWeight.w900,
            letterSpacing: 2,
            fontSize: 12,
          ),
          padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 32),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(100),
          ),
        ),
      ),
    );
  }
}
