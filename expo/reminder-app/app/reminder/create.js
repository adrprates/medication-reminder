import React, { useEffect, useState } from 'react';
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
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';

export default function ReminderCreateScreen() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [hour, setHour] = useState('');
  const [note, setNote] = useState('');
  const [weekDays, setWeekDays] = useState({
    MONDAY: false,
    TUESDAY: false,
    WEDNESDAY: false,
    THURSDAY: false,
    FRIDAY: false,
    SATURDAY: false,
    SUNDAY: false,
  });

  const [medicines, setMedicines] = useState([]);
  const [selectedMedicineId, setSelectedMedicineId] = useState('');
  const [selectedMedicines, setSelectedMedicines] = useState([]);

  useEffect(() => {
    fetch('http://192.168.100.14:8080/medicine/list')
      .then(res => res.json())
      .then(data => setMedicines(data))
      .catch(() => Alert.alert('Erro', 'Não foi possível carregar os medicamentos'));
  }, []);

  function toggleMedicine(id) {
    if (selectedMedicines.includes(id)) {
      setSelectedMedicines(selectedMedicines.filter(m => m !== id));
    } else {
      setSelectedMedicines([...selectedMedicines, id]);
    }
  }

  async function handleSubmit() {
    if (!title.trim() || !hour.trim()) {
      Alert.alert('Erro', 'Título e horário são obrigatórios.');
      return;
    }

    const weekDaysSelected = Object.entries(weekDays)
      .filter(([_, val]) => val)
      .map(([key]) => key);

    const medicineIdsNumber = selectedMedicines.map(id => Number(id));

    const payload = {
      title,
      hour,
      weekDays: weekDaysSelected,
      medicineIds: medicineIdsNumber,
      note,
    };

    try {
      const response = await fetch('http://192.168.100.14:8080/reminder/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Lembrete criado com sucesso!');
        router.push('/reminder');  // navega para a lista de lembretes
      } else {
        Alert.alert('Erro', 'Falha ao salvar lembrete.');
      }
    } catch (err) {
      Alert.alert('Erro', 'Erro ao conectar com o servidor.');
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Cadastrar Lembrete</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o título"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Horário (HH:mm)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 14:30"
          value={hour}
          onChangeText={setHour}
          keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric'}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Dias da Semana</Text>
        <View style={styles.weekdaysContainer}>
          {Object.entries(weekDays).map(([day, checked]) => (
            <TouchableOpacity
              key={day}
              style={[styles.checkboxContainer, checked && styles.checkboxSelected]}
              onPress={() => setWeekDays(prev => ({ ...prev, [day]: !prev[day] }))}
            >
              <Text style={[styles.checkboxLabel, checked && styles.checkboxLabelSelected]}>
                {day.substring(0, 3)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Observações</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Digite observações (opcional)"
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Selecione um medicamento</Text>
        <Picker
          selectedValue={selectedMedicineId}
          onValueChange={(itemValue) => {
            if (itemValue && !selectedMedicines.includes(Number(itemValue))) {
              setSelectedMedicines([...selectedMedicines, Number(itemValue)]);
            }
            setSelectedMedicineId('');
          }}
          style={styles.picker}
        >
          <Picker.Item label="Escolha um medicamento" value="" />
          {medicines.map(med => (
            <Picker.Item key={med.id} label={med.name} value={med.id} />
          ))}
        </Picker>
      </View>

      <View style={styles.chipsContainer}>
        {selectedMedicines.map(id => {
          const med = medicines.find(m => m.id === id);
          if (!med) return null;
          return (
            <View key={id} style={styles.chip}>
              <Text style={styles.chipText}>{med.name}</Text>
              <TouchableOpacity onPress={() => toggleMedicine(id)}>
                <Text style={styles.chipRemove}>×</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Cadastrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  weekdaysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  checkboxContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    margin: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#4750c7',
  },
  checkboxLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  checkboxLabelSelected: {
    color: '#fff',
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  chip: {
    flexDirection: 'row',
    backgroundColor: '#a0e7e5',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    alignItems: 'center',
  },
  chipText: {
    color: '#004d4d',
    fontWeight: 'bold',
    marginRight: 8,
  },
  chipRemove: {
    fontSize: 18,
    color: '#004d4d',
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