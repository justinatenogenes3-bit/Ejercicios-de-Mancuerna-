import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Vibration, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useApp, C } from '../../context/AppContext';
import { PrimaryButton, UCTag } from '../../components/UI';
import { RootStackParamList } from '../../navigation/AppNavigator';
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

type Nav   = NativeStackNavigationProp<RootStackParamList, 'Timer'>;
type Route = RouteProp<RootStackParamList, 'Timer'>;

const RADIUS = 88;
const CIRC   = 2 * Math.PI * RADIUS;

type Phase = 'workout' | 'rest';

export default function TimerScreen() {
  const nav   = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { routines, exercises, markExerciseDone } = useApp();

  const routine   = routines.find(r => r.id === route.params.routineId) ?? routines[0];
  const exIndex   = route.params.exerciseIndex ?? 0;
  const re        = routine.exercises[exIndex];
  const ex        = exercises.find(e => e.id === re?.exerciseId) ?? exercises[0];

  const totalSets    = re?.sets ?? 3;
  const restSeconds  = ex?.restSeconds ?? 60;

  const [phase,   setPhase]   = useState<Phase>('workout');
  const [curSet,  setCurSet]  = useState(1);
  const [time,    setTime]    = useState(0);          // workout = contar hacia arriba
  const [restTime,setRestTime]= useState(restSeconds);// descanso = cuenta regresiva
  const [running, setRunning] = useState(true);
  const intervalRef = useRef<any>(null);
  const startRef    = useRef<number>(Date.now());

  // Reinicia al cambiar de fase/serie
  useEffect(() => {
    setRunning(true);
    if (phase === 'workout') {
      setTime(0);
      startRef.current = Date.now();
    } else {
      setRestTime(restSeconds);
    }
  }, [phase, curSet]);

  // Tick
  useEffect(() => {
    clearInterval(intervalRef.current);
    if (!running) return;

    intervalRef.current = setInterval(() => {
      if (phase === 'workout') {
        setTime(Math.floor((Date.now() - startRef.current) / 1000));
      } else {
        setRestTime(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            Vibration.vibrate(300);
            setPhase('workout');
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [running, phase]);

  const handleCompleteSet = useCallback(() => {
    Vibration.vibrate(100);
    if (curSet < totalSets) {
      setPhase('rest');
      setCurSet(s => s + 1);
    } else {
      // Último set → marcar ejercicio como hecho
      clearInterval(intervalRef.current);
      markExerciseDone(routine.id, exIndex);

      const nextIndex = exIndex + 1;
      const hasMore   = nextIndex < routine.exercises.length;

      if (hasMore) {
        Alert.alert(
          '¡Serie completada! 💪',
          `Ejercicio ${exIndex + 1} completado.\n¿Continuar con el siguiente?`,
          [
            { text: 'Descansar primero', onPress: () => {
              setPhase('rest');
              setCurSet(1);
            }},
            { text: 'Siguiente ejercicio', onPress: () => {
              nav.replace('Timer', { routineId: routine.id, exerciseIndex: nextIndex });
            }},
          ]
        );
      } else {
        nav.replace('Completed', { routineId: routine.id, durationMin: routine.durationMin });
      }
    }
  }, [curSet, totalSets, exIndex, routine]);

  const handleSkip = () => {
    Alert.alert('Saltar ejercicio', '¿Deseas saltar este ejercicio?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Saltar', style: 'destructive', onPress: () => {
        markExerciseDone(routine.id, exIndex);
        const nextIndex = exIndex + 1;
        if (nextIndex < routine.exercises.length) {
          nav.replace('Timer', { routineId: routine.id, exerciseIndex: nextIndex });
        } else {
          nav.replace('Completed', { routineId: routine.id, durationMin: routine.durationMin });
        }
      }},
    ]);
  };

  // Ring visual
  const isRest    = phase === 'rest';
  const ringPct   = isRest ? restTime / restSeconds : Math.min(time / 120, 1); // 2 min como referencia visual
  const ringOffset = CIRC - CIRC * ringPct;
  const mins = Math.floor((isRest ? restTime : time) / 60);
  const secs  = (isRest ? restTime : time) % 60;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => nav.goBack()}>
            <Ionicons name="arrow-back" size={20} color={C.text} />
          </TouchableOpacity>
          <UCTag label="UC-12 Temporizador" />
          <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
            <Text style={styles.skipText}>Saltar</Text>
          </TouchableOpacity>
        </View>

        {/* Phase indicator */}
        <View style={[styles.phaseBadge, isRest && styles.phaseBadgeRest]}>
          <Text style={[styles.phaseText, isRest && styles.phaseTextRest]}>
            {isRest ? '⏸ Descanso' : '▶ Ejercicio activo'}
          </Text>
        </View>

        {/* Exercise info */}
        <Text style={styles.exOf}>Ejercicio {exIndex + 1} de {routine.exercises.length}</Text>
        <Text style={styles.exName}>{ex.name.toUpperCase()}</Text>
        <Text style={styles.exDetail}>
          Serie {curSet} de {totalSets} · {re?.weightKg ? `${re.weightKg}kg` : 'Peso corporal'}
        </Text>

        {/* Ring timer */}
        <View style={styles.ringWrap}>
          <Svg width={200} height={200} style={{ transform: [{ rotate: '-90deg' }] }}>
            <Defs>
              <SvgLinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0"  stopColor={isRest ? C.acc2 : C.acc}  stopOpacity="1" />
                <Stop offset="1"  stopColor={isRest ? C.acc3 : C.acc3} stopOpacity="1" />
              </SvgLinearGradient>
            </Defs>
            <Circle cx={100} cy={100} r={RADIUS} fill="none" stroke={C.s2} strokeWidth={12} />
            <Circle
              cx={100} cy={100} r={RADIUS}
              fill="none" stroke="url(#grad)" strokeWidth={12}
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={ringOffset}
            />
          </Svg>
          <View style={styles.ringInner}>
            <Text style={styles.timerText}>{mins}:{String(secs).padStart(2, '0')}</Text>
            <Text style={styles.timerLabel}>{isRest ? 'descanso' : 'tiempo'}</Text>
          </View>
        </View>

        {/* Sets indicator */}
        <View style={styles.setsRow}>
          {Array.from({ length: totalSets }, (_, i) => i + 1).map(s => (
            <View key={s} style={[
              styles.setDot,
              s < curSet  && styles.setDotDone,
              s === curSet && styles.setDotActive,
            ]}>
              <Text style={[styles.setNum, s < curSet && { color: C.bg }, s === curSet && { color: C.acc }]}>
                {s < curSet ? '✓' : s}
              </Text>
            </View>
          ))}
        </View>

        {/* Controls */}
        {isRest ? (
          <View style={styles.controls}>
            <TouchableOpacity style={styles.primaryCtrl} onPress={() => { setPhase('workout'); }} activeOpacity={0.85}>
              <Ionicons name="play" size={20} color={C.bg} />
              <Text style={styles.primaryCtrlText}>Saltar descanso</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryCtrl} onPress={() => setRunning(r => !r)}>
              <Ionicons name={running ? 'pause' : 'play'} size={20} color={C.text} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.controls}>
            <TouchableOpacity style={styles.primaryCtrl} onPress={() => setRunning(r => !r)} activeOpacity={0.85}>
              <Ionicons name={running ? 'pause' : 'play'} size={20} color={C.bg} />
              <Text style={styles.primaryCtrlText}>{running ? 'Pausar' : 'Reanudar'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryCtrl} onPress={() => { setTime(0); startRef.current = Date.now(); setRunning(true); }}>
              <Ionicons name="refresh" size={20} color={C.text} />
            </TouchableOpacity>
          </View>
        )}

        {!isRest && (
          <PrimaryButton
            label={curSet < totalSets ? `✓ Completar serie ${curSet}` : '✓ Finalizar ejercicio'}
            variant="accent"
            onPress={handleCompleteSet}
          />
        )}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  container: { flex: 1, padding: 20, paddingBottom: 28 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  backBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: C.s2, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  skipBtn: { padding: 8 },
  skipText: { fontSize: 13, color: C.muted, fontWeight: '500' },

  phaseBadge: { alignSelf: 'center', backgroundColor: '#e8ff4718', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5, marginBottom: 10 },
  phaseBadgeRest: { backgroundColor: '#ff4d6d18' },
  phaseText: { fontSize: 12, color: C.acc, fontWeight: '700' },
  phaseTextRest: { color: C.acc2 },

  exOf: { textAlign: 'center', fontSize: 12, color: C.muted, fontWeight: '500' },
  exName: { textAlign: 'center', fontSize: 20, fontWeight: '900', color: C.text, letterSpacing: 1, marginVertical: 4 },
  exDetail: { textAlign: 'center', fontSize: 13, color: C.muted, marginBottom: 16 },

  ringWrap: { width: 200, height: 200, alignSelf: 'center', marginBottom: 20 },
  ringInner: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  timerText: { fontSize: 50, fontWeight: '900', color: C.text, letterSpacing: 1 },
  timerLabel: { fontSize: 12, color: C.muted, marginTop: 2 },

  setsRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 20 },
  setDot: { width: 44, height: 44, borderRadius: 12, backgroundColor: C.s3, alignItems: 'center', justifyContent: 'center' },
  setDotDone: { backgroundColor: C.acc },
  setDotActive: { borderWidth: 2, borderColor: C.acc },
  setNum: { fontSize: 14, fontWeight: '800', color: C.muted },

  controls: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  primaryCtrl: { flex: 1, height: 52, borderRadius: 14, backgroundColor: C.acc, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryCtrlText: { color: C.bg, fontWeight: '700', fontSize: 15 },
  secondaryCtrl: { width: 52, height: 52, borderRadius: 14, backgroundColor: C.s2, borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
});
