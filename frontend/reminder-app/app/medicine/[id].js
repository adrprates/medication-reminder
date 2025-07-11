import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import BottomNav from '../../components/BottomNav';


export default function MedicineDetailScreen() {
  const { id } = useLocalSearchParams(); 
  const router = useRouter();

  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://192.168.100.14:8080/medicine/show/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar medicamento');
        return res.json();
      })
      .then(data => setMedicine(data))
      .catch(() => {
        Platform.OS === 'web'
          ? alert('Não foi possível carregar o medicamento')
          : Alert.alert('Erro', 'Não foi possível carregar o medicamento');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const deleteMedicine = async () => {
    try {
      const response = await fetch(`http://192.168.100.14:8080/medicine/delete/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        if (Platform.OS === 'web') {
          alert('Medicamento excluído com sucesso!');
        } else {
          Alert.alert('Sucesso', 'Medicamento excluído com sucesso!');
        }
        router.push('/medicine'); 
      } else {
        const msg = 'Falha ao excluir o medicamento.';
        Platform.OS === 'web' ? alert(msg) : Alert.alert('Erro', msg);
      }
    } catch (err) {
      const msg = 'Erro ao conectar com o servidor.';
      Platform.OS === 'web' ? alert(msg) : Alert.alert('Erro', msg);
    }
  };

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Deseja realmente excluir este medicamento?')) {
        deleteMedicine();
      }
    } else {
      Alert.alert(
        'Excluir Medicamento',
        'Deseja realmente excluir este medicamento?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Excluir', style: 'destructive', onPress: deleteMedicine },
        ],
        { cancelable: true }
      );
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#5861e2" />
      </View>
    );
  }
  if (!medicine) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Medicamento não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.header}>Detalhes do Medicamento</Text>

        <View style={styles.titleBox}>
          <Text style={styles.titleText}>{medicine.name}</Text>
        </View>

        <View style={styles.information}>
          <Text style={styles.infoHeader}>Informações</Text>
          <Text style={styles.infoItem}>
            <Text style={styles.label}>Nome: </Text>{medicine.name}
          </Text>
          <Text style={styles.infoItem}>
            <Text style={styles.label}>Dosagem: </Text>{medicine.dosage}
          </Text>
          <Text style={styles.infoItem}>
            <Text style={styles.label}>Formato: </Text>{medicine.format}
          </Text>
          <Text style={styles.infoItem}>
            <Text style={styles.label}>Observações: </Text>{medicine.note || 'Nenhuma'}
          </Text>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => router.push(`/medicine/edit/${id}`)}
          >
            <Text style={styles.btnText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnDanger}
            onPress={handleDelete}
          >
            <Text style={styles.btnText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    paddingBottom: 40,
    flexGrow: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 120,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  titleBox: {
    backgroundColor: '#5861e2',
    padding: 30,
    borderRadius: 10,
    marginBottom: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  titleText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
  },
  information: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  infoHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  infoItem: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
  },
  buttonGroup: {
    gap: 10,
  },
  btnPrimary: {
    backgroundColor: '#00a2ff',
    paddingVertical: 12,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  btnDanger: {
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});