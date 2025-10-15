import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

/**
 * Propriedades do componente ThemedText
 * 
 * @typedef {Object} ThemedTextProps
 * @extends TextProps
 * @property {string} [lightColor] - Cor personalizada para tema claro
 * @property {string} [darkColor] - Cor personalizada para tema escuro
 * @property {'default'|'title'|'defaultSemiBold'|'subtitle'|'link'} [type] - Estilo pré-definido do texto
 */
export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

/**
 * Componente de texto que se adapta automaticamente ao tema (claro/escuro)
 * 
 * Oferece estilos pré-definidos e ajusta a cor do texto baseado no tema do dispositivo.
 * 
 * @component
 * @param {ThemedTextProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente Text com tema aplicado
 * 
 * @example
 * // Texto padrão
 * <ThemedText>Olá Mundo</ThemedText>
 * 
 * @example
 * // Título em negrito
 * <ThemedText type="title">Título Principal</ThemedText>
 * 
 * @example
 * // Texto com cores personalizadas
 * <ThemedText lightColor="#000" darkColor="#FFF">
 *   Texto customizado
 * </ThemedText>
 */
export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
});
