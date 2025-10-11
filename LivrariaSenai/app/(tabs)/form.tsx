import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import api from '../../services/api';

type Livro = {
  id?: number;
  titulo: string;
  autor: string;
  descricao?: string | null;
  genero?: string;
  imagemUrl?: string;
  linkDownload?: string | null;
};

export default function FormLivro() {
  const router = useRouter();
  const params = useLocalSearchParams<{ livro?: string }>();
  const livroParam = params.livro ? JSON.parse(decodeURIComponent(params.livro)) : undefined;

  const [titulo, setTitulo] = useState(livroParam?.titulo || '');
  const [autor, setAutor] = useState(livroParam?.autor || '');
  const [descricao, setDescricao] = useState(livroParam?.descricao || '');
  const [genero, setGenero] = useState(livroParam?.genero || '');
  const [imagemUrl, setImagemUrl] = useState(livroParam?.imagemUrl || '');

  const [temLink, setTemLink] = useState<boolean>(!!livroParam?.linkDownload);
  const [linkDownload, setLinkDownload] = useState<string>(livroParam?.linkDownload || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // debug rápido para ver se params chegaram
    if (livroParam) console.log('Editando livro:', livroParam);
  }, []);

  async function escolherImagem() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'É necessário permitir acesso à galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      // caso sua versão reclame aqui, ajuste conforme a doc do expo-image-picker
      mediaTypes: ImagePicker.MediaTypeOptions?.Images ?? ImagePicker.MediaTypes?.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImagemUrl(uri);
    }
  }

  async function salvar() {
    if (!titulo.trim() || !autor.trim()) {
      Alert.alert('Erro', 'Preencha título e autor.');
      return;
    }

    const dados: Livro = {
      titulo: titulo.trim(),
      autor: autor.trim(),
      descricao: descricao.trim() || null,
      genero: genero.trim() || null,
      imagemUrl: imagemUrl || null,
      linkDownload: temLink ? (linkDownload.trim() || null) : null,
    };

    try {
      setLoading(true);
      console.log('Salvando dados:', dados);

      let res;
      if (livroParam?.id) {
        res = await api.put(`/livros/${livroParam.id}`, dados);
      } else {
        res = await api.post('/livros', dados);
      }

      console.log('Resposta API:', res?.data ?? res);
      Alert.alert('Sucesso', 'Livro salvo com sucesso.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      console.error('Erro ao salvar livro:', err);
      const msg = err?.response?.data?.message ?? err.message ?? 'Erro ao salvar livro';
      Alert.alert('Erro', msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={escolherImagem}>
            {imagemUrl ? (
              <Image source={{ uri: imagemUrl }} style={styles.imagemPreview} />
            ) : (
              <View style={styles.imagemPlaceholder}>
                <Text style={{ color: '#888' }}>Toque para escolher uma imagem</Text>
              </View>
            )}
          </TouchableOpacity>

          <TextInput style={styles.input} placeholder="Título" value={titulo} onChangeText={setTitulo} />
          <TextInput style={styles.input} placeholder="Autor" value={autor} onChangeText={setAutor} />

          <TextInput
            style={[styles.input, styles.inputMultiline]}
            placeholder="Descrição"
            value={descricao}
            onChangeText={setDescricao}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <TextInput style={styles.input} placeholder="Gênero" value={genero} onChangeText={setGenero} />

          <View style={styles.rowSwitch}>
            <Text style={{ fontSize: 16 }}>Possui link de download?</Text>
            <Switch value={temLink} onValueChange={setTemLink} />
          </View>

          {temLink && (
            <TextInput
              style={styles.input}
              placeholder="URL do link de download (https://...)"
              value={linkDownload}
              onChangeText={setLinkDownload}
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
            />
          )}

          <TouchableOpacity
            style={[styles.botaoSalvar, loading && { opacity: 0.7 }]}
            onPress={salvar}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.textoBotao}>{livroParam ? 'Atualizar Livro' : 'Cadastrar Livro'}</Text>}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  inputMultiline: {
    height: 120,
  },
  imagemPreview: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 15,
  },
  imagemPlaceholder: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoSalvar: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  rowSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
});
