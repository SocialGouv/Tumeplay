import React, {useEffect, useState} from 'react';
import {
  ImageBackground,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import bg from '../../assets/Quiiz_BG.png';
import {Fonts} from '../../styles/Style';
import Button from '../Button';
import QuizzAnswerButton from './QuizzAnswerButton';
import TopLevelPointIndicator from './TopLevelPointIndicator';
import _ from 'lodash';
import Container from '../global/Container';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors} from '../../styles/Style';
import config from '../../../config';

const QuizzModule = ({navigation, route}) => {
  const questions = route?.params?.questions;
  const module_id = route?.params?.module_id;
  const question = questions[0];
  const [hasAnswered, setHasAnswered] = useState(false);
  const [responses, setResponses] = useState([]);
  const [displayResponse, setDisplayResponse] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [remainingQuestions, setRemainingQuestions] = useState([]);
  const retry = route?.params?.retry;
  const [disabled, setDisabled] = useState(false);
  const [showAnswer, setshowAnswer] = useState(false);

  const formatAnswers = () => {
    let tmpResponses = [];
    for (let [key, value] of Object.entries(question?.responses)) {
      key = key.substring(9, 10);
      tmpResponses?.push({key, value});
    }
    tmpResponses?.shift();
    setResponses(tmpResponses);
  };

  const displayAnswerText = ans => {
    if (ans === responses[responses?.length - 1]?.value) {
      correctAnswers.push(question);
      setCorrectAnswers([...correctAnswers]);
    } else {
      wrongAnswers.push(question);
      setWrongAnswers([...wrongAnswers]);
    }
    setDisabled(!disabled);
    setHasAnswered(!hasAnswered);
    setDisplayResponse(!displayResponse);
  };

  const displayAnswer = responses?.map((ans, index) => {
    if (index < responses.length - 1)
      return (
        <QuizzAnswerButton
          answer={ans}
          correctAnswer={responses[responses?.length - 1]?.value}
          hasAnswered={hasAnswered}
          disabled={disabled}
          key={ans.key}
          onPress={() => displayAnswerText(ans.key)}
        />
      );
  });

  const goToNextQuestion = () => {
    if (remainingQuestions.length === 0) {
      navigation.navigate('QuizzFinishScreen', {
        correctAnswers: correctAnswers,
        wrongAnswers: wrongAnswers,
        module_id: module_id,
      });
    } else {
      setshowAnswer(false);
      navigation.navigate('QuizzModule', {
        questions: _.shuffle(remainingQuestions),
        module_id: module_id,
      });
      setDisabled(!disabled);
      setHasAnswered(!hasAnswered);
      setDisplayResponse(!displayResponse);
    }
  };

  useEffect(() => {
    setRemainingQuestions(questions?.filter(ques => ques.id !== question.id));
    formatAnswers();
    if (retry) {
      setDisplayResponse(!displayResponse);
      setHasAnswered(!hasAnswered);
      setDisabled(!disabled);
      setWrongAnswers([]);
      setCorrectAnswers([]);
    }
  }, [question]);

  const showMoreAnswer = () => {
    setshowAnswer(!showAnswer);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Container background={bg} style={styles.container}>
        <View style={styles.levelIndicator}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
              name="md-arrow-back"
              size={30}
              color="#000"
              style={styles.icon}
            />
          </TouchableOpacity>
          <TopLevelPointIndicator />
        </View>
        <View style={styles.stepIndicatorContainer}>
          <View style={styles.stepIndicator}>
            <Text style={styles.indicator}>{questions?.length}</Text>
          </View>
        </View>
        <Text style={styles.question}>{question?.text_question}</Text>
        <View style={styles.answersContainer}>{displayAnswer}</View>
        {displayResponse ? (
          <View style={styles.answerContainer}>
            <Text style={styles.textAnswer}>
              {!showAnswer && config.deviceWidth <= 400
                ? question?.text_answer.substring(0, 80) + '...'
                : question?.text_answer}
            </Text>
            {config.deviceWidth <= 400 && (

              <Text onPress={showMoreAnswer}>
                {showAnswer ? 'Voir moins' : 'Voir plus'}
              </Text>
            )}
          </View>
        ) : null}
        {hasAnswered ? (
          <View style={styles.buttonContainer}>
            <Button
              text={'Suivant'}
              size="large"
              icon={true}
              style={styles.bottomButton}
              onPress={() => goToNextQuestion()}
            />
          </View>
        ) : null}
      </Container>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    height: config.deviceWidth <= 400 ? 'auto' : '100%',

  },
  container: {
    height: '100%',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
  },
  levelIndicator: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 26,
  },
  stepIndicatorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  stepIndicator: {
    width: 58,
    height: 58,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#FFF',
    borderWidth: 5,
    marginBottom: 16,
  },
  indicator: {
    fontFamily: Fonts.subtitle,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 22,
    color: Colors.black,
  },
  question: {
    marginBottom: 10,
    fontFamily: Fonts.subtitle,
    fontSize: config.deviceWidth <= 320 ? 16 : 22,
    lineHeight: 24,
    fontWeight: '700',
    color: Colors.black,
  },
  answersContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  answerContainer: {
    alignContent: 'center',
  },
  textAnswer: {
    marginTop: 10,
    textAlign: 'left',
    color: Colors.black,
  },
  buttonContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: config.deviceWidth <= 400 ? 'relative' : 'relative',

    paddingVertical: 20,
    flex: 1,
  },
});

export default QuizzModule;
