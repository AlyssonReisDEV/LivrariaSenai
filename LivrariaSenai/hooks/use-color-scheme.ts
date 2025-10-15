/**
 * Hook que detecta o esquema de cores do dispositivo (claro/escuro)
 * 
 * Re-exporta o hook useColorScheme do React Native para uso consistente
 * em toda a aplicação.
 * 
 * @function useColorScheme
 * @returns {'light' | 'dark' | null} Tema atual do dispositivo
 * 
 * @example
 * import { useColorScheme } from '@/hooks/use-color-scheme';
 * 
 * const theme = useColorScheme();
 * console.log(theme); // 'light' ou 'dark'
 */
export { useColorScheme } from 'react-native';
