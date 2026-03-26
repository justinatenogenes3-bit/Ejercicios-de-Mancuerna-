import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useApp, C, MUSCLE_BADGE } from '../../context/AppContext';
import { Badge, Card, ProgressBar, SectionHeader, StatCard } from '../../components/UI';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días 👋';
  if (h < 19) return 'Buenas tardes 👋';
  return 'Buenas noches 👋';
}

export default function HomeScreen() {
  const nav = useNavigation<Nav>();
  const { currentUser, routines, exercises, totalSessions, totalKcal, streakDays } = useApp();

  const todayRoutine = routines[0];
  const done   = todayRoutine.exercises.filter(e => e.done).length;
  const total  = todayRoutine.exercises.length;
  const donePct = total > 0 ? (done / total) * 100 : 0;
  const streakGoal = 10;
  const streakPct  = Math.round((streakDays / streakGoal) * 100);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.name}>{currentUser?.name.split(' ')[0].toUpperCase()}</Text>
          </View>
          <TouchableOpacity style={styles.avatarBtn} onPress={() => nav.navigate('Profile')}>
            <Text style={styles.avatarEmoji}>{currentUser?.avatarEmoji ?? '👤'}</Text>
          </TouchableOpacity>
        </View>

        {/* Streak banner */}
        <TouchableOpacity style={styles.streakBanner} onPress={() => nav.navigate('Progress' as any)} activeOpacity={0.85}>
          <View style={styles.bannerGlow} />
          <View style={styles.streakRow}>
            <Text style={styles.streakFlame}>🔥</Text>
            <View>
              <Text style={styles.streakTitle}>{streakDays} días de racha</Text>
              <Text style={styles.streakSub}>¡Sigue así! Vas muy bien</Text>
            </View>
          </View>
          <ProgressBar pct={streakPct} style={styles.streakBar} />
          <View style={styles.streakFooter}>
            <Text style={styles.streakLeft}>{streakDays} / {streakGoal} días meta</Text>
            <Text style={styles.streakRight}>{streakPct}%</Text>
          </View>
        </TouchableOpacity>

        {/* Stats reales */}
        <View style={styles.statsRow}>
          <StatCard
            num={String(totalSessions)}
            label="Sesiones totales"
            onPress={() => nav.navigate('Progress' as any)}
            style={styles.statHalf}
          />
          <StatCard
            num={totalKcal.toLocaleString()}
            label="Calorías quemadas"
            color={C.acc3}
            onPress={() => nav.navigate('Progress' as any)}
            style={styles.statHalf}
          />
        </View>

        {/* Rutina de hoy */}
        <SectionHeader title="Rutina de hoy" actionLabel="Ver todas" onAction={() => nav.navigate('Routines' as any)} />
        <Card onPress={() => nav.navigate('RoutineDetail', { routineId: todayRoutine.id })} style={styles.routineCard}>
          <View style={styles.routineHeader}>
            <View style={styles.routineIconWrap}>
              <Text style={styles.routineEmoji}>{todayRoutine.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.routineName}>{todayRoutine.name}</Text>
              <Text style={styles.routineMeta}>{total} ejercicios · {todayRoutine.durationMin} min</Text>
            </View>
            <Badge label="HOY" type="lime" />
          </View>
          <ProgressBar pct={donePct} style={{ marginTop: 14 }} />
          <Text style={styles.routineProgress}>
            {done} de {total} ejercicios completados
          </Text>
        </Card>

        {/* Ejercicios populares */}
        <SectionHeader title="Ejercicios populares" actionLabel="Ver más" onAction={() => nav.navigate('Explore' as any)} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {exercises.slice(0, 4).map(ex => (
            <Card key={ex.id} onPress={() => nav.navigate('ExerciseDetail', { exerciseId: ex.id })} style={styles.exCard}>
              <Text style={styles.exEmoji}>{ex.emoji}</Text>
              <Text style={styles.exName}>{ex.name}</Text>
              <Badge label={ex.muscleGroup} type={MUSCLE_BADGE[ex.muscleGroup]} />
            </Card>
          ))}
        </ScrollView>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  greeting: { fontSize: 13, color: C.muted, fontWeight: '500' },
  name: { fontSize: 28, fontWeight: '900', color: C.text, letterSpacing: 1 },
  avatarBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: C.acc3, alignItems: 'center', justifyContent: 'center' },
  avatarEmoji: { fontSize: 18 },

  streakBanner: { backgroundColor: C.acc, borderRadius: 18, padding: 18, marginBottom: 14, overflow: 'hidden' },
  bannerGlow: { position: 'absolute', right: -20, top: -20, width: 120, height: 120, backgroundColor: '#00000015', borderRadius: 60 },
  streakRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  streakFlame: { fontSize: 32 },
  streakTitle: { fontSize: 24, fontWeight: '900', color: C.bg, lineHeight: 26 },
  streakSub: { fontSize: 13, color: '#0c0c0f99', fontWeight: '500' },
  streakBar: { backgroundColor: '#00000020' },
  streakFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  streakLeft: { fontSize: 11, color: '#0c0c0f80', fontWeight: '600' },
  streakRight: { fontSize: 11, color: C.bg, fontWeight: '700' },

  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statHalf: { flex: 1 },

  routineCard: { padding: 18, marginBottom: 20 },
  routineHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  routineIconWrap: { width: 46, height: 46, backgroundColor: '#e8ff4718', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  routineEmoji: { fontSize: 22 },
  routineName: { fontWeight: '700', fontSize: 15, color: C.text, marginBottom: 2 },
  routineMeta: { fontSize: 12, color: C.muted },
  routineProgress: { fontSize: 12, color: C.muted, marginTop: 6 },

  horizontalList: { gap: 12, paddingRight: 16 },
  exCard: { width: 150, padding: 14 },
  exEmoji: { fontSize: 32, marginBottom: 10 },
  exName: { fontWeight: '600', fontSize: 14, color: C.text, marginBottom: 6 },
});
