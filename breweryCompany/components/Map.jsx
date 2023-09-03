import React, { useRef, useEffect } from 'react'
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
import { setTrackOrderVisibility } from '../features/userSlice'
import { clearCart, selectBasketItems } from '../features/cartSlice'

const Map = ({ navigation}) => {
  const API_KEY = "AIzaSyAZOYcbktSK5cB_hNu91XWV15jAB9JlzIA"
  const origin = useSelector(selectOrigin)
  const destination = useSelector(selectDestination)
  const items = useSelector(selectBasketItems)
  const mapRef = useRef(null);
  const dispatch = useDispatch()
  const travelTimeInformation = useSelector(selectTravelTimeInformation)

  console.log("origin inmap", origin)

  useEffect(() => {
    if (!origin || !destination) return;
    console.log(items.length)
    mapRef.current.fitToSuppliedMarkers(["origin", "destination"], {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }
    })
    dispatch(setTrackOrderVisibility({
      trackOrderVisibility: true
    }))
    
  }, [origin, destination])

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

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5 ,backgroundColor:"white",borderWidth:1,borderRadius:10,marginVertical:2,marginHorizontal:5,borderColor:"white"}}>
                <TouchableOpacity style={styles.closeIcon} onPress={() => navigation.navigate('Home')}>
                    <Icon name="close" size={25} color="black" />
                </TouchableOpacity>
                <Text style={styles.closeIcon}>Order Help</Text>
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
            {/* Other UI components */}
            {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 5, marginVertical: 5 }}>
                <TouchableOpacity style={styles.closeIcon} onPress={() => navigation.navigate('Home')}>
                    <Icon name="close" size={25} color="white" />
                </TouchableOpacity>
                <Text style={styles.closeIcon}>Order Help</Text>
            </View> */}
            {/* Delivery container */}
            <View style={styles.deliveryContainer}>
                <View style={{ flexDirection: 'column' }}> 
                    <Text style={styles.estimatedText}>Your order will be delivered in</Text>
                    <Text style={styles.deliveryText}>{travelTimeInformation?.duration.text}</Text>
                    <Progress.Bar size={30} color="#ED5A6B" indeterminate={true} />
                </View>
                <Image source={deliveryBike} style={{ width: "30%", height: "50%", resizeMode: 'contain' }} />
                <View>
                    {/* <Animatable.Image
                        source={gifSource}
                        animation="slideInUp" // Apply the appropriate animation
                        iterationCount={1}
                        style={{ width: '10%', height: '25%', resizeMode: 'contain' }} // Adjust dimensions as needed
                    /> */}
                </View>
            </View>
            {/* Rider container */}
            <View style={styles.riderContainer}>
                <Image source={deliveryMan} style={{ width: "30%", height: "100%", resizeMode: "contain" }} />
                <View style={{ flexDirection: "column" }}>
                    <Text style={styles.riderText}>Ramesh</Text>
                    <Text style={styles.estimatedText}>Your Rider</Text>
                </View>
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