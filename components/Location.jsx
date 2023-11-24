import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';

Geocoder.init("AIzaSyDDBmX-T7__7UnVz29ErvSajkYknlW_t5");
const LocationDisplay = () => {
    const [location, setLocation] = useState(null);
    const [address, setAddress] = useState('');
  
    useEffect(() => {
      // Check and request location permission if needed
      if (Platform.OS === 'ios') {
        Geolocation.requestAuthorization();
      }
  
      // Get current location
      Geolocation.getCurrentPosition(
        (position) => {
          setLocation(position.coords);
          reverseGeocode(position.coords);
        },
        (error) => {
          console.log('Error getting location:', error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }, []);
  
    const reverseGeocode = async (coords) => {
      try {
        const response = await Geocoder.from(coords.latitude, coords.longitude);
        const addressComponent = response.results[0].formatted_address;
        setAddress(addressComponent);
      } catch (error) {
        console.log('Error reverse geocoding:', error);
      }
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Current Address:</Text>
        <Text style={styles.address}>{address}</Text>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    address: {
      fontSize: 16,
      textAlign: 'center',
      paddingHorizontal: 20,
    },
  });
  
  export default LocationDisplay;