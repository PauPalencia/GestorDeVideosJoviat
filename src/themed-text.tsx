import React from 'react';
import { Text, TextProps } from 'react-native';

export const ThemedText: React.FC<TextProps & { type?: string }> = ({ style, ...rest }) => (
  <Text style={[{ color: '#f2f5f4' }, style]} {...rest} />
);
