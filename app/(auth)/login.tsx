// Màn hình đăng nhập (Phase 1).
//
// Đăng nhập bằng display_name (tên đăng nhập) + password — đúng hợp đồng backend.
// Thành công -> AuthContext set user -> route gate tự chuyển về (tabs).
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { ApiError } from '@/lib/api/client';
import { useAuth } from '@/lib/auth/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = displayName.trim().length > 0 && password.length > 0 && !submitting;

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError('');
    try {
      await login(displayName.trim(), password);
      // Không cần điều hướng thủ công — route gate xử lý sau khi user được set.
    } catch (e) {
      // Hiển thị nguyên message tiếng Việt từ backend.
      const message = e instanceof ApiError ? e.message : 'Không thể đăng nhập, vui lòng thử lại';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <Text style={styles.brand}>PetSnap</Text>
        <Text style={styles.subtitle}>Đăng nhập để tiếp tục</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Tên đăng nhập</Text>
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Tên đăng nhập"
            editable={!submitting}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Mật khẩu</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Mật khẩu"
            editable={!submitting}
            onSubmitEditing={handleSubmit}
            returnKeyType="go"
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.btn, !canSubmit && styles.btnDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit}>
          {submitting ? (
            <ActivityIndicator color="#1a2e05" />
          ) : (
            <Text style={styles.btnText}>Đăng nhập</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 14,
  },
  brand: {
    fontSize: 34,
    fontWeight: '800',
    color: '#4d7c0f',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  error: {
    color: '#dc2626',
    fontSize: 14,
  },
  btn: {
    backgroundColor: '#84cc16',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnText: {
    color: '#1a2e05',
    fontWeight: '700',
    fontSize: 16,
  },
});
