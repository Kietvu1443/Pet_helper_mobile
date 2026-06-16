// Màn hình chính tạm thời (Phase 1).
//
// Chỉ truy cập được sau khi đăng nhập (route gate ở app/_layout.tsx).
// Hiển thị người dùng hiện tại và nút đăng xuất để kiểm chứng luồng auth.
// Phase 2 sẽ thay màn hình này bằng deck vuốt PetSnap.
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { getAuthConfig } from '@/lib/api/auth';
import { API_BASE_URL } from '@/lib/api/config';
import { useAuth } from '@/lib/auth/AuthContext';

type CheckState = 'idle' | 'running' | 'pass' | 'fail';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const [connState, setConnState] = useState<CheckState>('idle');
  const [connMsg, setConnMsg] = useState('');

  // Kiểm tra kết nối backend (không phá trạng thái — endpoint công khai).
  async function checkConnectivity() {
    setConnState('running');
    setConnMsg('');
    try {
      await getAuthConfig();
      setConnState('pass');
      setConnMsg('OK — backend phản hồi');
    } catch (e) {
      setConnState('fail');
      setConnMsg(e instanceof Error ? e.message : 'Lỗi không xác định');
    }
  }

  const color =
    connState === 'pass' ? '#16a34a' : connState === 'fail' ? '#dc2626' : connState === 'running' ? '#d97706' : '#6b7280';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Đã đăng nhập</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Tên đăng nhập</Text>
        <Text style={styles.value}>{user?.display_name ?? '—'}</Text>
        <Text style={styles.label}>Họ tên</Text>
        <Text style={styles.value}>{user?.name ?? '—'}</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email ?? '—'}</Text>
        <Text style={styles.label}>Vai trò (role)</Text>
        <Text style={styles.value}>{user?.role ?? '—'}</Text>
        <Text style={styles.label}>API_BASE_URL</Text>
        <Text style={styles.value}>{API_BASE_URL}</Text>
      </View>

      <View style={[styles.card, { borderLeftColor: color, borderLeftWidth: 4 }]}>
        <Text style={[styles.badgeTitle, { color }]}>Kết nối backend</Text>
        {connMsg ? <Text style={styles.value}>{connMsg}</Text> : null}
      </View>
      <TouchableOpacity style={styles.btnGhost} onPress={checkConnectivity}>
        <Text style={styles.btnGhostText}>Kiểm tra kết nối</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => logout()}>
        <Text style={styles.btnText}>Đăng xuất</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 64,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  card: {
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    padding: 14,
    gap: 4,
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  value: {
    fontSize: 14,
    color: '#111827',
  },
  badgeTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  btn: {
    backgroundColor: '#dc2626',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  btnGhost: {
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#84cc16',
  },
  btnGhostText: {
    color: '#4d7c0f',
    fontWeight: '700',
    fontSize: 15,
  },
});
