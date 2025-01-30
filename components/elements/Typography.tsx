import React from 'react';
import { Text, StyleSheet } from 'react-native';

type Variant = 'default' | 'title' | 'subtitle' | 'body' | 'small' | 'largest';

interface TextComponentProps {
  variant?: Variant;
  color?: string;
  t?: string;
  style?: any;
}

const Typography= ({ variant = 'default', color = '#000', t = '', style }: TextComponentProps) => {
  const variantStyles: Record<Variant, any> = {
    default: styles.default,
    title: styles.title,
    subtitle: styles.subtitle,
    body: styles.body,
    small: styles.small,
    largest: styles.largest,
  };

  return (
    <Text style={[variantStyles[variant], { color }, style]}>
      {t}
    </Text>
  );
};

const styles = StyleSheet.create({
  default: {
    fontSize: 14,
    fontWeight: '400',
  },
  title: {
    fontSize: 50,
    fontWeight: '600',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 40,
  },
  body: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '200',
  },
  small: {
    fontSize: 18,
    fontWeight: '300',
  },
  largest: {
    fontSize: 60,
    fontWeight: '700',
  }
});

export default Typography;