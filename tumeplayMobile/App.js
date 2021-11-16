import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import Container from './src/components/Container';

const App = () => {
  return (
    <Container>
      <View>
        <Text>Tumeplay !!!!</Text>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
