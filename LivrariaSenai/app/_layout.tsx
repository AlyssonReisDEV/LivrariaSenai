import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * Configuração de navegação do Expo Router
 * Define a tela âncora inicial da aplicação
 */
export const unstable_settings = {
  anchor: '(tabs)',
};

/**
 * Layout raiz da aplicação
 * 
 * Configura o tema global (claro/escuro) e a estrutura de navegação principal.
 * Envolve toda a aplicação com o ThemeProvider para suporte a temas.
 * 
 * @component
 * @returns {JSX.Element} Estrutura de navegação raiz com tema aplicado
 * 
 * @description
 * - Detecta automaticamente o tema do dispositivo
 * - Aplica tema claro ou escuro em toda a aplicação
 * - Configura navegação em pilha (Stack)
 * - Define tela de tabs como principal
 * - Inclui tela modal opcional
 */
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
