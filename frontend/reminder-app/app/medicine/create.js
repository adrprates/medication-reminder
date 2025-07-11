import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';

import { useRouter } from 'expo-router';
import BottomNav from '../../components/BottomNav';

export default function MedicineCreateScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [format, setFormat] = useState('');
  const [note, setNote] = useState('');

 async function handleSubmit() {
  if (!name || !dosage || !format || !note) {
    Alert.alert('Erro', 'Por favor, preencha todos os campos.');
    return;
  }

  const medicineData = { name, dosage, format, note };

    try {
      const response = await fetch('http://192.168.100.14:8080/medicine/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(medicineData),
      });

      const text = await response.text(); 
      const data = text ? JSON.parse(text) : {}; 

      console.log('Resposta do servidor:', data);

      if (response.ok && data.success !== false) {
        Alert.alert('Sucesso', 'Medicamento cadastrado com sucesso!');
        router.push('/medicine');
      } else {
        Alert.alert('Erro', data.message || 'Falha ao cadastrar medicamento.');
      }

    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
    }
  }

  return (
    <SafeAreaView style={styles.flex}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1 }}
        >
          <Text style={styles.title}>Cadastrar Medicamento</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Nome do medicamento"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Dosagem</Text>
            <TextInput
              style={styles.input}
              value={dosage}
              onChangeText={setDosage}
              placeholder="Ex: 500mg"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Formato</Text>
            <TextInput
              style={styles.input}
              value={format}
              onChangeText={setFormat}
              placeholder="Ex: Comprimido, Xarope"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Observações</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={note}
              onChangeText={setNote}
              placeholder="Observações adicionais"
              multiline
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>
        </ScrollView>

        <BottomNav style={styles.bottomNav} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#5861E2',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 140,
    alignItems: 'center',
    flexGrow: 1,
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    width: '100%',
    marginBottom: 32,
  },
  label: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#5861E2',
    fontWeight: 'bold',
    fontSize: 18,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});