import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useRef, useState } from 'react';
import { Modal, View } from 'react-native';
import { ensureBase64 } from '../lib/imageData';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { CapturedImage } from '../lib/analyze';
import { Icon, UI } from '../lib/icons';
import { Press, Txt } from './ui';

/** Full-screen camera sheet. Calls onCapture with a base64 photo, or onClose on cancel. */
export function CameraCapture({
  visible,
  accent,
  onCapture,
  onClose,
}: {
  visible: boolean;
  accent: string;
  onCapture: (img: CapturedImage) => void;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const cam = useRef<CameraView>(null);
  const [busy, setBusy] = useState(false);

  const shoot = async () => {
    if (!cam.current || busy) return;
    setBusy(true);
    try {
      const photo = await cam.current.takePictureAsync({ base64: true, quality: 0.7, skipProcessing: true });
      if (photo?.uri) {
        const base64 = await ensureBase64(photo.base64, photo.uri);
        onCapture({ base64, mimeType: 'image/jpeg', uri: photo.uri });
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        {permission?.granted ? (
          <CameraView ref={cam} style={{ flex: 1 }} facing="back" />
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 }}>
            <Icon xml={UI.camera} size={40} color="#fff" />
            <Txt style={{ color: '#fff', fontSize: 15, textAlign: 'center', lineHeight: 22 }}>
              {permission ? 'Camera access is needed to scan.' : 'Requesting camera…'}
            </Txt>
            {permission && !permission.granted && (
              <Press onPress={requestPermission} style={{ backgroundColor: accent, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 22 }}>
                <Txt style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Allow camera</Txt>
              </Press>
            )}
          </View>
        )}

        {/* close */}
        <Press
          onPress={onClose}
          style={{ position: 'absolute', top: insets.top + 12, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,.45)', alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon xml={UI.close} size={20} color="#fff" />
        </Press>

        {/* shutter */}
        {permission?.granted && (
          <View style={{ position: 'absolute', bottom: insets.bottom + 30, left: 0, right: 0, alignItems: 'center' }}>
            <Press
              onPress={shoot}
              style={{ width: 74, height: 74, borderRadius: 37, borderWidth: 5, borderColor: 'rgba(255,255,255,.85)', backgroundColor: busy ? 'rgba(255,255,255,.4)' : '#fff' }}
            >
              <View />
            </Press>
          </View>
        )}
      </View>
    </Modal>
  );
}
