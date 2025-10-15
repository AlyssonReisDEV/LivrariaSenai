import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

/**
 * Propriedades do componente ThemedView
 * 
 * @typedef {Object} ThemedViewProps
 * @extends ViewProps
 * @property {string} [lightColor] - Cor de fundo personalizada para tema claro
 * @property {string} [darkColor] - Cor de fundo personalizada para tema escuro
 */
export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

/**
 * Componente de container que se adapta automaticamente ao tema (claro/escuro)
 * 
 * Ajusta a cor de fundo baseado no tema do dispositivo, facilitando a criação
 * de interfaces que respondem ao modo escuro/claro do sistema.
 * 
 * @component
 * @param {ThemedViewProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente View com cor de fundo temática
 * 
 * @example
 * // Container com cor padrão do tema
 * <ThemedView>
 *   <Text>Conteúdo</Text>
 * </ThemedView>
 * 
 * @example
 * // Container com cores personalizadas
 * <ThemedView lightColor="#F5F5F5" darkColor="#1A1A1A">
 *   <Text>Conteúdo customizado</Text>
 * </ThemedView>
 */
export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
