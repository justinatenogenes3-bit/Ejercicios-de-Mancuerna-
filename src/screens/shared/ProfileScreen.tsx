import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp, C } from '../../context/AppContext';
import { Badge, Card, PrimaryButton } from '../../components/UI';

const AVATARS = ['👤','💪','🏋️','🦁','🐺','⚡','🔥','🎯'];

export default function ProfileScreen() {
  const nav = useNavigation();
  const { currentUser, logout, sessions, updateUser, totalSessions, totalKcal } = useApp();

  const [editing,  setEditing]  = useState(false);
  const [name,     setName]     = useState(currentUser?.name     ?? '');
  const [email,    setEmail]    = useState(currentUser?.email    ?? '');
  const [weightKg, setWeightKg] = useState(String(currentUser?.weightKg ?? ''));
  const [heightCm, setHeightCm] = useState(String(currentUser?.heightCm ?? ''));
  const [avatar,   setAvatar]   = useState(currentUser?.avatarEmoji ?? '👤');
  const [showAvatars, setShowAvatars] = useState(false);

  const imc = currentUser?.weightKg && currentUser?.heightCm
    ? (currentUser.weightKg / Math.pow(currentUser.heightCm / 100, 2)).toFixed(1)
    : '—';

  const handleSave = () => {
    if (!name.trim()) { Alert.alert('Error', 'El nombre no puede estar vacío'); return; }
    updateUser({
      name: name.trim(),
      email: email.trim(),
      weightKg: parseFloat(weightKg) || currentUser?.weightKg,
      heightCm: parseFloat(heightCm) || currentUser?.heightCm,
      avatarEmoji: avatar,
    });
    setEditing(false);
    Alert.alert('✅ Guardado', 'Tu perfil ha sido actualizado.');
  };

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Deseas cerrar tu sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: logout },
    ]);
  };

  const MENU = [
    { icon: 'notifications-outline' as const, label: 'Notificaciones', onPress: () => Alert.alert('Notificaciones', 'Activadas ✅') },
    { icon: 'lock-closed-outline'   as const, label: 'Cambiar contraseña', onPress: () => Alert.alert('Contraseña', 'Función disponible en versión Pro') },
    { icon: 'help-circle-outline'   as const, label: 'Ayuda y soporte', onPress: () => Alert.alert('Soporte', 'Escríbenos a soporte@repforce.app') },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.topRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => nav.goBack()}>
            <Ionicons name="arrow-back" size={20} color={C.text} />
          </TouchableOpacity>
          <Text style={styles.title}>MI PERFIL</Text>
          <TouchableOpacity style={styles.editBtn} onPress={() => editing ? handleSave() : setEditing(true)}>
            <Ionicons name={editing ? 'checkmark' : 'pencil'} size={18} color={editing ? C.acc : C.muted} />
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={() => editing && setShowAvatars(!showAvatars)}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarEmoji}>{avatar}</Text>
              {editing && (
                <View style={styles.avatarEditBadge}>
                  <Ionicons name="camera" size={10} color={C.bg} />
                </View>
              )}
            </View>
          </TouchableOpacity>
          {showAvatars && (
            <View style={styles.avatarPicker}>
              {AVATARS.map(a => (
                <TouchableOpacity key={a} style={[styles.avatarOption, a === avatar && styles.avatarOptionActive]} onPress={() => { setAvatar(a); setShowAvatars(false); }}>
                  <Text style={{ fontSize: 22 }}>{a}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Info card */}
        <Card style={styles.infoCard}>
          {editing ? (
            <>
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>NOMBRE</Text>
                <TextInput style={styles.fieldInput} value={name} onChangeText={setName} placeholderTextColor={C.muted} />
              </View>
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>EMAIL</Text>
                <TextInput style={styles.fieldInput} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholderTextColor={C.muted} />
              </View>
            </>
          ) : (
            <>
              <Text style={styles.userName}>{currentUser?.name}</Text>
              <Text style={styles.userEmail}>{currentUser?.email}</Text>
            </>
          )}
          <View style={{ marginTop: 8 }}>
            <Badge label={currentUser?.plan === 'pro' ? 'PRO' : 'FREE'} type="lime" />
          </View>
        </Card>

        {/* Body stats */}
        <View style={styles.statsRow}>
          {editing ? (
            <>
              <View style={styles.statEditBox}>
                <Text style={styles.statLabel}>Peso (kg)</Text>
                <TextInput style={styles.statInput} value={weightKg} onChangeText={setWeightKg} keyboardType="numeric" placeholderTextColor={C.muted} />
              </View>
              <View style={styles.statEditBox}>
                <Text style={styles.statLabel}>Altura (cm)</Text>
                <TextInput style={styles.statInput} value={heightCm} onChangeText={setHeightCm} keyboardType="numeric" placeholderTextColor={C.muted} />
              </View>
              <View style={styles.statBox}>
                <Text style={[styles.statNum, { color: C.acc2 }]}>{imc}</Text>
                <Text style={styles.statLabel}>IMC</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.statBox}>
                <Text style={[styles.statNum, { color: C.acc }]}>{currentUser?.weightKg ?? '—'}</Text>
                <Text style={styles.statLabel}>kg</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={[styles.statNum, { color: C.acc }]}>{currentUser?.heightCm ?? '—'}</Text>
                <Text style={styles.statLabel}>cm</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={[styles.statNum, { color: C.acc2 }]}>{imc}</Text>
                <Text style={styles.statLabel}>IMC</Text>
              </View>
            </>
          )}
        </View>

        {editing && (
          <PrimaryButton label="Guardar cambios" onPress={handleSave} style={{ marginBottom: 16 }} />
        )}

        {/* Activity summary */}
        <Card style={styles.activityCard}>
          <View style={styles.activityRow}>
            <View style={styles.activityItem}>
              <Text style={styles.activityNum}>{totalSessions}</Text>
              <Text style={styles.activityLabel}>Sesiones</Text>
            </View>
            <View style={styles.activityDivider} />
            <View style={styles.activityItem}>
              <Text style={styles.activityNum}>{totalKcal.toLocaleString()}</Text>
              <Text style={styles.activityLabel}>kcal totales</Text>
            </View>
            <View style={styles.activityDivider} />
            <View style={styles.activityItem}>
              <Text style={styles.activityNum}>{sessions.length > 0 ? Math.round(sessions.reduce((a,s)=>a+s.durationMin,0)/sessions.length) : 0}</Text>
              <Text style={styles.activityLabel}>min/sesión</Text>
            </View>
          </View>
        </Card>

        {/* Menu */}
        <View style={styles.menu}>
          {MENU.map(item => (
            <TouchableOpacity key={item.label} style={styles.menuItem} onPress={item.onPress} activeOpacity={0.7}>
              <View style={styles.menuLeft}>
                <Ionicons name={item.icon} size={18} color={C.text} />
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={C.muted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color={C.acc2} />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },

  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  backBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: C.s2, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '900', color: C.text, letterSpacing: 1 },
  editBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: C.s2, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },

  avatarSection: { alignItems: 'center', marginBottom: 20 },
  avatarCircle: { width: 80, height: 80, borderRadius: 24, backgroundColor: C.acc3, alignItems: 'center', justifyContent: 'center' },
  avatarEmoji: { fontSize: 38 },
  avatarEditBadge: { position: 'absolute', bottom: -4, right: -4, width: 22, height: 22, borderRadius: 11, backgroundColor: C.acc, alignItems: 'center', justifyContent: 'center' },
  avatarPicker: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12, justifyContent: 'center' },
  avatarOption: { width: 48, height: 48, borderRadius: 14, backgroundColor: C.s2, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  avatarOptionActive: { borderColor: C.acc, borderWidth: 2 },

  infoCard: { padding: 18, marginBottom: 14 },
  fieldRow: { marginBottom: 12 },
  fieldLabel: { fontSize: 10, color: C.muted, fontWeight: '700', letterSpacing: 1.5, marginBottom: 6 },
  fieldInput: { color: C.text, fontSize: 15, borderBottomWidth: 1, borderBottomColor: C.border, paddingBottom: 6 },
  userName: { fontWeight: '700', fontSize: 18, color: C.text },
  userEmail: { fontSize: 13, color: C.muted, marginTop: 2 },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  statBox: { flex: 1, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 12, alignItems: 'center' },
  statEditBox: { flex: 1, backgroundColor: C.s2, borderRadius: 12, padding: 12 },
  statNum: { fontSize: 22, fontWeight: '900', lineHeight: 24 },
  statLabel: { fontSize: 11, color: C.muted, marginTop: 2 },
  statInput: { color: C.text, fontSize: 20, fontWeight: '900', textAlign: 'center', padding: 0 },

  activityCard: { padding: 16, marginBottom: 16 },
  activityRow: { flexDirection: 'row', alignItems: 'center' },
  activityItem: { flex: 1, alignItems: 'center' },
  activityNum: { fontSize: 20, fontWeight: '900', color: C.acc },
  activityLabel: { fontSize: 11, color: C.muted, marginTop: 2 },
  activityDivider: { width: 1, height: 40, backgroundColor: C.border },

  menu: { gap: 8, marginBottom: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 14, padding: 16 },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuLabel: { fontWeight: '500', fontSize: 14, color: C.text },

  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 14, borderWidth: 1.5, borderColor: '#ff4d6d40' },
  logoutText: { color: C.acc2, fontWeight: '600', fontSize: 15 },
});
