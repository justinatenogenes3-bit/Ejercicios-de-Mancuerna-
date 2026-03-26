import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useApp, C } from '../../context/AppContext';
import { PrimaryButton, UCTag } from '../../components/UI';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Nav   = NativeStackNavigationProp<RootStackParamList, 'Completed'>;
type Route = RouteProp<RootStackParamList, 'Completed'>;

export default function CompletedScreen() {
  const nav   = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { routines, addSession } = useApp();

  const routine = routines.find(r => r.id === route.params.routineId) ?? routines[0];
  const dur     = route.params.durationMin;
  const kcal    = Math.round(dur * 6.5);
  const series  = routine.exercises.reduce((acc, e) => acc + e.sets, 0);

  // Guardar sesión automáticamente al llegar a esta pantalla
  useEffect(() => {
    addSession({
      routineId:    routine.id,
      routineName:  routine.name,
      durationMin:  dur,
      kcal,
      totalSeries:  series,
      completedAt:  new Date().toISOString(),
    });
  }, []); // solo una vez

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Glow */}
        <View style={styles.glow} />

        {/* Trophy */}
        <Text style={styles.trophy}>🏆</Text>
        <UCTag label="UC-11 Completar rutina · «extend» UC-15" />
        <Text style={styles.title}>¡RUTINA{'\n'}<Text style={styles.titleAcc}>COMPLETADA!</Text></Text>
        <Text style={styles.subtitle}>
          {routine.name.includes('—')
            ? routine.name.split('—')[1].trim()
            : routine.name} · {dur} minutos
        </Text>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          {[
            [String(routine.exercises.length), 'Ejercicios', C.acc],
            [String(series),                   'Series totales', C.acc],
            [String(kcal),                     'kcal quemadas', C.acc2],
            [String(dur),                      'Minutos', C.acc3],
          ].map(([n, l, c]) => (
            <View key={l} style={styles.statBox}>
              <Text style={[styles.statNum, { color: c as string }]}>{n}</Text>
              <Text style={styles.statLabel}>{l}</Text>
            </View>
          ))}
        </View>

        {/* Achievement banner */}
        <View style={styles.achieveCard}>
          <Text style={styles.achieveEmoji}>🥇</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.achieveTag}>¡Sesión guardada!</Text>
            <Text style={styles.achieveName}>Semana de Hierro</Text>
            <Text style={styles.achieveSub}>Sesión registrada en tu progreso</Text>
          </View>
        </View>

        <View style={styles.btnGroup}>
          <PrimaryButton
            label="Ver mi progreso →"
            onPress={() => nav.navigate('Progress' as any)}
          />
          <View style={{ height: 12 }} />
          <PrimaryButton
            label="Volver al inicio"
            variant="ghost"
            onPress={() => nav.navigate('MainTabs' as any)}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  content: { alignItems: 'center', padding: 24, paddingBottom: 40 },

  glow: { position: 'absolute', width: 400, height: 400, borderRadius: 200, backgroundColor: '#e8ff4710', top: 100 },

  trophy: { fontSize: 72, marginBottom: 12, marginTop: 20 },
  title: { fontSize: 44, fontWeight: '900', color: C.text, textAlign: 'center', lineHeight: 46, marginTop: 8, marginBottom: 8 },
  titleAcc: { color: C.acc },
  subtitle: { color: C.muted, fontSize: 14, marginBottom: 28, textAlign: 'center' },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, width: '100%', marginBottom: 20 },
  statBox: { width: '47%', backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 16 },
  statNum: { fontSize: 34, fontWeight: '900', lineHeight: 36 },
  statLabel: { fontSize: 12, color: C.muted, marginTop: 2 },

  achieveCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#e8ff4710', borderWidth: 1, borderColor: '#e8ff4730', borderRadius: 16, padding: 16, width: '100%', marginBottom: 24 },
  achieveEmoji: { fontSize: 28 },
  achieveTag: { fontSize: 10, color: C.acc, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 },
  achieveName: { fontWeight: '700', fontSize: 14, color: C.text },
  achieveSub: { fontSize: 12, color: C.muted },

  btnGroup: { width: '100%' },
});
