import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function MedicineListScreen() {
  const [medicines, setMedicines] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function fetchMedicines(nameFilter = '') {
    setLoading(true);
    try {
      const url = nameFilter
        ? `http://192.168.100.14:8080/medicine/list?name=${encodeURIComponent(nameFilter)}`
        : 'http://192.168.100.14:8080/medicine/list';

      console.log('Buscando dados em:', url);

      const response = await fetch(url);

      console.log('Resposta status:', response.status);

      const contentType = response.headers.get('content-type');
      console.log('Content-Type:', contentType);

      if (!response.ok) throw new Error('Resposta não OK');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Resposta não é JSON');
      }

      const data = await response.json();
      console.log('Dados recebidos:', data);

      if (!Array.isArray(data)) {
        throw new Error('Dados recebidos não são uma lista');
      }

      // Verifica se tem id nos primeiros itens
      if (data.length > 0 && !data[0].id) {
        console.warn('Itens recebidos não possuem campo id!');
      }

      setMedicines(data);
    } catch (error) {
      console.error('Erro ao carregar medicamentos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os medicamentos.');
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleSearch = () => {
    fetchMedicines(searchName.trim());
  };

  const renderMedicine = ({ item }) => {
    console.log('Renderizando item:', item);
    return (
      <View style={styles.information}>
        <View style={styles.infoRow}>
          <Image source={require('../../assets/icons/orange_star.png')} style={styles.icon} />
          <Text style={styles.infoText}>{item.name}</Text>
        </View>

        <View style={styles.infoRow}>
          <Image source={require('../../assets/icons/blue_star.png')} style={styles.icon} />
          <Text style={styles.infoText}>{item.dosage}</Text>
        </View>

        <View style={[styles.infoRow, { marginBottom: 12 }]}>
          <Image source={require('../../assets/icons/purple_star.png')} style={styles.icon} />
          <Text style={styles.infoText}>{item.format}</Text>
        </View>

        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => router.push(`/medicine/${item.id}`)}
        >
          <Text style={styles.detailsButtonText}>Ver Mais Detalhes</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.btnCyan}
          onPress={() => router.push('/medicine/create')}
        >
          <Text style={styles.btnCyanText}>Cadastrar Medicamento</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Procurar Medicamento</Text>

        <View style={styles.formGroup}>
          <TextInput
            style={styles.input}
            placeholder="Digite o nome do medicamento"
            value={searchName}
            onChangeText={setSearchName}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : medicines.length === 0 ? (
          <Text style={styles.noResults}>Nenhum medicamento encontrado.</Text>
        ) : (
          <FlatList
            data={medicines}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderMedicine}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#5861e2',
  },
  container: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  noResults: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 30,
  },
  information: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  detailsButton: {
    backgroundColor: '#5861e2',
    borderRadius: 5,
    paddingVertical: 10,
    marginTop: 8,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  btnCyan: {
    backgroundColor: '#a0e7e5',
    borderRadius: 5,
    paddingVertical: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  btnCyanText: {
    color: '#004d4d',
    fontWeight: 'bold',
    fontSize: 16,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
});