import React, {useEffect, useContext} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import TopLevelPointIndicator from '../TopLevelPointIndicator';
import wave from '../../../assets/wave.png';
import congrats from '../../../assets/custom_images/congrats.png';
import clap from '../../../assets/custom_images/clap.png';
import coin from '../../../assets/coin.png';
import {Fonts} from '../../../styles/Style';
import Button from '../../Button';
import bg from '../../../assets/QuizzWrongBG.png';
import _ from 'lodash';
import AppContext from '../../../../AppContext';
import Container from '../../global/Container';

const QuizzWithWrongAnswers = props => {
  const {correctAnswers, wrongAnswers, navigation, pointsEarned, module_id} =
    props;

  const context = useContext(AppContext);
  const points = context.points;
  const setPoints = context.setPoints;
  const restartQuizz = () => {
    if (correctAnswers.length < 10) {
      navigation.navigate('QuizzModule', {
        questions: _.shuffle(wrongAnswers),
        module_id: module_id,
        retry: true,
      });
    }
  };

  useEffect(() => {
    setPoints(points + pointsEarned);
  }, []);

  return (
    <Container backgroundColor={bg} style={styles.container}>
      <TopLevelPointIndicator style={styles.levelIndicator} />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>BRAVO !</Text>
        <Image source={wave} />
      </View>
      <View style={styles.pointsContainer}>
        <Text style={styles.points}>
          {' '}
          <Text style={styles.boldPoints}>+ {pointsEarned} </Text>
          points
        </Text>
        <Image source={coin} style={styles.coin} />
      </View>
      <Image source={congrats} />
      <View style={styles.answerContainer}>
        <Text style={styles.answerText}>
          ✅ {correctAnswers?.length}{' '}
          {correctAnswers.length > 1
            ? 'réponses correctes'
            : 'réponse correcte'}
        </Text>
        <Text style={styles.answerText}>
          ❌ {wrongAnswers?.length}{' '}
          {wrongAnswers.length > 1
            ? 'réponses incorrectes'
            : 'réponse incorrecte'}
        </Text>
      </View>
      <Image source={clap} />
      <Button
        text={'Je continue'}
        size={'large'}
        style={styles.button}
        onPress={() => restartQuizz()}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  levelIndicator: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: Fonts.title,
    fontSize: 30,
    lineHeight: 38,
  },
  boldPoints: {
    fontFamily: Fonts.subtitle,
    fontSize: 22,
  },
  points: {
    fontFamily: Fonts.strongText,
    fontSize: 22,
  },
  coin: {
    width: 30,
    height: 30,
  },
  pointsContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: 180,
    justifyContent: 'space-between',
  },
  answerContainer: {
    minWidth: 240,
    minHeight: 70,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 25,
  },
  answerText: {
    fontSize: 18,
    lineHeight: 22,
    padding: 10,
  },
  button: {
    position: 'absolute',
    bottom: 35,
  },
});

export default QuizzWithWrongAnswers;
