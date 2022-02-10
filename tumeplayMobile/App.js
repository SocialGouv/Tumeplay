import React, {useState, useEffect} from 'react';
import Onboarding from './src/views/Onboarding';
import Signup from './src/views/Signup';
import EncryptedStorage from 'react-native-encrypted-storage';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ContentsPage from './src/views/Contents';
import ContentPage from './src/views/Contents/ContentPage';
import Navbar from './src/components/Navbar';
import QuizzStartPage from './src/views/QuizzStartPage';
import {useLazyQuery, useQuery} from '@apollo/client';
import {GET_THEMES} from './src/services/api/themes';
import AppContext from './AppContext';
import QuizzModule from './src/components/Quizz/QuizzModule';
import BoxOrder from './src/views/BoxOrder';
import Box from './src/views/Box';
import QuizzFinishScreen from './src/components/Quizz/QuizzFinishScreen';
import {View, StyleSheet} from 'react-native';
import Text from './src/components/Text';
import {GET_MOBILE_USER} from './src/services/api/mobile_users';
import Journey from './src/views/Journey';
const NavigationStack = createNativeStackNavigator();
import {Colors} from './src/styles/Style';
import {REACT_APP_URL} from '@env';

const App = () => {
  const [user, setUser] = useState({});
  const [doneModules_ids, setDoneModules_ids] = useState([]);
  const [thematiques, setThematiques] = useState([]);
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  const {data: data1, loading: loading1} = useQuery(GET_THEMES);

  const navTheme = DefaultTheme;
  navTheme.colors.background = Colors.background;

  const checkUserIdInStorage = async () => {
    let encryptedUser = await EncryptedStorage.getItem('user');
    if (encryptedUser) {
      const tmpUser = JSON.parse(encryptedUser);
      const tmpUser_id = tmpUser?.user_id;
      if (tmpUser_id) {
        user.user_id = tmpUser_id;
        getMobileUser(user.user_id);
      }
    } else {
      setIsUserLoaded(true);
      setUser({});
    }
  };

  const getMobileUser = async user_id => {
    const response = await fetch(
      REACT_APP_URL + '/utilisateurs-mobiles/' + user_id,
    );
    const tmpUser = await response.json();
    if (tmpUser?.status === 404) {
      clearStorage();
      setUser({});
    } else if (tmpUser) {
      setUser(tmpUser);
    }
    setIsUserLoaded(true);
  };

  const reloadUser = () => {
    getMobileUser(user.user_id);
  };

  const retrieveDoneModulesIds = () => {
    let successHistories = user?.history?.filter(
      history => history.status === 'success',
    );
    let tmpIds = [];
    if (successHistories) {
      tmpIds = successHistories.map(history => history.module_id);
    }
    setDoneModules_ids([...tmpIds]);
  };

  useEffect(() => {
    if (user && user.history) retrieveDoneModulesIds();
  }, [user]);

  useEffect(() => {
    if (!loading1 && data1) {
      setThematiques([...data1.thematiqueMobiles]);
    }
  }, [loading1, data1]);

  const clearStorage = async () => {
    await EncryptedStorage.clear();
  };

  useEffect(() => {
    // clearStorage();
    checkUserIdInStorage();
  }, []);

  const contextValues = {
    user,
    setUser,
    reloadUser,
    user_id: user.user_id,
    strapi_user_id: user.id,
    thematiques,
    doneModules_ids,
    setDoneModules_ids,
  };

  return (
    <AppContext.Provider value={contextValues}>
      {!isUserLoaded && (
        <View style={styles.loadingScreen}>
          <Text>Chargement ...</Text>
        </View>
      )}
      {isUserLoaded && !user?.isOnboarded && (
        <Onboarding user={user} setUser={setUser} />
      )}
      {isUserLoaded && user?.isOnboarded && !user?.isSignedUp && (
        <Signup user={user} setUser={setUser} />
      )}
      {user?.isOnboarded && user?.isSignedUp && (
        <NavigationContainer theme={navTheme}>
          <NavigationStack.Navigator
            screenOptions={{
              headerShown: false,
            }}>
            <NavigationStack.Screen name="Home" component={Navbar} />
            <NavigationStack.Screen
              name="ContentsPage"
              component={ContentsPage}
            />
            <NavigationStack.Screen name="Content" component={ContentPage} />
            <NavigationStack.Screen
              name="QuizzStartPage"
              component={QuizzStartPage}
            />
            <NavigationStack.Screen
              name="QuizzModule"
              component={QuizzModule}
            />
            <NavigationStack.Screen
              name="QuizzFinishScreen"
              component={QuizzFinishScreen}
            />
            <NavigationStack.Screen name="BoxOrder" component={BoxOrder} />
            <NavigationStack.Screen name="Box" component={Box} />
            <NavigationStack.Screen name="Parcours" component={Journey} />
          </NavigationStack.Navigator>
        </NavigationContainer>
      )}
    </AppContext.Provider>
  );
};

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
