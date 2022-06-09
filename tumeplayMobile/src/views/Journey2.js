import React, {useContext, useState, useEffect} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import Container from '../components/global/Container';
import Condom from '../components/Journey/Condom';
import Title from '../components/Title';
import config from '../../config';
import ThemePicker from '../components/Journey/ThemePicker';
import AppContext from '../../AppContext';
import CircleList from 'react-native-circle-list';
import {SvgXml} from 'react-native-svg';
import ThemeCard from '../components/Journey/ThemeCard';
import Button from '../components/Button';
import TextBase from '../components/Text';
import {useQuery} from '@apollo/client';
import {GET_ALL_MODULES} from '../services/api/modules';
import {useNavigation} from '@react-navigation/native';

const Journey2 = () => {
  const navigation = useNavigation();
  const {thematiques, doneModules_ids} = useContext(AppContext);
  const [themes] = useState(thematiques);
  //the CircleList package require to have an array with a minimum of 12 elements to work properly. So we duplicate the data to fit the requirements
  const data = [...themes, ...themes];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState(themes[0]);
  const [fullModuleList, setFullModuleList] = useState([]);
  const [moduleCount, setModuleCount] = useState();

  const {data: data2, loading: loading} = useQuery(GET_ALL_MODULES);

  const _keyExtractor = (_item, index) => index;

  const _renderItem = ({item, index}) => (
    <ThemePicker
      theme={item}
      index={index}
      selectedIndex={selectedIndex}
      length={data.length}
      onPress={handleNavigation}
    />
  );

  const backgroundSvg = `
   <svg width="157" height="336" viewBox="0 0 157 336" fill="none">
        <path
          d="M86.8232 315.781L159.424 335.292C164.506 336.658 169.5 332.829 169.5 327.566L169.5 8.43378C169.5 3.17111 164.506 -0.657929 159.424 0.707885L86.8232 20.2186C85.4651 20.5835 84.2272 21.3 83.2343 22.2959L24.22 81.4843C23.2299 82.4773 22.5182 83.7131 22.1563 85.0679L0.551651 165.935C0.190216 167.288 0.190216 168.712 0.55165 170.065L22.1562 250.932C22.5182 252.287 23.2299 253.523 24.22 254.516L83.2342 313.704C84.2272 314.7 85.4651 315.416 86.8232 315.781Z"
          fill="#F7EFE6"
        />
      </svg>
  `;

  const handleNavigation = () => {
    navigation.navigate('ModuleList', {
      theme: selectedTheme,
      count: moduleCount,
    });
  };

  useEffect(() => {
    if (selectedIndex + 1 === data.length) {
      setSelectedTheme(data[0]);
    } else {
      setSelectedTheme(data[selectedIndex + 1]);
    }
  }, [selectedIndex]);

  const handleModuleCount = () => {
    let modules = fullModuleList.filter(item => {
      return item?.thematique_mobile?.title === selectedTheme?.title;
    });
    let doneModule_count = modules.map(m => {
      let tmp = 0;
      if (doneModules_ids?.includes(parseInt(m.id, 10))) {
        tmp++;
      }
      return tmp;
    });
    if (modules.length > 0) {
      setModuleCount(modules.length - doneModule_count.reduce((a, b) => a + b));
    } else {
      setModuleCount(0);
    }
  };

  useEffect(() => {
    handleModuleCount();
  }, [selectedTheme, fullModuleList]);

  useEffect(() => {
    if (!loading && data2.modules) {
      setFullModuleList(data2.modules);
    }
  }, [data2, loading]);

  return (
    <Container style={styles.container}>
      <Title title="Ton parcours" />
      <ThemeCard
        style={styles.theme_card}
        selectedTheme={selectedTheme}
        moduleCount={moduleCount}
      />
      <View style={styles.roundTrait} />
      <CircleList
        containerStyle={styles.wheel}
        data={data}
        keyExtractor={_keyExtractor}
        elementCount={13}
        selectedItemScale={1}
        renderItem={_renderItem}
        radius={config.deviceWidth / 1.85}
        swipeSpeedMultiplier={15}
        visiblityPadding={50}
        onScroll={e => setSelectedIndex(e)}
        style={[styles.wheel]}
      />
      <SvgXml
        xml={backgroundSvg}
        width="50%"
        height={
          Platform.OS === 'ios' && config.deviceHeight <= 667 ? '55%' : '47%'
        }
        style={styles.image}
      />
      <Condom
        style={styles.condom}
        fullModuleLength={fullModuleList.length}
        doneModules_ids={doneModules_ids}
      />
      <TextBase style={styles.description}>
        Choisis un thème pour trouver ton prochain défi !
      </TextBase>
      <Button
        size="large"
        text={'Je choisis ce thème'}
        style={styles.bottom_buttom}
        icon
        isDisabled={false}
        onPress={handleNavigation}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // position: 'relative',
  },
  image: {
    position: 'absolute',
    top: config.deviceHeight / 4,
    zIndex: -1,
    right: -10,
  },
  roundTrait: {
    transform: [{rotate: '270deg'}],
    borderWidth: 2,
    position: 'absolute',
    top: config.deviceHeight / 6,
    left: config.deviceWidth / 2,
    zIndex: 0,
    borderRadius: 360,
    borderStyle: 'dotted',
    width: config.deviceWidth * 0.7 * 1.5,
    height: config.deviceWidth * 1.2,
  },
  wheel: {
    transform: [{rotate: '270deg'}],
    zIndex: 1,
    position: 'absolute',
    left: 0,
    top: config.deviceHeight / 3.75,
    minWidth: config.deviceWidth * 0.7 * 2,
    height: config.deviceWidth * 0.8,
    backgroundColor: 'transparent',
  },
  condom: {
    position: 'relative',
    top: config.deviceHeight / 5,
    right: -25,
    zIndex: -1,
  },
  theme_card: {
    position: 'absolute',
    left: config.deviceWidth / 30,
    top: config.deviceHeight / 5,
    zIndex: 10,
  },
  description: {
    position: 'absolute',
    width: config.deviceWidth * 0.45,
    bottom: config.deviceHeight * 0.14,
    marginLeft: 15,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
  },
  bottom_buttom: {
    position: 'absolute',
    bottom: 25,
    alignSelf: 'center',
    zIndex: 20,
  },
});

export default Journey2;
