import { useThemeColor } from '@/hooks/use-theme-color';
import { View as DefaultView } from 'react-native';

type ViewProps = DefaultView['props'] & {
  lightColor?: string;
  darkColor?: string;
};

export function View(props: ViewProps) {
  const {
    style,
    lightColor,
    darkColor,
    ...otherProps
  } = props;

  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'background',
  );

  return (
    <DefaultView
      style={[{ backgroundColor }, style]}
      {...otherProps}
    />
  );
}
