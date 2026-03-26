import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useApp, C } from '../../context/AppContext';
import { PrimaryButton, UCTag } from '../../components/UI';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Route = RouteProp<RootStackParamList, 'Technique'>;

export default function TechniqueScreen() {
  const nav   = useNavigation();
  const route = useRoute<Route>();
  const { exercises } = useApp();

  const ex = exercises.find(e => e.id === route.params.exerciseId) ?? exercises[0];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <TouchableOpacity style={styles.backBtn} onPress={() => nav.goBack()}>
          <Ionicons name="arrow-back" size={20} color={C.text} />
        </TouchableOpacity>

        <UCTag label="UC-04 Ver técnica correcta" />
        <Text style={styles.title}>TÉCNICA{'\n'}<Text style={styles.titleAcc}>CORRECTA</Text></Text>
        <Text style={styles.subtitle}>{ex.name}</Text>

        {/* Video placeholder */}
        <View style={styles.videoBox}>
          <View style={styles.videoOverlay} />
          <View style={styles.playWrap}>
            <View style={styles.playBtn}>
              <Ionicons name="play" size={22} color={C.bg} />
            </View>
            <Text style={styles.videoLabel}>Tutorial en video</Text>
          </View>
        </View>

        {/* Steps */}
        <Text style={styles.sectionLabel}>Pasos de ejecución</Text>
        <View style={styles.stepsList}>
          {ex.steps.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Errors */}
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>⚠️ Errores comunes</Text>
          <Text style={styles.errorText}>{ex.commonErrors}</Text>
        </View>

        <PrimaryButton label="← Volver al ejercicio" onPress={() => nav.goBack()} />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: C.bg },
  scroll:  { flex: 1 },
  content: { padding: 24, paddingBottom: 40 },

  backBtn: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: C.s2, borderWidth: 1, borderColor: C.border,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },

  title:    { fontSize: 32, fontWeight: '900', color: C.text, lineHeight: 34, marginBottom: 4 },
  titleAcc: { color: C.acc },
  subtitle: { fontSize: 13, color: C.muted, marginBottom: 20 },

  videoBox: {
    backgroundColor: C.s2, borderRadius: 18, aspectRatio: 16 / 9,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 24, borderWidth: 1, borderColor: C.border,
    overflow: 'hidden',
  },
  videoOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#0c0c1a',
  },
  playWrap: { alignItems: 'center', zIndex: 1 },
  playBtn:  {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: C.acc, alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  videoLabel: { fontSize: 13, color: C.muted },

  sectionLabel: {
    fontSize: 11, fontWeight: '700', letterSpacing: 1.5,
    textTransform: 'uppercase', color: C.muted, marginBottom: 14,
  },

  stepsList: { gap: 12, marginBottom: 20 },
  stepRow:   { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  stepNum:   {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: C.acc, alignItems: 'center', justifyContent: 'center',
  },
  stepNumText: { fontSize: 12, fontWeight: '800', color: C.bg },
  stepText:    { flex: 1, fontSize: 14, color: '#b0b0c0', lineHeight: 22, paddingTop: 3 },

  errorCard: {
    backgroundColor: '#ff4d6d12', borderWidth: 1, borderColor: '#ff4d6d30',
    borderRadius: 14, padding: 14, marginBottom: 24,
  },
  errorTitle: { fontWeight: '700', fontSize: 13, color: '#ff4d6d', marginBottom: 6 },
  errorText:  { fontSize: 13, color: '#b0b0c0', lineHeight: 22 },
});
