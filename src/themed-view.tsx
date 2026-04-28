import React from 'react';
import { View, ViewProps } from 'react-native';

export const ThemedView: React.FC<ViewProps> = ({ style, ...rest }) => (
  <View style={[{ backgroundColor: '#3e3f42' }, style]} {...rest} />
);
