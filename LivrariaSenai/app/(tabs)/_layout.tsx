import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen name="index" options={{ title: "Lista de Livros" }} />
      <Tabs.Screen name="form" options={{ title: "Adicionar Livro" }} />
      <Tabs.Screen name="detalhes" options={{ title: "Detalhes do Livro" }} />
    </Tabs>
  );
}
