import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { useDispatch, useSelector } from 'react-redux';
import { setOrigin, setOriginalLocation } from '../features/navSlice';
import { selectAuthToken, setAuthToken, setUserId } from '../features/userSlice';
import * as Animatable from 'react-native-animatable'

const HomeLoading = ({ navigation}) => {
  // const { authenticationToken, userIdentification } = route.params;
  // console.log("token in home loading",authenticationToken)
  // console.log("id in home loading",userIdentification)
  const dispatch = useDispatch()
  // const authToken = route.params.authToken;
  const gifSource = require("../assets/locationMarker.gif")
  const [displayCurrentAddress, setDisplayCurrentAddress] = useState(
    'Fetching your location...'
  );

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  const fetchCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetchAddressFromCoordinates(latitude, longitude);
          setDisplayCurrentAddress(response);
          setTimeout(() => {
            dispatch(setOriginalLocation({
              location: { "lat": latitude, "lng": longitude },
              description: response
            }))
            // dispatch(setAuthToken({
            //   authToken:authenticationToken
            // }))
            // dispatch(setUserId({
            //   userId: userIdentification
            // }))
            navigation.replace('Home');
          }, 2000);
        } catch (error) {
          console.error('Error fetching address:', error);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  };

  const fetchAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAZOYcbktSK5cB_hNu91XWV15jAB9JlzIA`
      );
      const data = await response.json();
      if (data.status === 'OK') {
        const firstResult = data.results[0];
        if (firstResult) {
          const formattedAddress = firstResult.formatted_address;
          return formattedAddress;
        }
      }
      throw new Error('Address not found');
    } catch (error) {
      console.error('Error fetching address:', error);
      throw error;
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>

      {/* Use Animatable.View to apply animations */}
      <View style={{ justifyContent: 'space-between' }}>
        <View>
          <Animatable.Image
            source={gifSource}
            animation="fadeIn" // Apply the appropriate animation
            iterationCount={1}
            style={{ width: '100%', height: 300, resizeMode: 'contain' }} // Adjust dimensions as needed
          /></View>

        <Animatable.Text
          animation="fadeIn"
          iterationCount={1}
          style={styles.waitText}>{displayCurrentAddress}</Animatable.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({

  waitText: {
    fontFamily: 'Metropolis-Bold',
    color: 'black',
    fontSize: 15,
    textAlign: "center",
    lineHeight: 19
  }
});
export default HomeLoading