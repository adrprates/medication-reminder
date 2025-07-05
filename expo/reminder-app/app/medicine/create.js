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
} from 'react-native';

import { useRouter } from 'expo-router';

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

      if (response.ok) {
        Alert.alert('Sucesso', 'Medicamento cadastrado com sucesso!');
        router.push('/medicine');  // navega para a listagem no expo-router
      } else {
        Alert.alert('Erro', 'Falha ao cadastrar medicamento.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}
    >
      <ScrollView contentContainerStyle={styles.container}>
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#5861E2',
  },
  container: {
    padding: 20,
    alignItems: 'center',
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
    color: '#333',
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
    backgroundColor: '#5861E2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});