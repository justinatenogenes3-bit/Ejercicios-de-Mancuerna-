import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useApp, C, MUSCLE_BADGE } from '../../context/AppContext';
import { Badge, PrimaryButton, UCTag } from '../../components/UI';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Nav   = NativeStackNavigationProp<RootStackParamList, 'ExerciseDetail'>;
type Route = RouteProp<RootStackParamList, 'ExerciseDetail'>;

export default function ExerciseDetailScreen() {
  const nav   = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { exercises } = useApp();

  const ex = exercises.find(e => e.id === route.params.exerciseId) ?? exercises[0];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.hero}>
          <TouchableOpacity style={styles.backBtn} onPress={() => nav.goBack()}>
            <Ionicons name="arrow-back" size={20} color={C.text} />
          </TouchableOpacity>
          <UCTag label="UC-03 Ver detalle · «include» UC-04 Técnica" />
          <Text style={styles.heroEmoji}>{ex.emoji}</Text>
          <Text style={styles.heroName}>{ex.name.toUpperCase()}</Text>
          <View style={styles.badgeRow}>
            <Badge label={ex.muscleGroup} type={MUSCLE_BADGE[ex.muscleGroup]} />
            <Badge label={ex.difficulty}  type="lime" />
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[['Series', ex.sets], ['Reps', ex.reps], ['Descanso', `${ex.restSeconds}s`]].map(([l, v]) => (
            <View key={l} style={styles.statBox}>
              <Text style={styles.statNum}>{v}</Text>
              <Text style={styles.statLabel}>{l}</Text>
            </View>
          ))}
        </View>

        {/* Description */}
        <Text style={styles.sectionLabel}>Descripción</Text>
        <Text style={styles.description}>{ex.description}</Text>

        {/* Technique link */}
        <TouchableOpacity
          style={styles.techniqueCard}
          onPress={() => nav.navigate('Technique', { exerciseId: ex.id })}
          activeOpacity={0.85}
        >
          <View style={styles.techniqueIcon}>
            <Ionicons name="play" size={20} color={C.bg} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.techniqueTitle}>Ver técnica correcta</Text>
            <Text style={styles.techniqueSub}>«include» automático · UC-04</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={C.acc} />
        </TouchableOpacity>

        {/* Muscles */}
        <Text style={styles.sectionLabel}>Músculos trabajados</Text>
        <View style={styles.muscleRow}>
          <View style={styles.musclePrimary}>
            <Text style={styles.muscleText}>{ex.muscleGroup}</Text>
          </View>
          {ex.secondaryMuscles.map(m => (
            <View key={m} style={styles.muscleSecondary}>
              <Text style={styles.muscleSecText}>{m}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 24 }} />
        <PrimaryButton label="Iniciar ejercicio →" onPress={() => nav.navigate('Timer', { routineId: 'r1', exerciseIndex: 0 })} />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: C.bg },
  scroll:  { flex: 1 },
  content: { paddingBottom: 32 },

  hero: {
    backgroundColor: C.s2, padding: 24, paddingTop: 12,
    borderBottomWidth: 1, borderBottomColor: C.border, marginBottom: 0,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: C.s3, borderWidth: 1, borderColor: C.border,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  heroEmoji: { fontSize: 72, textAlign: 'center', marginBottom: 12 },
  heroName:  { fontSize: 34, fontWeight: '900', color: C.text, textAlign: 'center', marginBottom: 10, letterSpacing: 1 },
  badgeRow:  { flexDirection: 'row', justifyContent: 'center', gap: 8 },

  statsRow: { flexDirection: 'row', gap: 0, margin: 16 },
  statBox:  { flex: 1, backgroundColor: C.s2, borderRadius: 12, padding: 12, alignItems: 'center', marginHorizontal: 4 },
  statNum:  { fontSize: 22, fontWeight: '900', color: C.acc, lineHeight: 24 },
  statLabel:{ fontSize: 11, color: C.muted, marginTop: 2 },

  sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', color: C.muted, marginHorizontal: 16, marginBottom: 8 },
  description:  { fontSize: 14, color: '#b0b0c0', lineHeight: 22, marginHorizontal: 16, marginBottom: 20 },

  techniqueCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#e8ff4710', borderWidth: 1, borderColor: '#e8ff4730',
    borderRadius: 16, padding: 16, marginHorizontal: 16, marginBottom: 20,
  },
  techniqueIcon: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: C.acc, alignItems: 'center', justifyContent: 'center',
  },
  techniqueTitle: { fontWeight: '700', fontSize: 14, color: C.text, marginBottom: 2 },
  techniqueSub:   { fontSize: 12, color: C.muted },

  muscleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginHorizontal: 16, marginBottom: 20 },
  musclePrimary: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 100,
    backgroundColor: '#e8ff4718', borderWidth: 1.5, borderColor: '#e8ff4740',
  },
  muscleText: { color: C.acc, fontSize: 13, fontWeight: '500' },
  muscleSecondary: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 100,
    backgroundColor: C.s3,
  },
  muscleSecText: { color: C.muted, fontSize: 13, fontWeight: '500' },
});
