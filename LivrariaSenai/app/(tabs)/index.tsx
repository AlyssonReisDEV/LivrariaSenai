import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import api from "../../services/api";

/**
 * Tipo que representa a estrutura de dados de um livro
 * 
 * @typedef {Object} Livro
 * @property {number} id - Identificador único do livro
 * @property {string} titulo - Título do livro
 * @property {string} autor - Nome do autor
 * @property {string} [genero] - Gênero literário (opcional)
 * @property {boolean} disponivel - Indica se o livro está disponível para empréstimo
 * @property {string|null} [imagem] - URL da imagem de capa do livro (opcional)
 */
type Livro = {
  id: number;
  titulo: string;
  autor: string;
  genero?: string;
  disponivel: boolean;
  imagem?: string | null;
};

/**
 * Componente principal que exibe a lista de livros da biblioteca
 * 
 * Funcionalidades:
 * - Exibe todos os livros em uma grade de 5 colunas
 * - Permite buscar livros por título
 * - Suporta atualização da lista através de pull-to-refresh
 * - Navegação para detalhes do livro ao clicar
 * - Botão flutuante para adicionar novos livros
 * 
 * @component
 * @returns {JSX.Element} Tela de listagem de livros
 */
export default function ListaLivros() {
  const router = useRouter();
  const [livros, setLivros] = useState<Livro[]>([]);
  const [busca, setBusca] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Carrega a lista de livros da API
   * 
   * Busca todos os livros do banco de dados, aplicando filtro de busca
   * por título se houver texto no campo de busca.
   * 
   * @async
   * @function carregarLivros
   * @returns {Promise<void>}
   * 
   * @example
   * // Carrega todos os livros
   * await carregarLivros();
   * 
   * @example
   * // Carrega livros filtrados pelo termo de busca
   * setBusca("Harry Potter");
   * await carregarLivros(); // Busca apenas livros com "Harry Potter" no título
   */
  async function carregarLivros() {
    setRefreshing(true);
    try {
      const res = await api.get("/livros", { params: { titulo: busca } });
      setLivros(res.data);
    } catch (err) {
      console.error("❌ Erro ao carregar livros:", err);
    } finally {
      setRefreshing(false);
    }
  }

  /**
   * Effect Hook que recarrega a lista de livros automaticamente
   * sempre que o termo de busca é alterado
   * 
   * Isso permite busca em tempo real enquanto o usuário digita
   */
  useEffect(() => {
    carregarLivros();
  }, [busca]);

  // 🧠 Tamanho dinâmico dos cards (divide tela em 5 colunas)
  const screenWidth = Dimensions.get("window").width;
  const cardWidth = screenWidth / 5 - 14;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* 🔖 Título principal */}
        <Text style={styles.titulo}>📚 Biblioteca Senai</Text>

        {/* 🔍 Barra de busca */}
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
          {/* ❌ Botão de limpar busca */}
          {busca.length > 0 && (
            <TouchableOpacity onPress={() => setBusca("")}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {/* 🧾 Grade de livros */}
        <FlatList
          data={livros}
          numColumns={5} // 👉 Mostra 5 livros por linha
          keyExtractor={(item) => item.id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={carregarLivros} />}
          ListEmptyComponent={<Text style={styles.textoVazio}>Nenhum livro encontrado 😕</Text>}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, { width: cardWidth }]}
              activeOpacity={0.85}
              onPress={() => {
                const payload = encodeURIComponent(JSON.stringify(item));
                router.push(`/(tabs)/detalhes?livro=${payload}`);
              }}
            >
              {/* 🖼️ Imagem do livro */}
              <Image
                source={{
                  uri:
                    item.imagem ||
                    "https://via.https://www.bing.com/images/search?view=detailV2&ccid=EtS7LHlM&id=2A2BEEB209AAE5899868979B7135761E75875C9A&thid=OIP.EtS7LHlMvb3oOxIAzMiqngHaFj&mediaurl=https%3a%2f%2fblog.even3.com.br%2fwp-content%2fuploads%2f2022%2f10%2fcapa_de_livro_exemplo-1-1-1024x768.png&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.12d4bb2c794cbdbde83b1200ccc8aa9e%3frik%3dmlyHdR52NXGblw%26pid%3dImgRaw%26r%3d0&exph=768&expw=1024&q=capa+de+livro&FORM=IRPRST&ck=F6D725E5F7751B0D64F72FC0C646BBA8&selectedIndex=44&itb=0.com/150x220.png?text=Sem+Imagem",
                }}
                style={styles.imagem}
              />

              {/* 📘 Título e informações */}
              <Text style={styles.cardTitulo} numberOfLines={1}>
                {item.titulo}
              </Text>
              <Text style={styles.cardAutor} numberOfLines={1}>
                {item.autor}
              </Text>
              <Text style={styles.cardGenero}>
                {item.genero || "Gênero indefinido"}
              </Text>

              {/* 🔹 Status */}
              <Text
                style={[
                  styles.cardStatus,
                  { color: item.disponivel ? "#28a745" : "#e74c3c" },
                ]}
              >
                {item.disponivel ? "Disponível ✅" : "Indisponível ❌"}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* ➕ Botão flutuante para adicionar novo livro */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push("/(tabs)/form")}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={36} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

//
// 🎨 Estilos modernos e bem comentados
//
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f0f3f9", // Fundo neutro e limpo
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1e272e",
    marginBottom: 16,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  grid: {
    justifyContent: "center",
    paddingBottom: 80,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    margin: 5,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  imagem: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    marginBottom: 6,
    resizeMode: "cover",
  },
  cardTitulo: {
    fontWeight: "bold",
    fontSize: 13,
    color: "#222",
    textAlign: "center",
  },
  cardAutor: {
    color: "#555",
    fontSize: 12,
    textAlign: "center",
  },
  cardGenero: {
    color: "#777",
    fontSize: 11,
    marginTop: 2,
    textAlign: "center",
  },
  cardStatus: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
  },
  textoVazio: {
    textAlign: "center",
    color: "#777",
    marginTop: 40,
    fontSize: 16,
  },
  fab: {
    position: "absolute",
    bottom: 25,
    right: 25,
    backgroundColor: "#007bff",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
});