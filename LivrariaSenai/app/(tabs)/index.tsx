import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import api from '../../services/api';

type Livro = {
  id: number;
  titulo: string;
  autor: string;
  genero?: string;
  disponivel: boolean;
  emprestadoPara?: string | null;
};

export default function ListaLivros() {
  const router = useRouter();
  const [livros, setLivros] = useState<Livro[]>([]);
  const [busca, setBusca] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  async function carregarLivros() {
    setRefreshing(true);
    try {
      const res = await api.get('/livros', { params: { titulo: busca } });
      setLivros(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  }

  // carrega ao montar e sempre que o termo de busca mudar
  useEffect(() => {
    carregarLivros();
  }, [busca]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.titulo}>📚 Biblioteca Senai</Text>

        {/* Barra de busca */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#555" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.input}
            placeholder="Buscar por título..."
            value={busca}
            onChangeText={setBusca}
            onSubmitEditing={carregarLivros}
            placeholderTextColor="#888"
          />
          {busca.length > 0 && (
            <TouchableOpacity onPress={() => setBusca('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {/* Lista de livros */}
        <FlatList
          data={livros}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={carregarLivros} />}
          ListEmptyComponent={<Text style={styles.textoVazio}>Nenhum livro encontrado 😕</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                const payload = encodeURIComponent(JSON.stringify(item));
                router.push(`detalhes?livro=${payload}`);
              }}
              style={styles.card}
              activeOpacity={0.8}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitulo}>{item.titulo}</Text>
                <Text style={styles.cardAutor}>{item.autor}</Text>
                <Text style={styles.cardGenero}>{item.genero || 'Sem gênero'}</Text>
                <Text style={styles.cardStatus}>
                  {item.disponivel ? 'Disponível ✅' : `Emprestado para: ${item.emprestadoPara || '---'}`}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward-outline"
                size={22}
                color="#999"
                style={{ alignSelf: 'center' }}
              />
            </TouchableOpacity>
          )}
        />

        {/* Botão flutuante de adicionar */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('form')}
          activeOpacity={0.7}>
          <Ionicons name="add" size={32} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 15,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardTitulo: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#333',
  },
  cardAutor: {
    color: '#555',
    fontSize: 15,
  },
  cardGenero: {
    color: '#777',
    fontSize: 14,
    marginBottom: 4,
  },
  cardStatus: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007bff',
  },
  textoVazio: {
    textAlign: 'center',
    color: '#777',
    marginTop: 50,
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    backgroundColor: '#007bff',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
});
