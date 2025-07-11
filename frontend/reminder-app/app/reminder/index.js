import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import BottomNav from '../../components/BottomNav';

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
      <View style={styles.infoRow}>
        <Image source={require('../../assets/icons/orange_star.png')} style={styles.icon} />
        <Text style={styles.infoText}>{item.title}</Text>
      </View>

      <View style={styles.infoRow}>
        <Image source={require('../../assets/icons/blue_star.png')} style={styles.icon} />
        <Text style={styles.infoText}>{item.hour || '-'}</Text>
      </View>

      <View style={styles.infoRow}>
        <Image source={require('../../assets/icons/purple_star.png')} style={styles.icon} />
        <Text style={styles.infoText}>
          {item.weekDays?.length > 0
            ? item.weekDays.map(day => WEEKDAY_LABELS[day] || day).join(', ')
            : 'Nenhum dia'}
        </Text>
      </View>

      <View style={[styles.infoRow, { marginBottom: 12 }]}>
        <Image source={require('../../assets/icons/orange_star.png')} style={styles.icon} />
        <Text style={styles.infoText}>
          {item.medicineNames?.length > 0
            ? item.medicineNames.join('\n ')
            : 'Nenhum medicamento'}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.detailsButton}
        onPress={() => router.push(`/reminder/${item.id}`)}
      >
        <Text style={styles.detailsButtonText}>Ver Mais Detalhes</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.flex}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
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
              onSubmitEditing={onSearch}
            />
            <TouchableOpacity onPress={onSearch} style={styles.searchIconButton}>
              <Text style={styles.searchIcon}>🔍</Text>
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
              contentContainerStyle={{ paddingBottom: 120 }} 
            />
          )}
        </View>

        <BottomNav style={styles.bottomNav} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#5861e2',
  },
  container: {
    flex: 1,
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
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  searchIconButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  searchIcon: {
    fontSize: 20,
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
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});