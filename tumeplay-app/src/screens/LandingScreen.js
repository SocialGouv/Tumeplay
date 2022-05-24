import React, {useState, useEffect, forwardRef} from 'react';
import {Text, View, Image, SafeAreaView, ScrollView} from 'react-native';
import PropTypes from 'prop-types';

import useIsMounted from '../hooks/isMounted';
import autoScrollToTop from '../hooks/autoScrollToTop';

import UnderlineText from './components/global/UnderlineText';
import CustomTouchableOpacity from './components/global/CustomTouchableOpacity';
import TextWithSound from './components/global/TextWithSound';

import LandingThemeGrid from './components/landing/LandingThemeGrid';
import ProductErrorModal from './components/tunnel/ProductErrorModal';

import CustomFooter from './CustomFooter';
import Styles from '../styles/Styles';
import Tracking from '../services/Tracking';
import {GET_THEMES, GET_SOSTHEME} from '../services/api/themes';
import {useQuery} from '@apollo/client';

const REACT_APP_ZONE = process.env.REACT_APP_ZONE;

LandingScreen.propTypes = {
  navigation: PropTypes.object,
};
export default function LandingScreen(props) {
  const [showErrorModal, setShowErrorModal] = useState(false);

  const isMounted = useIsMounted();

  autoScrollToTop(props);

  const item = {
    arrow: require('../assets/pictures/right-arrow.png'),
    title: 'Quel est le thème que tu veux découvrir ?',
    subtitle:
      'Explore nos thématiques, découvre les questions réponses associées et réponds aux quiz pour gagner des box !',
    bottomTitle1: 'Trouve les lieux utiles à tes besoins',
    bottomTitle2: 'Échange avec un professionnel',
  };

  function _onSelectedTheme(selectedTheme) {
    Tracking.themeSelected(selectedTheme);
    props.navigation.navigate('ContentScreen', {
      selectedTheme: selectedTheme,
    });
  }

  const {data, loading} = useQuery(GET_SOSTHEME);
  function _onSelected_lieuxUtiles() {
    if (!loading) {
      props.navigation.navigate('ContentScreen', {
        selectedTheme: data.thematiques[0],
      });
    }
  }

  function _onSelected_echangeProfessionnel() {
    props.navigation.navigate('ContentScreen');
  }

  function _toggleErrorModal() {
    setShowErrorModal(!showErrorModal);
  }

  const ForwardedErrorModal = forwardRef(() => (
    <ProductErrorModal
      showModal={showErrorModal}
      onClose={_toggleErrorModal}
      modalTitle={'Oups !'}>
      <Text>
        Une erreur est survenue lors de la connexion. Nous t&apos;invitons à
        vérifier ta connexion et rafraichir la page.
      </Text>
    </ProductErrorModal>
  ));

  const ThemesCards = () => {
    const {data, loading} = useQuery(GET_THEMES);
    if (!loading) {
      return data && data.thematiques && (
        <LandingThemeGrid
          onPress={_onSelectedTheme}
          themes={data.thematiques}></LandingThemeGrid>
      ) || <Text>Aucune thématique trouvée :/</Text>
    }

    return <View />;
  };

  return (
    <SafeAreaView style={Styles.safeAreaView}>
      <ScrollView>
        {/* Title and grid */}
        <View>
          <Text style={Styles.landingScreenTitle}>{item.title}</Text>
          {REACT_APP_ZONE === 'guyane' ? (
            <TextWithSound
              style={Styles.landingScreenSubtitle}
              sound={'Accueil_1.MP3'}
              useLocal={true}>
              Explore nos thématiques, découvre les questions réponses associées
              et réponds aux quiz pour recevoir des box gratuitement !
            </TextWithSound>
          ) : (
            <Text style={Styles.landingScreenSubtitle}>
              Explore nos thématiques, découvre les questions réponses associées
              et réponds aux quizz pour recevoir des box gratuitement !
            </Text>
          )}
          <View
            style={{
              flex: 1,
              flexWrap: 'wrap',
              flexDirection: 'row',
            }}>
            {ThemesCards()}
          </View>
        </View>

        {/* Bottom part */}
        <View style={{marginLeft: 15, marginRight: 15}}>
          <CustomTouchableOpacity
            style={[Styles.landingBottomWrapper]}
            onPress={_onSelected_lieuxUtiles}>
            <Text style={Styles.landingBottomText}>{item.bottomTitle1}</Text>
            <View
              style={{
                flex: 0.2,
                paddingRight: 10,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  marginLeft: 10,
                  marginRight: 10,
                  width: 10,
                  height: 10,
                  resizeMode: 'contain',
                }}
                source={item.arrow}
              />
              <Text style={Styles.landingBottomButtonNext}>Voir</Text>
            </View>
          </CustomTouchableOpacity>
          {/*
          <CustomTouchableOpacity
            style={[Styles.landingBottomWrapper]}
            onPress={_onSelected_echangeProfessionnel}>
            <Text style={Styles.landingBottomText}>{item.bottomTitle2}</Text>
            <View
              style={{
                flex: 0.25,
                paddingRight: 10,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  marginLeft: 10,
                  marginRight: 10,
                  width: 10,
                  height: 10,
                  resizeMode: 'contain',
                }}
                source={item.arrow}
              />
              <Text style={Styles.landingBottomButtonNext}>Accéder</Text>
            </View>
          </CustomTouchableOpacity>
          */}
        </View>
        <CustomFooter navigation={props.navigation} />
        <ForwardedErrorModal />
      </ScrollView>
    </SafeAreaView>
  );
}
