import React, {useState, useEffect, useContext} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import Text from '../components/Text';
import {useQuery} from '@apollo/client';
import {GET_THEMES} from '../services/api/themes';
import {Fonts} from '../styles/Style';
import ThemeCard from '../components/ThemeCard';
import pleasure from '../assets/custom_images/PLAISIR.png';
import culture from '../assets/custom_images/CULTURE_G.png';
import anatomie from '../assets/custom_images/ANATOMIE.png';
import medical from '../assets/custom_images/MEDICAL.png';
import law from '../assets/custom_images/LOI.png';
import gender from '../assets/custom_images/IDENTITE.png';
import relationship from '../assets/custom_images/RELATIONS.png';
import orientation from '../assets/custom_images/ORIENTATION.png';
import link from '../assets/custom_images/LIENS.png';
import {REACT_APP_URL} from '@env'

import Title from '../components/Title';
import background from '../assets/Main_BG.png';
import Container from '../components/global/Container';
import TopLevelPointIndicator from '../components/Quizz/TopLevelPointIndicator';
import AppContext from '../../AppContext';

export default function Thematiques(props) {
  const {navigation} = props;
  const {user} = useContext(AppContext);
  const {data, loading} = useQuery(GET_THEMES, {
    variables: {level: user.level},
  });
  const [thematiques, setThematiques] = useState([]);

  const renderItem = ({item, index}) => {
    return (
      <ThemeCard
        key={item.id}
        index={index}
        theme={item}
        backgroundColor={item.color}
        borderColors={item.border_color}
        image={REACT_APP_URL + item.image?.url}
        navigation={navigation}
      />
    );
  };

  useEffect(() => {
    if (!loading && data) {
      setThematiques(data.thematiqueMobiles);
    }
  }, [data, loading]);

  return (
    <Container style={styles.container} source={background}>
      <TopLevelPointIndicator style={styles.pointsIndicator} />
      <Title title="Informe-toi" />
      <Text style={styles.subtitle}>Sélectionne un thème qui t'intéresse</Text>
      <View style={styles.listContainer}>
        <FlatList
          data={thematiques}
          renderItem={renderItem}
          directionalLockEnabled={true}
          keyExtractor={item => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          style={styles.themeContainer}
        />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  pointsIndicator: {
    alignSelf: 'flex-end',
    alignContent: 'flex-end',
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    fontFamily: Fonts.title,
    lineHeight: 38,

    marginTop: 12,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 25,
    alignContent: 'flex-start',
    textAlign: 'left',
    fontFamily: Fonts.subtitle,
    paddingLeft: 18,
    marginTop: 13,
    marginBottom: 16,
  },
  listContainer: {
    flex: 1,
    alignSelf: 'center',
  },
  themeContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    // justifyContent: 'center',
  },
});
