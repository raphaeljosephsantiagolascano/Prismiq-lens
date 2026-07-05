import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View } from 'react-native';
import { Icon, UI, tabXml } from '../lib/icons';
import { useApp } from '../state/AppContext';
import { Press, Txt } from './ui';

export function BottomNav() {
  const { state, lens, goTab, theme } = useApp();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingVertical: 9,
        paddingHorizontal: 10,
        borderRadius: 26,
        backgroundColor: theme.dark ? 'rgba(32,35,44,.92)' : 'rgba(255,255,255,.9)',
        borderWidth: 1,
        borderColor: theme.hair,
        shadowColor: '#000',
        shadowOpacity: 0.28,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 14 },
        elevation: 16,
      }}
    >
      {lens.tabs.map((t) => {
        if (t.center) {
          return (
            <Press
              key="scan"
              onPress={() => goTab('scan')}
              style={{ marginTop: -26, width: 58, flexGrow: 0, flexShrink: 0, alignItems: 'center' }}
            >
              <LinearGradient
                colors={lens.btnColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 29,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: lens.glow,
                  shadowOpacity: 0.7,
                  shadowRadius: 14,
                  shadowOffset: { width: 0, height: 12 },
                  elevation: 8,
                }}
              >
                <Icon xml={UI.camera} size={26} color="#fff" />
              </LinearGradient>
            </Press>
          );
        }
        const active = state.tab === t.id || (t.id === 'scan' && state.tab === 'result');
        const color = active ? lens.accent : theme.ink(0.42);
        return (
          <Press key={t.id} haptic={false} onPress={() => goTab(t.id)} style={{ flex: 1, alignItems: 'center', paddingVertical: 4, paddingHorizontal: 6 }}>
            <Icon xml={tabXml(t.id)} size={22} color={color} />
            <Txt style={{ marginTop: 3, fontSize: 9.5, fontWeight: 600, letterSpacing: 0.2, color }}>{t.label}</Txt>
          </Press>
        );
      })}
    </View>
  );
}
