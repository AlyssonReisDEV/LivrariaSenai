import { Tabs } from "expo-router";

/**
 * Layout de navegação por abas (tabs) da aplicação
 * 
 * Define a estrutura de navegação principal com três telas:
 * - Lista de livros (index)
 * - Formulário de cadastro/edição (form)
 * - Detalhes do livro (detalhes)
 * 
 * @component
 * @returns {JSX.Element} Navegação por abas configurada
 * 
 * @description
 * Todas as telas exibem o cabeçalho (header) com o título correspondente.
 * A navegação entre telas é feita através de router.push() nos componentes.
 */
export default function Layout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen name="index" options={{ title: "Lista de Livros" }} />
      <Tabs.Screen name="form" options={{ title: "Adicionar Livro" }} />
      <Tabs.Screen name="detalhes" options={{ title: "Detalhes do Livro" }} />
    </Tabs>
  );
}
