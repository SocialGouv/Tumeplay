import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import {Colors} from '../../styles/Style';
import config from '../../../config';

const QuizzAnswerButton = props => {
  const {
    answer,
    onPress,
    name,
    correctAnswer,
    hasAnswered,
    disabled,
    answeredKey,
  } = props;

  return (
    <TouchableOpacity disabled={disabled} onPress={onPress} name={name}>
      <View
        style={[
          styles.button,
          hasAnswered && answeredKey === answer.key && styles.wrongAnswer,
          hasAnswered && answer.key === correctAnswer && styles.correctAnswer,
        ]}>
        <Text
          style={[
            styles.value,
            hasAnswered && answer.key === correctAnswer && {fontWeight: '700'},
          ]}>
          {answer.value}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'center',
    minWidth: config.deviceWidth <= 375 ? '100%' : 170,
    maxWidth: config.deviceWidth <= 375 ? '100%' : 170,
    marginVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: config.deviceWidth <= 375 ? 50 : 80,
    backgroundColor: '#F3E1E8',
  },
  correctAnswer: {
    borderColor: '#51B070',
    borderWidth: 1,
    backgroundColor: '#DDF4ED',
    fontWeight: '600',
  },
  wrongAnswer: {
    backgroundColor: '#FFF',
  },
  value: {
    justifyContent: 'center',
    color: Colors.black,
    paddingRight: 10,
    textAlign: 'center',
  },
  emoji: {
    justifyContent: 'center',
  },
});

export default QuizzAnswerButton;
