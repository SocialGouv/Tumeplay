import React, {useState, useEffect} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import wave from '../assets/wave.png';
import {Colors, Fonts} from '../styles/Style';
import EncryptedStorage from 'react-native-encrypted-storage';

const Title = ({title}) => {
  const [userName, setUserName] = useState();

  const retrieveUserName = async () => {
    const user = JSON.parse(await EncryptedStorage.getItem('user'));
    setUserName(user.first_name);
  };

  useEffect(() => {
    retrieveUserName();
  }, []);

  return (
    <View style={styles.titleContainer}>
      {title ? (
        <Text style={styles.title}>{title}</Text>
      ) : (
        <Text style={styles.title}>Hello</Text>
      )}
      <Image source={wave} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    fontFamily: Fonts.title,
    lineHeight: 38,
    color: Colors.black,
  },
  image: {
    marginTop: 3,
  },
});

export default Title;
