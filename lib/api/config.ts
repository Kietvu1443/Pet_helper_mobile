// Cấu hình API base URL (A1: chiến lược base URL theo môi trường).
//
// Thứ tự ưu tiên:
//   1. expo.extra.apiBaseUrl trong app.json (đặt cho staging/production)
//   2. Mặc định dev theo nền tảng (Android emulator dùng 10.0.2.2, còn lại dùng localhost)
//
// Backend Express mặc định chạy ở PORT 3000.
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const DEV_PORT = 3000;

// Android emulator không thấy "localhost" của máy host — phải dùng 10.0.2.2.
// iOS simulator và web dùng localhost trực tiếp.
function defaultDevBaseUrl(): string {
  const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  return `http://${host}:${DEV_PORT}`;
}

function resolveBaseUrl(): string {
  const fromExtra = Constants.expoConfig?.extra?.apiBaseUrl;
  if (typeof fromExtra === 'string' && fromExtra.trim().length > 0) {
    return fromExtra.trim().replace(/\/+$/, '');
  }
  return defaultDevBaseUrl();
}

// Origin gốc (không có /api/v1) — dùng để phân giải đường dẫn ảnh tương đối (A4).
export const API_ORIGIN = resolveBaseUrl();

// Tiền tố cho toàn bộ JSON API v1.
export const API_BASE_URL = `${API_ORIGIN}/api/v1`;
