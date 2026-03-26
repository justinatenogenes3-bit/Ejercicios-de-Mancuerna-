import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { C, BADGE_COLORS, BadgeType } from '../context/AppContext';

// ─── BADGE ────────────────────────────────────────────────────────────────────
export const Badge = ({ label, type = 'lime' }: { label: string; type?: BadgeType }) => {
  const { bg, color } = BADGE_COLORS[type];
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
};

// ─── PRIMARY BUTTON ───────────────────────────────────────────────────────────
interface BtnProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'ghost' | 'accent';
  style?: object;
}
export const PrimaryButton = ({ label, onPress, loading, disabled, variant = 'primary', style }: BtnProps) => {
  const btnStyle = variant === 'ghost'
    ? [styles.btn, styles.btnGhost, style]
    : variant === 'accent'
    ? [styles.btn, styles.btnAccent, style]
    : [styles.btn, styles.btnPrimary, style];

  const textStyle = variant === 'ghost' ? styles.btnTextGhost
    : variant === 'accent' ? styles.btnTextAccent
    : styles.btnTextPrimary;

  return (
    <TouchableOpacity
      style={[btnStyle, (disabled || loading) && { opacity: 0.6 }]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.82}
    >
      {loading
        ? <ActivityIndicator color={variant === 'primary' ? C.bg : C.acc} />
        : <Text style={textStyle}>{label}</Text>
      }
    </TouchableOpacity>
  );
};

// ─── CARD ─────────────────────────────────────────────────────────────────────
export const Card = ({ children, style, onPress }: { children: React.ReactNode; style?: object; onPress?: () => void }) => {
  if (onPress) {
    return (
      <TouchableOpacity style={[styles.card, style]} onPress={onPress} activeOpacity={0.8}>
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={[styles.card, style]}>{children}</View>;
};

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
export const ProgressBar = ({ pct, style }: { pct: number; style?: object }) => (
  <View style={[styles.progressTrack, style]}>
    <View style={[styles.progressFill, { width: `${Math.min(pct, 100)}%` as any }]} />
  </View>
);

// ─── SECTION HEADER ───────────────────────────────────────────────────────────
export const SectionHeader = ({
  title, actionLabel, onAction,
}: { title: string; actionLabel?: string; onAction?: () => void }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {actionLabel && (
      <TouchableOpacity onPress={onAction}>
        <Text style={styles.sectionAction}>{actionLabel}</Text>
      </TouchableOpacity>
    )}
  </View>
);

// ─── UC TAG ───────────────────────────────────────────────────────────────────
export const UCTag = ({ label }: { label: string }) => (
  <View style={styles.ucTag}>
    <Text style={styles.ucText}>{label}</Text>
  </View>
);

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────
export const EmptyState = ({ emoji = '🏋️', message }: { emoji?: string; message: string }) => (
  <View style={styles.empty}>
    <Text style={styles.emptyEmoji}>{emoji}</Text>
    <Text style={styles.emptyText}>{message}</Text>
  </View>
);

// ─── STAT CARD ────────────────────────────────────────────────────────────────
export const StatCard = ({
  num, label, color = C.acc, onPress, style,
}: { num: string; label: string; color?: string; onPress?: () => void; style?: object }) => {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper style={[styles.statCard, style]} onPress={onPress} activeOpacity={0.8}>
      <Text style={[styles.statNum, { color }]}>{num}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Wrapper>
  );
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: 100, alignSelf: 'flex-start',
  },
  badgeText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },

  btn: {
    width: '100%', borderRadius: 14,
    paddingVertical: 15, alignItems: 'center', justifyContent: 'center',
  },
  btnPrimary: { backgroundColor: C.acc },
  btnGhost: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: C.border },
  btnAccent: { backgroundColor: C.s3, borderWidth: 1.5, borderColor: C.acc },
  btnTextPrimary: { color: C.bg, fontWeight: '700', fontSize: 16 },
  btnTextGhost:   { color: C.text, fontWeight: '500', fontSize: 15 },
  btnTextAccent:  { color: C.acc,  fontWeight: '700', fontSize: 16 },

  card: {
    backgroundColor: C.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
  },

  progressTrack: { height: 6, backgroundColor: C.s3, borderRadius: 100, overflow: 'hidden' },
  progressFill: {
    height: '100%', borderRadius: 100,
    backgroundColor: C.acc3,
    // gradient effect approximated with acc color on right side
  },

  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12,
  },
  sectionTitle: { fontSize: 12, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', color: C.muted },
  sectionAction: { fontSize: 13, color: C.acc, fontWeight: '600' },

  ucTag: {
    backgroundColor: '#e8ff4712',
    borderWidth: 1, borderColor: '#e8ff4730',
    borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3,
    alignSelf: 'flex-start', marginBottom: 8,
  },
  ucText: { fontSize: 9, fontWeight: '700', letterSpacing: 1, color: C.acc },

  empty: { alignItems: 'center', paddingVertical: 48 },
  emptyEmoji: { fontSize: 44, marginBottom: 12 },
  emptyText: { color: C.muted, fontSize: 15, textAlign: 'center' },

  statCard: {
    backgroundColor: C.card, borderRadius: 16,
    borderWidth: 1, borderColor: C.border, padding: 16,
  },
  statNum: { fontSize: 34, fontWeight: '800', letterSpacing: 0.5, lineHeight: 36 },
  statLabel: { fontSize: 12, color: C.muted, marginTop: 2 },
});
