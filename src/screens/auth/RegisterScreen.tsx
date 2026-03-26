import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useApp, C } from '../../context/AppContext';
import { PrimaryButton } from '../../components/UI';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Register'>;

export default function RegisterScreen() {
  const nav = useNavigation<Nav>();
  const { register } = useApp();

  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Completa todos los campos'); return;
    }
    if (password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres'); return; }
    setError(''); setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    register({ name, username: email.split('@')[0], email, password, plan: 'free', avatarEmoji: '👤' });
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          <TouchableOpacity style={styles.backBtn} onPress={() => nav.goBack()}>
            <Ionicons name="arrow-back" size={20} color={C.text} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.eyebrow}>ÚNETE HOY</Text>
            <Text style={styles.title}>CREAR{'\n'}<Text style={styles.titleAcc}>CUENTA</Text></Text>
            <Text style={styles.subtitle}>Únete a RepForce y empieza hoy</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialBtn} onPress={handleRegister}>
                <Text style={styles.socialText}><Text style={{ fontWeight:'900' }}>G</Text>  Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.socialBtn, styles.fbBtn]} onPress={handleRegister}>
                <Text style={[styles.socialText, { color: '#5b9cf6' }]}>f  Facebook</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider}>
              <View style={styles.divLine} /><Text style={styles.divText}>o con email</Text><View style={styles.divLine} />
            </View>

            {/* Name */}
            <View style={styles.field}>
              <Text style={styles.label}>NOMBRE COMPLETO</Text>
              <View style={styles.inputRow}>
                <Ionicons name="person-outline" size={18} color={C.acc} style={styles.inputIcon} />
                <TextInput style={styles.input} value={name} onChangeText={setName}
                  placeholder="Ej. Tovar Sanchez" placeholderTextColor={C.muted} />
              </View>
            </View>

            {/* Email */}
            <View style={styles.field}>
              <Text style={styles.label}>EMAIL</Text>
              <View style={styles.inputRow}>
                <Ionicons name="mail-outline" size={18} color={C.acc} style={styles.inputIcon} />
                <TextInput style={styles.input} value={email} onChangeText={setEmail}
                  placeholder="correo@ejemplo.com" placeholderTextColor={C.muted}
                  keyboardType="email-address" autoCapitalize="none" />
              </View>
            </View>

            {/* Password */}
            <View style={styles.field}>
              <Text style={styles.label}>CONTRASEÑA</Text>
              <View style={styles.inputRow}>
                <Ionicons name="lock-closed-outline" size={18} color={C.acc} style={styles.inputIcon} />
                <TextInput style={[styles.input, { flex: 1 }]} value={password} onChangeText={setPassword}
                  placeholder="Mínimo 8 caracteres" placeholderTextColor={C.muted}
                  secureTextEntry={!showPass} autoCapitalize="none" />
                <TouchableOpacity onPress={() => setShowPass(!showPass)} style={{ padding: 12 }}>
                  <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color={C.acc} />
                </TouchableOpacity>
              </View>
            </View>

            {!!error && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle-outline" size={15} color="#FCA5A5" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <PrimaryButton label="Crear cuenta →" onPress={handleRegister} loading={loading} />

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
              <TouchableOpacity onPress={() => nav.navigate('Login')}>
                <Text style={styles.loginLink}>Inicia sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: C.bg },
  scroll: { flexGrow: 1, padding: 24 },
  backBtn: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: C.s2, borderWidth: 1, borderColor: C.border,
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  header:   { marginBottom: 28 },
  eyebrow:  { fontSize: 13, color: C.muted, fontWeight: '600', letterSpacing: 2, marginBottom: 6 },
  title:    { fontSize: 42, fontWeight: '900', color: C.text, lineHeight: 42, marginBottom: 8 },
  titleAcc: { color: C.acc },
  subtitle: { fontSize: 14, color: C.muted },
  card: { backgroundColor: C.s1, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: C.border },
  socialRow: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  socialBtn: { flex: 1, paddingVertical: 13, borderRadius: 12, alignItems: 'center', backgroundColor: C.s2, borderWidth: 1.5, borderColor: C.border },
  fbBtn: { backgroundColor: '#1877f215', borderColor: '#1877f230' },
  socialText: { color: C.text, fontSize: 14, fontWeight: '500' },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 18 },
  divLine: { flex: 1, height: 1, backgroundColor: C.border },
  divText: { color: C.muted, fontSize: 12 },
  field:    { marginBottom: 16 },
  label:    { color: C.muted, fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginBottom: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.s2, borderRadius: 12, borderWidth: 1, borderColor: C.border },
  inputIcon: { paddingHorizontal: 14 },
  input:    { flex: 1, color: C.text, paddingVertical: 13, fontSize: 15 },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(239,68,68,0.12)', borderRadius: 10, padding: 12, marginBottom: 14, borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)' },
  errorText: { color: '#FCA5A5', fontSize: 13 },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  loginText: { color: C.muted, fontSize: 14 },
  loginLink: { color: C.acc, fontWeight: '600', fontSize: 14 },
});
