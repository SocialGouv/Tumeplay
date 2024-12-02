import {TouchableOpacity, Linking, View} from 'react-native';
import React from 'react';
import {Platform} from 'react-native';

const LinkOpenner = ({children, url}) => {
  const onPress = () => {
    if (Platform.OS === 'android') {
      Linking.openURL(url);
    } else {
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.log("Don't know how to open URI: " + url);
        }
      });
    }
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          marginVertical: 10,
        }}>
        {children}
      </View>
    </TouchableOpacity>
  );
};

export default LinkOpenner;
