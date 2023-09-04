import React, { useRef, useEffect,useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import * as Progress from 'react-native-progress'
import MapView, { Marker } from 'react-native-maps'
import Icon from 'react-native-vector-icons/AntDesign'
import { useSelector, useDispatch } from 'react-redux'
import { selectDestination, selectOrigin, selectTravelTimeInformation, setTravelTimeInformation } from '../features/navSlice'
import MapViewDirections from 'react-native-maps-directions'
import * as Animatable from 'react-native-animatable'
import deliveryBike from '../assets/delivery-bike.png'
import deliveryMan from '../assets/delivery-man.png'
import { setTrackOrderVisibility  ,selectAuthToken, selectUserId, } from '../features/userSlice'
import { clearCart, selectBasketItems } from '../features/cartSlice'
import OrderSummary from './OrderSummary'

const Map = ({ navigation}) => {
  const API_KEY = "AIzaSyAZOYcbktSK5cB_hNu91XWV15jAB9JlzIA"
  const origin = useSelector(selectOrigin)
  const destination = useSelector(selectDestination)
  const items = useSelector(selectBasketItems)
  const mapRef = useRef(null);
  const dispatch = useDispatch()
  const authToken = useSelector(selectAuthToken);
    const userId = useSelector(selectUserId);
  const travelTimeInformation = useSelector(selectTravelTimeInformation)
  const [order,setOrder]=useState()

    useEffect(()=>{
        if(!origin || !destination) return
        const getTravelTime = async() => {
      fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin.description}&destinations=${destination.description}&key=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
          dispatch(setTravelTimeInformation(data.rows[0].elements[0]))
        })
    
            }
    getTravelTime();
  },[origin, destination, API_KEY])

  const handleMapLayout = () => {
    if (mapRef.current && origin?.location && destination?.location) {
      mapRef.current.fitToSuppliedMarkers(['origin', 'destination'], {
        edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
      });
    }
  };
  useEffect(() => {
    if (authToken.authToken) {
        fetch(`http://54.89.234.175:8080/get_current_cart/${userId.userId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${authToken.authToken}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json()) // Parse the response JSON
            .then(data => {
                // Use functional update to append new data to the existing array
                setOrder(data);
            })
            .catch(error => {
                console.error('Error fetching currentOrder data:', error);
            });
    }
}, [authToken.authToken]);
console.log(order)
    return (
        <View style={{ flex: 1 }}>
<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5 ,backgroundColor:"white",borderWidth:1,borderRadius:10,marginVertical:2,marginHorizontal:5,borderColor:"white"}}>
                <TouchableOpacity style={styles.closeIcon} onPress={() => navigation.navigate('Home')}>
                    <Icon name="close" size={25} color="black" />
                </TouchableOpacity>
                {/* <Text style={styles.closeIcon}>Order Help</Text> */}
            </View>
        <View style={styles.container}>
            {/* Map component */}
            <MapView
                ref={mapRef}
                onLayout={handleMapLayout}
                initialRegion={{
                    latitude: origin.location.lat,
                    longitude: origin.location.lng,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                }}
                style={styles.map}
                mapType="standard">
                {origin && destination && (
                    <MapViewDirections
                        origin={origin.description}
                        destination={destination.description}
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
                    >
                        <Image source={require('../assets/beerMarker.png')} style={{height: 35, width:35 }} />
                    </Marker>
                )}

            </MapView>
        </View>
        <View style={{ height: "50%", width: "100%", flex: 1 }}>
            <View style={styles.deliveryContainer}>
                <View style={{ flexDirection: 'column' }}> 
                    <Text style={styles.estimatedText}>Your order will be delivered in</Text>
                    <Text style={styles.deliveryText}>{travelTimeInformation?.duration.text}</Text>
                    <Progress.Bar size={30} color="#ED5A6B" indeterminate={true} />
                </View>
                <Image source={deliveryBike} style={{ width: "30%", height: "50%", resizeMode: 'contain' }} />
                <View>
                </View>
            </View>
            <View style={styles.riderContainer}>
                <Image source={deliveryMan} style={{ width: "30%", height: "100%", resizeMode: "contain" }} />
                <View style={{ flexDirection: "column" }}>
                    <Text style={styles.riderText}>Ramesh</Text>
                    <Text style={styles.estimatedText}>Your Rider</Text>
                </View>
            </View>
            <View style={styles.riderContainer}>
                <OrderSummary cartItems={order?.cartItems} currentOrder={order}/>
            </View>
        </View>
  </View>
    )
}

export default Map

const styles = StyleSheet.create({
    textColor: {
        color: 'black'
    },
    container: {
        ...StyleSheet.absoluteFillObject,
        height: "50%",
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        marginTop:61
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    deliveryContainer: {
        backgroundColor: 'white',
        marginTop: 420,
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'white',
        marginHorizontal: 15,
        flexDirection: 'row',
        alignItems:'center'
    },
    riderContainer:{
        marginTop:10,
        backgroundColor: 'white',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'white',
        marginHorizontal: 15,
        flexDirection: 'row',
        alignItems:"flex-start",
        textAlign:"left",
        justifyContent:"flex-start"
    },
    riderText:{
        fontFamily: 'Metropolis-Bold',
        color: 'black',
        fontSize: 15,
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
        color: 'gray'
    }
})