import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp, C, CALENDAR_DATA } from '../../context/AppContext';
import { Badge, Card, ProgressBar, UCTag } from '../../components/UI';

const MUSCLES = [
  { name: 'Pecho',   pct: 78 },
  { name: 'Espalda', pct: 65 },
  { name: 'Piernas', pct: 50 },
  { name: 'Hombros', pct: 42 },
  { name: 'Bíceps',  pct: 35 },
];

export default function ProgressScreen() {
  const { sessions, achievements, streakDays, totalSessions, totalKcal, weekMinutes } = useApp();

  // Últimas 5 sesiones
  const recent = sessions.slice(0, 5);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <UCTag label="UC-14 Ver progreso · UC-15 · UC-16 · UC-17" />
        <Text style={styles.title}>MI PROGRESO</Text>

        {/* Stats reales */}
        <View style={styles.statsRow}>
          {[
            [String(totalSessions),  'Sesiones',    C.acc ],
            [`${streakDays}🔥`,       'Racha',        C.acc2],
            [`${weekMinutes}min`,     'Esta semana',  C.acc3],
          ].map(([n, l, c]) => (
            <Card key={l} style={styles.statCard}>
              <Text style={[styles.statNum, { color: c as string }]}>{n}</Text>
              <Text style={styles.statLabel}>{l}</Text>
            </Card>
          ))}
        </View>

        {/* Historial de sesiones */}
        <Text style={styles.sectionLabel}>Sesiones recientes</Text>
        {recent.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>Aún no tienes sesiones. ¡Completa tu primera rutina!</Text>
          </Card>
        ) : (
          recent.map(s => (
            <Card key={s.id} style={styles.sessionCard}>
              <View style={styles.sessionRow}>
                <View style={styles.sessionIcon}>
                  <Text style={{ fontSize: 20 }}>💪</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sessionName}>{s.routineName}</Text>
                  <Text style={styles.sessionMeta}>
                    {s.durationMin} min · {s.kcal} kcal · {s.totalSeries} series
                  </Text>
                </View>
                <Text style={styles.sessionDate}>
                  {new Date(s.completedAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}
                </Text>
              </View>
            </Card>
          ))
        )}

        {/* Calendario UC-17 */}
        <Text style={styles.sectionLabel}>Calendario — UC-17</Text>
        <Card style={styles.calCard}>
          <View style={styles.calHeader}>
            <Text style={styles.calMonth}>Marzo 2026</Text>
          </View>
          <View style={styles.dayLabels}>
            {['L','M','X','J','V','S','D'].map(d => (
              <Text key={d} style={styles.dayLabel}>{d}</Text>
            ))}
          </View>
          <View style={styles.calGrid}>
            {CALENDAR_DATA.map((day: any, i) => (
              <View key={i} style={[
                styles.calDay,
                day?.done  && styles.calDone,
                day?.rest  && styles.calRest,
                day?.today && styles.calToday,
                !day && { backgroundColor: 'transparent' },
              ]}>
                <Text style={[
                  styles.calDayText,
                  day?.done  && { color: C.bg },
                  day?.today && { color: C.acc },
                  day?.rest  && { color: C.muted },
                  !day && { color: 'transparent' },
                ]}>
                  {day?.d ?? '·'}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.calLegend}>
            {([['Entreno', C.acc, false], ['Descanso', C.s2, false], ['Hoy', 'transparent', true]] as any[]).map(([l, bg, border]) => (
              <View key={l} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: bg, borderWidth: border ? 2 : 0, borderColor: C.acc }]} />
                <Text style={styles.legendLabel}>{l}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Progreso muscular UC-15 */}
        <Text style={styles.sectionLabel}>Progreso muscular — UC-15</Text>
        <Card style={styles.muscleCard}>
          {MUSCLES.map(m => (
            <View key={m.name} style={styles.muscleRow}>
              <Text style={styles.muscleName}>{m.name}</Text>
              <View style={{ flex: 1 }}><ProgressBar pct={m.pct} /></View>
              <Text style={styles.musclePct}>{m.pct}%</Text>
            </View>
          ))}
        </Card>

        {/* Logros UC-16 */}
        <Text style={styles.sectionLabel}>Logros — UC-16</Text>
        {achievements.map(a => (
          <Card key={a.id} style={[styles.achieveCard, !a.unlocked && { opacity: 0.4 }]}>
            <View style={[styles.achieveIcon, { backgroundColor: a.unlocked ? '#e8ff4718' : C.s2 }]}>
              <Text style={styles.achieveEmoji}>{a.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.achieveName}>{a.name}</Text>
              <Text style={styles.achieveSub}>{a.description}</Text>
              {a.progress !== undefined && !a.unlocked && (
                <View style={{ marginTop: 6 }}>
                  <ProgressBar pct={(a.progress! / a.goal!) * 100} />
                  <Text style={[styles.achieveSub, { marginTop: 3 }]}>{a.progress}/{a.goal}</Text>
                </View>
              )}
            </View>
            <Badge label={a.unlocked ? 'Obtenido' : `${a.progress}/${a.goal}`} type={a.unlocked ? 'lime' : 'muted'} />
          </Card>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },

  title: { fontSize: 32, fontWeight: '900', color: C.text, letterSpacing: 1, marginBottom: 18 },
  sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', color: C.muted, marginBottom: 10, marginTop: 4 },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: { flex: 1, padding: 12 },
  statNum: { fontSize: 22, fontWeight: '900', lineHeight: 24 },
  statLabel: { fontSize: 11, color: C.muted, marginTop: 2 },

  emptyCard: { padding: 20, alignItems: 'center', marginBottom: 16 },
  emptyText: { color: C.muted, fontSize: 13, textAlign: 'center' },

  sessionCard: { padding: 14, marginBottom: 8 },
  sessionRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sessionIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#e8ff4718', alignItems: 'center', justifyContent: 'center' },
  sessionName: { fontWeight: '700', fontSize: 14, color: C.text },
  sessionMeta: { fontSize: 12, color: C.muted, marginTop: 2 },
  sessionDate: { fontSize: 11, color: C.muted },

  calCard: { padding: 16, marginBottom: 16 },
  calHeader: { marginBottom: 10 },
  calMonth: { fontWeight: '700', fontSize: 14, color: C.text },
  dayLabels: { flexDirection: 'row', marginBottom: 6 },
  dayLabel: { flex: 1, textAlign: 'center', fontSize: 10, color: C.muted, fontWeight: '600' },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calDay: { width: `${100 / 7}%`, aspectRatio: 1, borderRadius: 6, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  calDayText: { fontSize: 11, fontWeight: '600', color: C.text },
  calDone: { backgroundColor: C.acc },
  calRest: { backgroundColor: C.s2 },
  calToday: { borderWidth: 2, borderColor: C.acc },
  calLegend: { flexDirection: 'row', gap: 14, marginTop: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 3 },
  legendLabel: { fontSize: 11, color: C.muted },

  muscleCard: { padding: 16, marginBottom: 16 },
  muscleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  muscleName: { width: 80, fontSize: 13, fontWeight: '500', color: C.text },
  musclePct: { fontSize: 12, color: C.muted, width: 36, textAlign: 'right' },

  achieveCard: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, marginBottom: 10 },
  achieveIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  achieveEmoji: { fontSize: 24 },
  achieveName: { fontWeight: '700', fontSize: 14, color: C.text },
  achieveSub: { fontSize: 12, color: C.muted },
});
