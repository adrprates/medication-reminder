import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BottomNav from '../../../components/BottomNav';


export default function MedicineEditScreen() {
  const { id: medicineId } = useLocalSearchParams();
  const router = useRouter();

  const [id, setId] = useState(null);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [format, setFormat] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (medicineId) {
      fetch(`http://192.168.100.14:8080/medicine/show/${medicineId}`)
        .then(res => {
          if (!res.ok) throw new Error('Medicamento não encontrado');
          return res.json();
        })
        .then(med => {
          setId(med.id);
          setName(med.name);
          setDosage(med.dosage);
          setFormat(med.format);
          setNote(med.note || '');
        })
        .catch(() => Alert.alert('Erro', 'Não foi possível carregar o medicamento.'));
    }
  }, [medicineId]);

  async function handleSubmit() {
    if (!name.trim() || !dosage.trim() || !format.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const payload = {
      id,
      name,
      dosage,
      format,
      note,
    };

    try {
      const response = await fetch('http://192.168.100.14:8080/medicine/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Medicamento atualizado com sucesso!');
        router.replace('/medicine');
      } else {
        Alert.alert('Erro', 'Falha ao atualizar o medicamento.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao conectar com o servidor.');
    }
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Editar Medicamento</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Dosagem</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 500mg"
          value={dosage}
          onChangeText={setDosage}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Formato</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: comprimido, xarope"
          value={format}
          onChangeText={setFormat}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Observações</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Observações (opcional)"
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={4}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Salvar Alterações</Text>
      </TouchableOpacity>
      <BottomNav />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 20,
    backgroundColor: '#5861E2',
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    alignSelf: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#fff',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#5861e2',
    borderRadius: 5,
    paddingVertical: 12,
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
});