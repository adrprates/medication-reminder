import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';

const WEEKDAY_LABELS = {
  MONDAY: 'SEG',
  TUESDAY: 'TER',
  WEDNESDAY: 'QUA',
  THURSDAY: 'QUI',
  FRIDAY: 'SEX',
  SATURDAY: 'SÁB',
  SUNDAY: 'DOM',
};

export default function ReminderListScreen() {
  const [reminders, setReminders] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const router = useRouter();

  const fetchReminders = (title = '') => {
    let url = 'http://192.168.100.14:8080/reminder/list';
    if (title) {
      url += `?title=${encodeURIComponent(title)}`;
    }
    fetch(url)
      .then(res => res.json())
      .then(data => setReminders(data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const onSearch = () => {
    fetchReminders(searchTitle);
  };

  const renderItem = ({ item }) => (
    <View style={styles.information}>
      {/* Título */}
      <View style={styles.infoRow}>
        <Image source={require('../../assets/icons/orange_star.png')} style={styles.icon} />
        <Text style={styles.infoText}>{item.title}</Text>
      </View>

      {/* Hora */}
      <View style={styles.infoRow}>
        <Image source={require('../../assets/icons/blue_star.png')} style={styles.icon} />
        <Text style={styles.infoText}>
          {item.hour ? item.hour : '-'}
        </Text>
      </View>

      {/* Dias da Semana */}
      <View style={styles.infoRow}>
        <Image source={require('../../assets/icons/purple_star.png')} style={styles.icon} />
        <Text style={styles.infoText}>
          {item.weekDays?.length > 0
            ? item.weekDays.map(day => WEEKDAY_LABELS[day] || day).join(', ')
            : 'Nenhum dia'}
        </Text>
      </View>

      {/* Medicamentos */}
      <View style={[styles.infoRow, { marginBottom: 12 }]}>
        <Image source={require('../../assets/icons/orange_star.png')} style={styles.icon} />
        <Text style={styles.infoText}>
          {item.medicineNames?.length > 0
            ? item.medicineNames.join('\n ')
            : 'Nenhum medicamento'}
        </Text>
      </View>

      {/* Botão Ver Mais */}
      <TouchableOpacity
        style={styles.detailsButton}
        onPress={() => router.push(`/reminder/${item.id}`)}
      >
        <Text style={styles.detailsButtonText}>Ver Mais Detalhes</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.btnCyan, { marginBottom: 16 }]}
        onPress={() => router.push('/reminder/create')}
      >
        <Text style={styles.btnTextCyan}>Cadastrar Lembrete</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Procurar Lembrete</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome do lembrete"
          value={searchTitle}
          onChangeText={setSearchTitle}
        />
        <TouchableOpacity style={styles.btnSearch} onPress={onSearch}>
          <Text style={styles.btnText}>Procurar</Text>
        </TouchableOpacity>
      </View>

      {reminders.length === 0 ? (
        <View style={styles.information}>
          <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
            Nenhum lembrete encontrado.
          </Text>
        </View>
      ) : (
        <FlatList
          data={reminders}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5861e2',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  information: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
  btnCyan: {
    backgroundColor: '#a0e7e5',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  btnTextCyan: {
    color: '#004d4d',
    fontWeight: 'bold',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  btnSearch: {
    backgroundColor: '#5861e2',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 5,
    marginLeft: 8,
  },
  detailsButton: {
    backgroundColor: '#5861e2',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});