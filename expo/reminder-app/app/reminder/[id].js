import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';

import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ReminderDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [reminder, setReminder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://192.168.100.14:8080/reminder/show/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar lembrete');
        return res.json();
      })
      .then(data => {
        setReminder(data);
        setLoading(false);
      })
      .catch(() => {
        Alert.alert('Erro', 'Não foi possível carregar o lembrete');
        setLoading(false);
      });
  }, [id]);

  // Função que dispara o DELETE
  const deleteReminder = async () => {
    try {
      const response = await fetch(`http://192.168.100.14:8080/reminder/delete/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        if (Platform.OS === 'web') {
          alert('Lembrete excluído com sucesso!');
        } else {
          Alert.alert('Sucesso', 'Lembrete excluído com sucesso!');
        }
        router.push('/reminder'); // volta para lista de lembretes
      } else {
        const msg = 'Falha ao excluir o lembrete.';
        Platform.OS === 'web' ? alert(msg) : Alert.alert('Erro', msg);
      }
    } catch (err) {
      const msg = 'Erro ao conectar com o servidor.';
      Platform.OS === 'web' ? alert(msg) : Alert.alert('Erro', msg);
    }
  };

  // Handler que faz a confirmação antes do DELETE
  const handleDelete = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Deseja realmente excluir este lembrete?')) {
        deleteReminder();
      }
    } else {
      Alert.alert(
        'Excluir Lembrete',
        'Deseja realmente excluir este lembrete?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Excluir', style: 'destructive', onPress: deleteReminder },
        ],
        { cancelable: true }
      );
    }
  };

  function formatHour(hourStr) {
    if (!hourStr) return '';
    if (hourStr.length >= 5) return hourStr.substring(0, 5);
    return hourStr;
  }

  function formatWeekDays(weekDays) {
    if (!weekDays || weekDays.length === 0) return 'Nenhum dia selecionado';
    const mapLabel = {
      MONDAY: 'Seg',
      TUESDAY: 'Ter',
      WEDNESDAY: 'Qua',
      THURSDAY: 'Qui',
      FRIDAY: 'Sex',
      SATURDAY: 'Sáb',
      SUNDAY: 'Dom',
    };
    return weekDays.map(d => mapLabel[d] || d).join(', ');
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#5861e2" />
      </View>
    );
  }

  if (!reminder) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={{ color: '#333' }}>Lembrete não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{reminder.title}</Text>
      </View>

      <View style={styles.information}>
        <Text style={styles.infoTitle}>Informações Lembrete</Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Nome: </Text>
          {reminder.title}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Horário: </Text>
          {formatHour(reminder.hour)}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.label}>Dias da semana: </Text>
          {formatWeekDays(reminder.weekDays)}
        </Text>

        <Text style={[styles.label, { marginTop: 12 }]}>Remédios:</Text>
        {reminder.medicines && reminder.medicines.length > 0 ? (
          reminder.medicines.map((rm, index) => (
            <Text key={index} style={styles.infoText}>
              {rm.medicine.name} - {rm.medicine.dosage} - {rm.medicine.format}
            </Text>
          ))
        ) : (
          <Text style={styles.infoText}>Nenhum remédio associado</Text>
        )}
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.btnPrimary]}
          onPress={() => router.push(`/reminder/edit/${id}`)}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.btnDanger]}
          onPress={handleDelete}
        >
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.btnSecondary]}
          onPress={() => router.push('/reminder')}
        >
          <Text style={styles.buttonText}>Voltar à lista</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    backgroundColor: '#5861e2',
    borderRadius: 10,
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  title: {
    fontSize: 26,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  information: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
  buttonsContainer: {
    marginTop: 30,
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  btnPrimary: {
    backgroundColor: '#00a2ff',
  },
  btnDanger: {
    backgroundColor: '#dc3545',
  },
  btnSecondary: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});