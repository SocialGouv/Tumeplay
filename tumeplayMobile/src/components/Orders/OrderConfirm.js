import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Text from '../../components/Text';
import React from 'react';
import image from '../../assets/LOGO_COLISSIMO.png';
import Button from '../Button';
import OrdersAPI from '../../services/api/orders';
import config from '../../../config';
import {useNavigation} from '@react-navigation/native';

const OrderConfirm = props => {
  const {
    userInfos,
    setOrderConfirm,
    userAdressInformations,
    deliveryMode,
    box,
  } = props;

  const navigation = useNavigation();

  const sendOrder = async () => {
    const deptcode = userAdressInformations?.context?.split(',')[0];
    const dept = userAdressInformations?.context?.split(',')[1];
    const region = userAdressInformations?.context?.split(',')[2];
    let requestBody = {
      first_name: userInfos.first_name,
      last_name: userInfos.last_name,
      email: userInfos.email,
      phone: userInfos.phone_number,
      address: userInfos.address,
      address_region: region,
      address_deptcode: deptcode,
      address_dept: dept,
      address_zipcode: userAdressInformations.postcode,
      address_city: userAdressInformations.city,
      box_name: box.title,
      delivery: deliveryMode,
      environnement: 'metropole',
      content: [
        {
          __component: 'commandes.box',
          box: box.id,
        },
      ],
    };
    await OrdersAPI.orderBoxes(requestBody);
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.smallContainer}>
          <View style={styles.nameContainer}>
            <Text style={styles.boldText}>
              {userInfos.first_name + ' ' + userInfos.last_name}
            </Text>
          </View>
          <View>
            <Text style={styles.text}>Adresse de livraison :</Text>
            <Text style={styles.text}>{userInfos.address}</Text>
            <Text style={styles.text}>{userInfos.phone_number}</Text>
            <Text style={styles.text}>{userInfos.email}</Text>
          </View>
        </View>
        <View style={styles.smallContainer}>
          <TouchableOpacity onPress={() => setOrderConfirm(false)}>
            <Text style={styles.redText}>Modifier les informations</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <Image source={image} style={styles.image} />
        <View style={styles.bottomtextContainer}>
          <Text style={styles.bottomText}>
            Disponible entre{' '}
            <Text style={styles.bottomBoldText}>3 et 5 jours ouvrés.</Text> À
            noter, pas d'envoi d'email de la part de Colissimo
          </Text>
        </View>
      </View>
      <Button
        style={styles.button}
        text="Je valide cette commande"
        size="large"
        special
        onPress={() => sendOrder()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#FBF7F2',
  },
  topContainer: {
    flexDirection: 'row',
  },
  smallContainer: {
    flex: 1,
    width: '50%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop: 12,
  },
  nameContainer: {
    flexDirection: 'row',
  },
  redText: {
    color: '#D42201',
    lineHeight: 22,
    fontWeight: '500',
    fontSize: config.deviceWidth > 375 ? 14 : 13,
    textDecorationLine: 'underline',
  },
  boldText: {
    fontSize: config.deviceWidth > 375 ? 14 : 14,
    lineHeight: 22,
    fontWeight: '600',
  },
  text: {
    fontSize: config.deviceWidth > 375 ? 14 : 14,
    lineHeight: 22,
    fontWeight: '400',
  },
  image: {
    width: 50,
    height: 50,
    marginBottom: 20,
  },
  bottomText: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '400',
  },
  bottomBoldText: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '600',
  },
  bottomtextContainer: {
    paddingBottom: 22,
    width: config.deviceWidth > 375 ? 290 : 280,
  },
  bottomContainer: {
    flex: 0.9,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  button: {
    alignSelf: 'center',
  },
});

export default OrderConfirm;
