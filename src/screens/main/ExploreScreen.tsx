import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useApp, C, MuscleGroup, MUSCLE_BADGE } from '../../context/AppContext';
import { Badge, Card, UCTag } from '../../components/UI';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const MUSCLES: (MuscleGroup | 'Todos')[] = ['Todos','Pecho','Espalda','Piernas','Hombros','Bíceps','Tríceps','Core'];

export default function ExploreScreen() {
  const nav = useNavigation<Nav>();
  const { exercises } = useApp();

  const [query,  setQuery]  = useState('');
  const [active, setActive] = useState<string>('Todos');

  const filtered = exercises.filter(ex => {
    const matchMuscle = active === 'Todos' || ex.muscleGroup === active;
    const matchQuery  = ex.name.toLowerCase().includes(query.toLowerCase());
    return matchMuscle && matchQuery;
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <UCTag label="UC-01 · UC-02 Explorar / Buscar" />
        <Text style={styles.title}>EJERCICIOS</Text>

        {/* Search */}
        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={18} color={C.muted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={query} onChangeText={setQuery}
            placeholder="Buscar ejercicio con mancuerna..."
            placeholderTextColor={C.muted}
          />
        </View>

        {/* Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {MUSCLES.map(m => (
            <TouchableOpacity
              key={m}
              onPress={() => setActive(m)}
              style={[styles.chip, active === m && styles.chipActive]}
            >
              <Text style={[styles.chipText, active === m && styles.chipTextActive]}>{m}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Exercise list */}
        <View style={styles.list}>
          {filtered.map(ex => (
            <Card key={ex.id} onPress={() => nav.navigate('ExerciseDetail', { exerciseId: ex.id })} style={styles.exRow}>
              <View style={styles.exIcon}>
                <Text style={styles.exEmoji}>{ex.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.exName}>{ex.name}</Text>
                <Text style={styles.exSub}>{ex.muscleGroup} · {ex.difficulty}</Text>
              </View>
              <Badge label={ex.muscleGroup} type={MUSCLE_BADGE[ex.muscleGroup]} />
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: C.bg },
  scroll:  { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },

  title: { fontSize: 32, fontWeight: '900', color: C.text, letterSpacing: 1, marginBottom: 14 },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.s2, borderRadius: 14,
    borderWidth: 1.5, borderColor: C.border, marginBottom: 14,
  },
  searchIcon:  { paddingHorizontal: 14 },
  searchInput: { flex: 1, color: C.text, paddingVertical: 13, fontSize: 14 },

  chips: { gap: 8, marginBottom: 18 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 100,
    backgroundColor: C.s3, borderWidth: 1.5, borderColor: 'transparent',
  },
  chipActive:     { backgroundColor: '#e8ff4718', borderColor: '#e8ff4740' },
  chipText:       { fontSize: 13, color: C.text, fontWeight: '500' },
  chipTextActive: { color: C.acc },

  list: { gap: 10 },
  exRow: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14 },
  exIcon: { width: 52, height: 52, backgroundColor: '#e8ff4718', borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  exEmoji: { fontSize: 26 },
  exName:  { fontWeight: '600', fontSize: 15, color: C.text, marginBottom: 3 },
  exSub:   { fontSize: 12, color: C.muted },
});
