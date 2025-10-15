/**
 * Hook customizado para obter cores baseadas no tema (claro/escuro)
 * 
 * Saiba mais sobre modos claro e escuro:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * Retorna a cor apropriada baseada no tema atual do dispositivo
 * 
 * Permite sobrescrever cores específicas através de props ou
 * usar as cores padrão definidas em constants/theme.ts
 * 
 * @function useThemeColor
 * @param {Object} props - Objeto com cores customizadas opcionais
 * @param {string} [props.light] - Cor personalizada para tema claro
 * @param {string} [props.dark] - Cor personalizada para tema escuro
 * @param {string} colorName - Nome da cor a ser buscada no tema padrão
 * @returns {string} Cor hexadecimal apropriada para o tema atual
 * 
 * @example
 * // Usar cor do tema padrão
 * const backgroundColor = useThemeColor({}, 'background');
 * 
 * @example
 * // Sobrescrever com cores customizadas
 * const textColor = useThemeColor(
 *   { light: '#000000', dark: '#FFFFFF' },
 *   'text'
 * );
 */
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
