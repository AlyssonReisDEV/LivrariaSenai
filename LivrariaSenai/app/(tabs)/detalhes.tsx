import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View, Image, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '../../services/api';

/**
 * Tipo que representa a estrutura completa de dados de um livro
 * 
 * @typedef {Object} Livro
 * @property {number} id - Identificador único do livro
 * @property {string} titulo - Título do livro
 * @property {string} autor - Nome do autor
 * @property {string} [genero] - Gênero literário (opcional)
 * @property {boolean} disponivel - Status de disponibilidade para empréstimo
 * @property {string|null} [descricao] - Descrição detalhada do conteúdo
 * @property {string|null} [imagemUrl] - URL da imagem de capa
 * @property {string|null} [linkDownload] - Link para download do livro digital
 */
type Livro = {
  id: number;
  titulo: string;
  autor: string;
  genero?: string;
  disponivel: boolean;
  descricao?: string | null;
  imagemUrl?: string | null;
  linkDownload?: string | null;
};

/**
 * Componente de detalhes do livro
 * 
 * Funcionalidades:
 * - Exibe todas as informações detalhadas de um livro
 * - Permite alternar status de disponibilidade
 * - Permite excluir o livro
 * - Abre link de download em navegador externo (se disponível)
 * 
 * @component
 * @returns {JSX.Element} Tela de detalhes do livro
 */
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

  /**
   * Alterna o status de disponibilidade do livro
   * 
   * Inverte o valor atual de 'disponivel' (true -> false ou false -> true)
   * e envia uma requisição PATCH para a API atualizar o banco de dados.
   * 
   * Após sucesso, exibe alerta e retorna à tela anterior.
   * 
   * @async
   * @function alternarDisponibilidade
   * @returns {Promise<void>}
   * 
   * @example
   * // Se livro.disponivel = true
   * await alternarDisponibilidade(); // Marca como indisponível
   * 
   * @example
   * // Se livro.disponivel = false
   * await alternarDisponibilidade(); // Marca como disponível
   */
  async function alternarDisponibilidade() {
    try {
      await api.patch(`/livros/${livro.id}`, { disponivel: !livro.disponivel });
      Alert.alert('Sucesso', 'Status de disponibilidade atualizado!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('Erro', 'Erro ao atualizar disponibilidade');
    }
  }

  /**
   * Exclui permanentemente o livro do banco de dados
   * 
   * Envia requisição DELETE para a API e, em caso de sucesso,
   * retorna automaticamente à tela anterior (lista de livros).
   * 
   * @async
   * @function excluir
   * @returns {Promise<void>}
   * 
   * @example
   * // Ao clicar no botão "Excluir livro"
   * await excluir(); // DELETE /livros/:id
   */
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
      <Text style={{ fontWeight: 'bold' }}>Autor:</Text>
      <Text>{livro.autor}</Text>
      <Text style={{ fontWeight: 'bold', marginTop: 8 }}>Gênero:</Text>
      <Text>{livro.genero || 'Sem gênero'}</Text>
      {livro.descricao ? (
        <>
          <Text style={{ fontWeight: 'bold', marginTop: 8 }}>Descrição:</Text>
          <Text>{livro.descricao}</Text>
        </>
      ) : null}
      <Text style={{ fontWeight: 'bold', marginTop: 8 }}>Status:</Text>
      <Text>{livro.disponivel ? 'Disponível ✅' : 'Indisponível ❌'}</Text>
      <Button
        title={livro.disponivel ? 'Marcar como Indisponível' : 'Marcar como Disponível'}
        onPress={alternarDisponibilidade}
        color={livro.disponivel ? '#f0ad4e' : '#5cb85c'}
      />
      {livro.linkDownload ? (
        <>
          <Text style={{ fontWeight: 'bold', marginTop: 8 }}>Link de download:</Text>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}
            onPress={() => Linking.openURL(livro.linkDownload!)}
          >
            <Ionicons name="download-outline" size={18} color="blue" style={{ marginRight: 4 }} />
            <Text style={{ color: 'blue', textDecorationLine: 'underline' }} numberOfLines={1}>
              {livro.linkDownload}
            </Text>
          </TouchableOpacity>
        </>
      ) : null}

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
