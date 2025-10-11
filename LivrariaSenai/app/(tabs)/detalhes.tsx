import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '../../services/api';

type Livro = {
  id: number;
  titulo: string;
  autor: string;
  genero?: string;
  disponivel: boolean;
  emprestadoPara?: string | null;
  dataDevolucao?: string | null;
  imagemUrl?: string | null;
};

export default function DetalhesPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ livro: string }>();

  if (!params.livro) {
    return (
      <View style={styles.container}>
        <Text>❌ Erro: Nenhum livro recebido</Text>
      </View>
    );
  }

  // ✅ Converte de volta o JSON enviado pela tela anterior
  const livro: Livro = JSON.parse(params.livro);

  const [nomePessoa, setNomePessoa] = useState(livro.emprestadoPara || '');
  const [dataDevolucao, setDataDevolucao] = useState(
    livro.dataDevolucao ? livro.dataDevolucao.split('T')[0] : ''
  );

  async function emprestar() {
    try {
      await api.patch(`/livros/${livro.id}`, {
        disponivel: false,
        emprestadoPara: nomePessoa,
        dataDevolucao,
      });
      router.back();
    } catch {
      Alert.alert('Erro', 'Erro ao emprestar livro');
    }
  }

  async function devolver() {
    try {
      await api.patch(`/livros/${livro.id}`, {
        disponivel: true,
        emprestadoPara: null,
        dataDevolucao: null,
      });
      router.back();
    } catch {
      Alert.alert('Erro', 'Erro ao devolver livro');
    }
  }

  async function excluir() {
    try {
      await api.delete(`/livros/${livro.id}`);
      router.back();
    } catch {
      Alert.alert('Erro', 'Erro ao excluir livro');
    }
  }

  return (
    <View style={styles.container}>
      {livro.imagemUrl ? (
        <Image
          source={{ uri: livro.imagemUrl }}
          style={{ width: '100%', height: 200, borderRadius: 10, marginBottom: 15 }}
        />
      ) : null}

      <Text style={styles.titulo}>{livro.titulo}</Text>
      <Text>{livro.autor}</Text>
      <Text>{livro.genero || 'Sem gênero'}</Text>

      <Text style={{ marginVertical: 10 }}>
        {livro.disponivel ? 'Disponível ✅' : 'Emprestado ❌'}
      </Text>

      {!livro.disponivel ? (
        <>
          <Text>Emprestado para: {livro.emprestadoPara}</Text>
          <Text>Devolução: {dataDevolucao || '---'}</Text>
          <Button title="Devolver livro" onPress={devolver} />
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Nome de quem pega emprestado"
            value={nomePessoa}
            onChangeText={setNomePessoa}
          />
          <TextInput
            style={styles.input}
            placeholder="Data de devolução (AAAA-MM-DD)"
            value={dataDevolucao}
            onChangeText={setDataDevolucao}
          />
          <Button title="Emprestar" onPress={emprestar} />
        </>
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="Excluir livro" onPress={excluir} color="#d9534f" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
});
