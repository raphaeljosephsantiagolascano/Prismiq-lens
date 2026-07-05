import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../state/AppContext';
import { Background } from './Background';
import { BottomNav } from './BottomNav';
import { LensDots, LensWheel } from './LensWheel';
import { ScreenRouter } from './ScreenRouter';
import { SettingsSheet } from './SettingsSheet';
import { HomeHeader, LensHeroTitle } from './Shared';
import { Welcome } from './Welcome';

export function AppShell() {
  const { state, lens, theme } = useApp();
  const insets = useSafeAreaInsets();
  const isHomeTab = state.tab === lens.tabs[0].id;
  const scrollRef = useRef<ScrollView>(null);
  // reset scroll to top when the screen changes (the wheel stays mounted so it can glide)
  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [state.tab, lens.id]);

  return (
    <View style={{ flex: 1 }}>
      <Background />
      <StatusBar style={theme.dark ? 'light' : 'dark'} />

      {state.welcome ? (
        <View style={{ flex: 1, paddingTop: insets.top }}>
          <Welcome />
        </View>
      ) : (
        <>
          <ScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: insets.top + 14,
              paddingHorizontal: 20,
              paddingBottom: 122 + insets.bottom,
            }}
          >
            {/* header + wheel persist across lens switches so the wheel can glide */}
            {isHomeTab && (
              <Animated.View entering={FadeIn.duration(300)}>
                <HomeHeader />
                <LensWheel />
                <LensDots />
              </Animated.View>
            )}
            {/* the hero copy + screen content crossfade on every lens/tab change */}
            <Animated.View key={`${lens.id}-${state.tab}`} entering={FadeIn.duration(320)}>
              {isHomeTab && <LensHeroTitle />}
              <ScreenRouter />
            </Animated.View>
          </ScrollView>

          <View style={{ position: 'absolute', bottom: 16 + insets.bottom, left: 16, right: 16 }}>
            <BottomNav />
          </View>

          {state.showSettings && <SettingsSheet />}
        </>
      )}
    </View>
  );
}
