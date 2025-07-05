import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function BottomNav() {
  const router = useRouter();

  return (
    <View style={styles.nav}>
      <TouchableOpacity onPress={() => router.push('/')}>
        <Ionicons name="home" size={24} color="#fff" />
        <Text style={styles.label}>Início</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/medicine')}>
        <Ionicons name="medkit" size={24} color="#fff" />
        <Text style={styles.label}>Medicamentos</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/reminder')}>
        <Ionicons name="alarm" size={24} color="#fff" />
        <Text style={styles.label}>Lembretes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#5861e2',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 10,
    zIndex: 1000,
  },
  label: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
});