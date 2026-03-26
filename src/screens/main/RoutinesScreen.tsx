import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useApp, C } from '../../context/AppContext';
import { Badge, Card, ProgressBar, UCTag } from '../../components/UI';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function RoutinesScreen() {
  const nav = useNavigation<Nav>();
  const { routines, exercises } = useApp();
  const [tab, setTab] = useState<'mis' | 'catalogo'>('mis');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <UCTag label="UC-10 Seleccionar rutina" />
        <Text style={styles.title}>MIS RUTINAS</Text>
        <Text style={styles.subtitle}>Elige tu entrenamiento de hoy</Text>

        {/* Tabs */}
        <View style={styles.tabRow}>
          {(['mis', 'catalogo'] as const).map(t => (
            <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t === 'mis' ? 'Mis rutinas' : 'Catálogo'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.list}>
          {routines.map((routine, idx) => {
            const done  = routine.exercises.filter(e => e.done).length;
            const total = routine.exercises.length;
            const pct   = total > 0 ? (done / total) * 100 : 0;
            const isToday = idx === 0;
            const colors = ['#e8ff4718', '#7c6aff18', '#ff4d6d18'];

            return (
              <Card key={routine.id} onPress={() => nav.navigate('RoutineDetail', { routineId: routine.id })} style={styles.card}>
                {isToday && (
                  <View style={styles.todayTag}><Badge label="HOY" type="lime" /></View>
                )}

                <View style={styles.cardHeader}>
                  <View style={[styles.iconWrap, { backgroundColor: colors[idx % 3] }]}>
                    <Text style={styles.emoji}>{routine.emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.routineName}>{routine.name}</Text>
                    <Text style={styles.routineMeta}>{total} ejercicios · ~{routine.durationMin} min</Text>
                  </View>
                </View>

                {done > 0 || isToday ? (
                  <>
                    <ProgressBar pct={pct} style={{ marginTop: 4 }} />
                    <Text style={styles.progressText}>
                      {done === total && total > 0 ? '✅ Completada' : `${done} / ${total} completados`}
                    </Text>
                  </>
                ) : (
                  <Badge
                    label={idx === 1 ? 'Mañana' : 'Pendiente'}
                    type={idx === 1 ? 'violet' : 'muted'}
                  />
                )}
              </Card>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },

  title: { fontSize: 32, fontWeight: '900', color: C.text, letterSpacing: 1, marginBottom: 4 },
  subtitle: { fontSize: 13, color: C.muted, marginBottom: 16 },

  tabRow: { flexDirection: 'row', backgroundColor: C.s2, borderRadius: 12, padding: 4, marginBottom: 18, gap: 4 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 9, alignItems: 'center' },
  tabActive: { backgroundColor: C.s3 },
  tabText: { fontSize: 13, color: C.muted, fontWeight: '500' },
  tabTextActive: { color: C.text, fontWeight: '600' },

  list: { gap: 12 },
  card: { padding: 16 },
  todayTag: { position: 'absolute', top: 14, right: 14, zIndex: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  iconWrap: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 22 },
  routineName: { fontWeight: '700', fontSize: 15, color: C.text, marginBottom: 2 },
  routineMeta: { fontSize: 12, color: C.muted },
  progressText: { fontSize: 12, color: C.muted, marginTop: 5 },
});
