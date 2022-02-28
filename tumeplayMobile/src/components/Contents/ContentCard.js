import React from 'react';
import {TouchableOpacity, StyleSheet, View, Image} from 'react-native';
import Text from '../../components/Text';
import {Fonts} from '../../styles/Style';
import {REACT_APP_URL} from '@env';

const ContentCard = props => {
  const {item, backgroundColor, navigation, content_ids} = props;
  const imageUrl = {uri: REACT_APP_URL + item?.image?.url};

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('Content', {
          content_id: item?.id,
          content_ids: content_ids,
          initial: true,
        })
      }
      style={[styles.container, {backgroundColor: backgroundColor}]}>
      <View style={styles.cardContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.level}>NIVEAU {item?.niveau?.value}</Text>
          <Text style={styles.title}>{item?.title}</Text>
        </View>
        <View style={styles.imageContainer}>
          <Image source={imageUrl} style={styles.image} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 130,
    marginVertical: 2,
  },
  cardContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  level: {
    fontFamily: Fonts.strongText,
    color: '#E85439',
    lineHeight: 21,
    fontSize: 14,
    paddingTop: 15,
  },
  titleContainer: {
    width: '50%',
    paddingLeft: 20,
  },
  title: {
    fontFamily: Fonts.subtitle,
    fontSize: 18,
    lineHeight: 24,
  },
  imageContainer: {
    width: '50%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
});

export default ContentCard;