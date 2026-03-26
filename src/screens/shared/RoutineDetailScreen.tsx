import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useApp, C } from '../../context/AppContext';
import { Badge, PrimaryButton, ProgressBar, UCTag } from '../../components/UI';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Nav   = NativeStackNavigationProp<RootStackParamList, 'RoutineDetail'>;
type Route = RouteProp<RootStackParamList, 'RoutineDetail'>;

export default function RoutineDetailScreen() {
  const nav   = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { routines, exercises, resetRoutine } = useApp();

  const routine = routines.find(r => r.id === route.params.routineId) ?? routines[0];
  const done    = routine.exercises.filter(e => e.done).length;
  const total   = routine.exercises.length;
  const donePct = total > 0 ? (done / total) * 100 : 0;
  const allDone = done === total;

  // Primer ejercicio no completado
  const nextIndex = routine.exercises.findIndex(e => !e.done);

  const handleReset = () => {
    Alert.alert(
      'Reiniciar rutina',
      '¿Deseas reiniciar el progreso de esta rutina?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Reiniciar', style: 'destructive', onPress: () => resetRoutine(routine.id) },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.topRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => nav.goBack()}>
            <Ionicons name="arrow-back" size={20} color={C.text} />
          </TouchableOpacity>
          {allDone && (
            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <Ionicons name="refresh" size={16} color={C.muted} />
              <Text style={styles.resetText}>Reiniciar</Text>
            </TouchableOpacity>
          )}
        </View>

        <UCTag label="UC-11 Completar rutina · «include» UC-12" />
        <Text style={styles.title}>
          {routine.name.includes('—')
            ? routine.name.split('—')[1].trim().toUpperCase()
            : routine.name.toUpperCase()}
        </Text>

        <View style={styles.metaRow}>
          <Badge label={routine.category} type="lime" />
          <Text style={styles.meta}>{total} ejercicios · ~{routine.durationMin} min</Text>
        </View>

        <ProgressBar pct={donePct} style={styles.progress} />
        <Text style={styles.progressText}>
          {allDone ? '✅ ¡Rutina completada!' : `${done} de ${total} completados`}
        </Text>

        {/* Lista de ejercicios */}
        <View style={styles.list}>
          {routine.exercises.map((re, i) => {
            const ex = exercises.find(e => e.id === re.exerciseId);
            if (!ex) return null;
            const isNext = i === nextIndex;

            return (
              <TouchableOpacity
                key={i}
                style={[
                  styles.exRow,
                  isNext  && styles.exRowActive,
                  re.done && styles.exRowDone,
                ]}
                onPress={() => {
                  if (!re.done) {
                    nav.navigate('Timer', { routineId: routine.id, exerciseIndex: i });
                  }
                }}
                activeOpacity={re.done ? 1 : 0.8}
              >
                <View style={[styles.circle, re.done && styles.circleDone, isNext && styles.circleActive]}>
                  {re.done
                    ? <Ionicons name="checkmark" size={14} color={C.bg} />
                    : <Text style={[styles.circleNum, isNext && { color: C.acc }]}>{i + 1}</Text>
                  }
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[
                    styles.exName,
                    isNext  && { color: C.acc },
                    re.done && { color: C.muted },
                  ]}>
                    {ex.name}{isNext ? '  ← siguiente' : ''}
                  </Text>
                  <Text style={styles.exDetail}>
                    {re.sets} series × {re.reps} reps · {re.weightKg ? `${re.weightKg}kg` : 'Peso corporal'}
                  </Text>
                </View>

                {re.done
                  ? null
                  : <Ionicons name={isNext ? 'play-circle' : 'chevron-forward'} size={22} color={isNext ? C.acc : C.muted} />
                }
              </TouchableOpacity>
            );
          })}
        </View>

        {allDone ? (
          <PrimaryButton
            label="Ver mi progreso →"
            onPress={() => nav.navigate('Progress' as any)}
          />
        ) : (
          <PrimaryButton
            label={done === 0 ? 'Comenzar entrenamiento ▶' : 'Continuar entrenamiento ▶'}
            onPress={() => nav.navigate('Timer', { routineId: routine.id, exerciseIndex: nextIndex })}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  content: { padding: 24, paddingBottom: 40 },

  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  backBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: C.s2, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  resetBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, padding: 8 },
  resetText: { fontSize: 13, color: C.muted },

  title: { fontSize: 28, fontWeight: '900', color: C.text, letterSpacing: 1, marginBottom: 10 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  meta: { fontSize: 12, color: C.muted },
  progress: { marginBottom: 6 },
  progressText: { fontSize: 12, color: C.muted, marginBottom: 20 },

  list: { gap: 10, marginBottom: 24 },
  exRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 14, padding: 14 },
  exRowActive: { backgroundColor: '#e8ff4708', borderColor: C.acc, borderWidth: 1.5 },
  exRowDone: { opacity: 0.45 },

  circle: { width: 32, height: 32, borderRadius: 16, backgroundColor: C.s3, alignItems: 'center', justifyContent: 'center' },
  circleDone: { backgroundColor: C.acc },
  circleActive: { borderWidth: 2, borderColor: C.acc },
  circleNum: { fontSize: 12, fontWeight: '800', color: C.muted },

  exName: { fontWeight: '600', fontSize: 14, color: C.text, marginBottom: 2 },
  exDetail: { fontSize: 11, color: C.muted },
});
