import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import BottomNav from '../components/BottomNav';
import { useRouter } from 'expo-router';

import notifee from '@notifee/react-native';

export default function HomeScreen() {
  const router = useRouter();

  useEffect(() => {
    async function setupNotificationChannel() {
      try {
        await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
        });
      } catch (error) {
        console.error('Erro ao criar canal de notificação:', error);
      }
    }

    setupNotificationChannel();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Bem-vindo ao</Text>
        <Text style={styles.title}>LEMBRETE DE</Text>
        <Text style={styles.title}>MEDICAMENTOS</Text>
      </View>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingBottom: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});