import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomePage from '../views/HomePage';
import Thematiques from '../views/Thematiques';
import Journey from '../views/Journey';
import Box from '../views/Box';
import {Colors} from '../styles/Style';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icons from 'react-native-vector-icons/FontAwesome5';
import AppContext from '../../AppContext';
import QuizzLoader from './global/QuizzLoader';

const Tab = createBottomTabNavigator();

const Navbar = ({navigation, route}) => {
  const {user} = useContext(AppContext);
  return (
    <Tab.Navigator
      initialRouteName="Accueil"
      screenOptions={() => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.black,
        tabBarItemStyle: {padding: 0},
        tabBarStyle: {
          position: 'relative',
          bottom: 0,
          backgroundColor: Colors.lightCorail,
        },
      })}>
      <Tab.Screen
        name="Accueil"
        component={HomePage}
        options={{
          tabBarIcon: ({size, color}) => (
            <MaterialIcons name="home" color={color} size={size} />
          ),
        }}
        navigation={navigation}
      />
      <Tab.Screen
        name="Posts"
        component={Thematiques}
        options={{
          tabBarIcon: ({size, color}) => (
            <MaterialIcons name="import-contacts" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Jouer"
        component={QuizzLoader}
        options={{
          tabBarIcon: ({size, color}) => (
            <Icons
              style={{
                position: 'absolute',
                bottom: 15,
              }}
              name="dice"
              color={color}
              size={50}
            />
          ),
        }}
        initialParams={{homeScreen: true}}
      />
      <Tab.Screen
        name="Parcours"
        component={Journey}
        options={{
          tabBarIcon: ({size, color}) => (
            <MaterialIcons name="timeline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Kit"
        component={Box}
        options={{
          tabBarIcon: ({size, color}) => (
            <MaterialIcons name="card-giftcard" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Navbar;
