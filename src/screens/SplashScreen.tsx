import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { C } from '../context/AppContext';
import { PrimaryButton } from '../components/UI';
import { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

export default function SplashScreen() {
  const nav = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.safe}>
      {/* Background glows */}
      <View style={styles.glowTopRight} />
      <View style={styles.glowLeft}     />

      {/* Logo */}
      <View style={styles.logoWrap}>
        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>🏋️</Text>
        </View>
      </View>

      {/* Tagline */}
      <View style={styles.bottom}>
        <Text style={styles.eyebrow}>Tu app de gym</Text>
        <Text style={styles.title}>REP{'\n'}<Text style={styles.titleAcc}>FORCE</Text></Text>
        <Text style={styles.subtitle}>
          Entrena con propósito.{'\n'}
          Mide tu progreso. Supera tus límites.
        </Text>

        <View style={styles.btnGroup}>
          <PrimaryButton label="Crear cuenta" onPress={() => nav.navigate('Register')} />
          <View style={styles.gap} />
          <PrimaryButton label="Ya tengo cuenta" onPress={() => nav.navigate('Login')} variant="ghost" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },

  glowTopRight: {
    position: 'absolute', top: -60, right: -80,
    width: 320, height: 320,
    backgroundColor: '#e8ff4710',
    borderRadius: 160,
  },
  glowLeft: {
    position: 'absolute', top: 140, left: -60,
    width: 200, height: 200,
    backgroundColor: '#7c6aff0d',
    borderRadius: 100,
  },

  logoWrap: { flex: 1, justifyContent: 'center', alignItems: 'flex-start', paddingHorizontal: 32, paddingTop: 40 },
  logoBox: {
    width: 64, height: 64, borderRadius: 18,
    backgroundColor: C.acc,
    alignItems: 'center', justifyContent: 'center',
  },
  logoEmoji: { fontSize: 30 },

  bottom: { padding: 32, paddingBottom: 40 },
  eyebrow: { fontSize: 13, color: C.muted, fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 },
  title: { fontSize: 72, fontWeight: '900', color: C.text, lineHeight: 68, marginBottom: 20, letterSpacing: 1 },
  titleAcc: { color: C.acc },
  subtitle: { fontSize: 16, color: C.muted, lineHeight: 26, marginBottom: 40 },

  btnGroup: { gap: 0 },
  gap: { height: 12 },
});
