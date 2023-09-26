import { useThemeColor } from '@/hooks/use-theme-color';
import { Text as DefaultText } from 'react-native';

const textVariants = {
  h1: {
    fontSize: 32,
    fontFamily: 'Inter_700',
  },
  h2: {
    fontSize: 24,
    fontFamily: 'Inter_700',
  },
  h3: {
    fontSize: 20,
    fontFamily: 'Inter_400',
  },
  h4: {
    fontSize: 16,
    fontFamily: 'Inter_700',
  },
  body: {
    fontSize: 16,
    fontFamily: 'Inter_300',
  },
};

type TextProps = DefaultText['props'] & {
  lightColor?: string;
  darkColor?: string;
};

export function Text(
  props: TextProps & {
    as?: keyof typeof textVariants;
  },
) {
  const {
    style,
    lightColor,
    darkColor,
    as = 'body',
    ...otherProps
  } = props;

  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    'text',
  );

  const { fontFamily, fontSize } =
    textVariants[as];

  return (
    <DefaultText
      style={[
        {
          color,
          fontFamily,
          fontSize,
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
