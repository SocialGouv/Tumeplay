import React, {useState, useEffect} from 'react';
import useIsMounted from '../../hooks/isMounted';
import Geolocation from '@react-native-community/geolocation';
import openGeocoder from 'node-open-geocoder';
import Colors from '../../styles/Color';
import Styles from '../../styles/Styles';
import referentAPI from '../../services/api/referents';
import OpenStreetMap from '../components/global/OpenStreetMap';
import Backlink from '../components/tunnel/Backlink';
import PointOfInterestCard from '../components/global/PointOfInterestCard';
import CustomTextInput from '../components/tunnel/CustomTextInput';
import AddressValidator from '../../services/AddressValidator';
import TunnelUserAdressStyle from '../../styles/components/TunnelUserAdress';
import TextWithSound from '../components/global/TextWithSound';

import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const zipCodeTest = /^[0-9]{5}$/;

const TunnelReferentSelect = props => {
  const defaultPosition = {
    coords: {
      latitude: 48.8566969,
      longitude: 2.3514616,
    },
    delta: {
      latitude: 0.009,
      longitude: 0.009,
    },
    isValid: true,
  };
  var defaultReferent = {
    userZipCode: '',
    zipCode: '',
    city: '',
  };
  var pickupTimer = false;

  const [selectedReferent, setSelectedReferent] = useState(
    props.navigation.state.params.selectedReferent,
  );
  const [deliveryType] = useState(props.navigation.state.params.deliveryType);
  const [selectedItem] = useState(props.navigation.state.params.selectedItem);
  const [selectedProducts] = useState(
    props.navigation.state.params.selectedProducts,
  );

  const [currentPosition, setCurrentPosition] = useState(defaultPosition);
  const [localAdress, setLocalAdress] = useState(defaultReferent);
  const [localValid, setLocalValid] = useState({});
  const [referentPoints, setReferentPoints] = useState([]);
  const [mapLayout, setMapLayout] = useState({width: 250, height: 250});
  const [displayReset, setDisplayReset] = useState(false);
  const [displayMap, setDisplayMap] = useState(true);
  const [invalidZipCode, setInvalidZipCode] = useState(false);

  const isMounted = useIsMounted();

  useEffect(() => {
    if (isMounted.current) {
      Geolocation.getCurrentPosition(
        position => {
          const coordinates = {
            lat: position.coords.latitude,
            long: position.coords.longitude,
          };
          openGeocoder()
            .reverse(coordinates.long, coordinates.lat)
            .end((err, res) => {
              if (
                res.address.state === 'Île-de-France' ||
                res.address.state === 'Aquitaine'
              ) {
                currentPosition.coords.latitude = position.coords.latitude;
                currentPosition.coords.longitude = position.coords.longitude;
                setCurrentPosition({...currentPosition});
              } else {
                currentPosition.isValid = false;
                setCurrentPosition({...currentPosition});
              }
            });
        },
        error => console.log('Error', JSON.stringify(error)),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
      );
      setDisplayMap(true);
    }
  }, [isMounted]);

  useEffect(() => {
    const fetchReferent = async () => {
      console.log('fetch referents')
      const rawReferents = await referentAPI.fetchReferents();
      const refPoints = rawReferents.map(function(item) {
        item.isSelected = false;
        return item;
      });
      let filteredPoints = [];
      if (typeof currentPosition.delta !== 'undefined') {
        const bounds = {
          max_lat:
            currentPosition.coords.latitude + currentPosition.delta.latitude,
          min_lat:
            currentPosition.coords.latitude - currentPosition.delta.latitude,
          max_lon:
            currentPosition.coords.longitude + currentPosition.delta.longitude,
          min_lon:
            currentPosition.coords.longitude - currentPosition.delta.longitude,
        };

        filteredPoints = refPoints.filter(refPoint => {
          if (
            parseFloat(refPoint.latitude) < bounds.max_lat ||
            parseFloat(refPoint.latitude) > bounds.min_lat ||
            parseFloat(refPoint.longitude) < bounds.max_lon ||
            parseFloat(refPoint.longitude) > bounds.min_lon
          ) {
            return refPoint;
          }
        });
      } else {
        filteredPoints = referentPoints;
      }
      setReferentPoints([]);
      setReferentPoints([...filteredPoints]);
    };
    fetchReferent();
  }, []);

  const _onDone = () => {
    setDisplayMap(false);
    props.navigation.navigate('TunnelUserAddress', {
      selectedItem: selectedItem,
      selectedProducts: selectedProducts,
      selectedReferent: selectedReferent,
      deliveryType: deliveryType,
    });
  };

  const _goBack = () => {
    props.navigation.navigate('TunnelDeliverySelect', {
      selectedItem: selectedItem,
      selectedProducts: selectedProducts,
    });
  };

  function onPoiPress(selectedItem) {
    const newItems = referentPoints.map(function(item) {
      item.isSelected = item.id === selectedItem.id;
      return item;
    });
    handleAddressMore(selectedItem);
    setSelectedReferent({...selectedItem});
    setReferentPoints(newItems);
  }

  const adjustMapLayout = parentLayout => {
    const {width} = parentLayout;
    const {height} = Dimensions.get('window');
    const newMapLayout = mapLayout;

    newMapLayout.width = width;
    newMapLayout.height = height * 0.4;

    setMapLayout(newMapLayout);
  };

  let poiCards = <View></View>;

  if (referentPoints.length > 0) {
    poiCards = referentPoints.map(function(item, key) {
      return (
        <PointOfInterestCard
          isSelected={item.isSelected}
          onPress={onPoiPress}
          item={item}
          key={key}
        />
      );
    });
  }

  function onRegionChange(region) {
    if (pickupTimer) {
      clearTimeout(pickupTimer);
    }
    const refRegion = region;
    pickupTimer = setTimeout(refRegion => {
      const localRegion = {
        coords: {
          latitude: region.latitude,
          longitude: region.longitude,
        },
        delta: {
          latitude: region.latitudeDelta,
          longitude: region.longitudeDelta,
        },
      };

      setCurrentPosition(localRegion);
    }, 900);
  }

  const handleAddressMore = item => {
    openGeocoder()
      .reverse(item.coordinates.longitude, item.coordinates.latitude)
      .end((err, res) => {
        if (res) {
          if (res.address.postcode.substring(0, 2) === '97') {
            item['address_deptcode'] = res.address.postcode.substring(0, 3);
          } else {
            item['address_deptcode'] = res.address.postcode.substring(0, 2);
          }
          item['address_region'] = res.address.state;
          item['address_dept'] = res.address.county;
          setSelectedReferent({...item});
        }
      });
  };

  function _handleChange(name, value) {
    if (AddressValidator.validateZipCode(value)) {
      setInvalidZipCode(false);
      localAdress[`${name}`] = value;
      setLocalAdress(localAdress);

      if (zipCodeTest.test(value)) {
        openGeocoder()
          .geocode(value)
          .end((err, res) => {
            if (res.length >= 1) {
              const filtered = res.filter(
                place => place.address.country_code === 'fr',
              );
              if (filtered.length > 0) {
                const localPosition = {
                  coords: {
                    latitude: parseFloat(
                      parseFloat(filtered[0].lat).toFixed(7),
                    ),
                    longitude: parseFloat(
                      parseFloat(filtered[0].lon).toFixed(7),
                    ),
                  },
                  delta: {
                    latitude:
                      typeof currentPosition.delta !== 'undefined'
                        ? currentPosition.delta.latitude
                        : 0.09,
                    longitude:
                      typeof currentPosition.delta !== 'undefined'
                        ? currentPosition.delta.longitude
                        : 0.09,
                  },
                };
                setCurrentPosition({...localPosition});
              }
            }
          });
      }
    } else {
      setInvalidZipCode(true);
    }
    const _displayReset = value != '';
    setDisplayReset(_displayReset);

    return value;
  }

  return (
    <View
      style={[
        Styles.flexOne,
        {
          backgroundColor: Colors.backgroundColor,
          paddingLeft: 15,
          paddingRight: 15,
          paddingTop: 5,
        },
      ]}>
      <Backlink step={2} onPress={_goBack} />

      <View style={{flex: 0.15, paddingTop: 15}}>
        <TextWithSound
          style={Styles.tunnelTitle}
          sound={'lieu-de-retrait_XlV9Zth8.mp3'}
          useLocal={true}>
          Choisis le lieu de livraison
        </TextWithSound>
        <CustomTextInput
          inputLabel="Code postal"
          inputPlaceholder="Ton Code Postal"
          onChangeText={val => _handleChange('userZipCode', val)}
          name={'userZipCode'}
          filterNumbers={true}
          isValid={localValid.userZipCode}
          currentValue={localAdress.userZipCode}
          displayResetButton={displayReset}
          style={Styles.tunnelInput}
        />
      </View>

      <View
        style={{flex: 0.4, minHeight: 275, paddingTop: 0, marginTop: 15}}
        onLayout={event => {
          adjustMapLayout(event.nativeEvent.layout);
        }}>
        {invalidZipCode && (
          <View
            style={[
              TunnelUserAdressStyle.requiredFieldsWrapper,
              {marginTop: 5, marginBottom: 5},
            ]}>
            <View style={{flex: 1}}>
              <Text
                style={[
                  Styles.placeholderText,
                  {fontSize: 14, color: '#C80352', fontFamily: 'Chivo-Regular'},
                ]}>
                Aïe ! Cette zone n&apos;est pas encore disponible à la
                livraison.
              </Text>
            </View>
          </View>
        )}
        {displayMap && (
          <OpenStreetMap
            items={referentPoints}
            onPoiPress={onPoiPress}
            width={mapLayout.width}
            height={mapLayout.height}
            onRegionChange={onRegionChange}
            latitude={currentPosition.coords.latitude}
            longitude={currentPosition.coords.longitude}
          />
        )}
      </View>

      <ScrollView
        style={{
          flex: 0.45,
          width: '100%',
          bottom: 0,
          marginTop: -40,
          maxHeight: 280,
          paddingBottom: 80,
        }}>
        {poiCards}
      </ScrollView>

      {selectedReferent && (
        <TouchableOpacity
          style={[
            Styles.bottomButton,
            {position: 'absolute', bottom: 10, borderRadius: 25},
          ]}
          onPress={_onDone}>
          <View style={{paddingTop: 8, paddingBottom: 8}}>
            <Text style={Styles.tunnelButtonText}>Suivant</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default TunnelReferentSelect;
