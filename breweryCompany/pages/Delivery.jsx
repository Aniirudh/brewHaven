import React,{useRef,useEffect} from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import * as Progress from 'react-native-progress'
import MapView, { Marker } from 'react-native-maps'
import Icon from 'react-native-vector-icons/AntDesign'
import { useSelector } from 'react-redux'
import { selectDestination, selectOrigin } from '../features/navSlice'
import MapViewDirections from 'react-native-maps-directions'

const Delivery = ({ navigation }) => {
  const API_KEY = "AIzaSyAZOYcbktSK5cB_hNu91XWV15jAB9JlzIA"
  const origin = useSelector(selectOrigin)
  const destination = useSelector(selectDestination)
  const mapRef = useRef(null);

  useEffect(() => {
    if (!origin || !destination) return;

    mapRef.current.fitToSuppliedMarkers(["origin", "destination"], {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }
    })
  }, [origin,destination])

  return (
    <View style={{ backgroundColor: '#ED5A6B', flex: 1 }}>
      <View >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 5, marginVertical: 5 }}>
        <TouchableOpacity style={styles.closeIcon} onPress={() => navigation.navigate('Home')}>
          <Icon name="close" size={25} color="white" />
        </TouchableOpacity>
        <Text style={styles.closeIcon}>Order Help</Text>
      </View>
        <View style={styles.deliveryContainer}>
          <Text style={styles.estimatedText}>Your order will be delivered in</Text>
          <Text style={styles.deliveryText}>45-55 Minutes</Text>
          <Progress.Bar size={30} color="#ED5A6B" indeterminate={true} />
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <MapView
        ref={mapRef}
          initialRegion={{
            latitude: origin.location.lat,
            longitude: origin.location.lng,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          style={{ flex: 1 }}
          mapType="standard">
            {origin && destination && (
              <MapViewDirections
                origin={origin.location}
                destination={destination.location}
                apikey={API_KEY}
                strokeWidth={3}
                strokeColor="black"
              />
            )}

              {origin?.location && (
                <Marker
                coordinate={{
                  latitude: origin.location.lat,
                  longitude: origin.location.lng,
                }}
                title="origin"
                description="description"
                identifier="origin"
                pinColor="#ED5A6B"
              />
              )}
              {destination?.location && (
                <Marker
                coordinate={{
                  latitude: destination.location.lat,
                  longitude: destination.location.lng,
                }}
                title="Vendor"
                description="description"
                identifier="destination"
                pinColor="#ED5A6B"
              />
              )}
          
        </MapView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  deliveryContainer: {
    backgroundColor: 'white',
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ED5A6B',
    marginHorizontal: 15,
  },
  estimatedText: {
    fontFamily: 'Metropolis-Medium',
    color: '#7f7f7f',
    fontSize: 15,
  },
  deliveryText: {
    fontFamily: 'Metropolis-Bold',
    color: 'black',
    fontSize: 30,
    marginVertical: 10
  },
  closeIcon: {
    margin: 10,
    color: 'white'
  }
})

export default Delivery