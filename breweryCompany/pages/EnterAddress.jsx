import React, { useState, useEffect } from 'react';
import { Text, View, ActivityIndicator, Button, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';
import { useDispatch, useSelector } from 'react-redux';
import { setOrigin } from '../features/navSlice';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/Ionicons'
import EnterManualAddress from '../components/EnterManualAddress';
import { selectOrigin, selectOriginalLocation } from '../features/navSlice'

const EnterAddress = ({ navigation }) => {
    const dispatch = useDispatch();
    const location = useSelector(selectOriginalLocation)
    const [loading, setLoading] = useState(true);
    const [region, setRegion] = useState(null);
    const [isMapReady, setIsMapReady] = useState(false);
    const [marginTop, setMarginTop] = useState(1);
    const [userLocation, setUserLocation] = useState(location.description);
    const [regionChangeProgress, setRegionChangeProgress] = useState(false);
    const [isManualAddressVisible, setManualAddressVisible] = useState(false)

    useEffect(() => {
        const getUserLocation = async () => {
            try {
                Geolocation.getCurrentPosition(
                    position => {
                        const { latitude, longitude } = position.coords;
                        const newRegion = {
                            latitude: latitude,
                            longitude: longitude,
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005,
                        };
                        setRegion(newRegion);
                        setLoading(false);
fetchAddress();
                    },
                    error => {
                        console.error('Error getting location:', error);
                        setLoading(false);
                    },
                    { enableHighAccuracy: false, timeout: 200000, maximumAge: 5000 }
                );
            } catch (error) {
                console.error('Error getting location:', error);
                setLoading(false);
            }
        };

        getUserLocation();
    }, []);

    const onMapReady = () => {
        setIsMapReady(true);
        setMarginTop(0);
    };

    const fetchAddress = () => {
        if (region?.latitude && region?.longitude) {
            fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${region.latitude},${region.longitude}&key=AIzaSyAZOYcbktSK5cB_hNu91XWV15jAB9JlzIA`
            )
                .then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.results && responseJson.results[0]) {
                        const location = responseJson.results[0].formatted_address;
                        setUserLocation(location); // Set the userLocation state here
                        setRegionChangeProgress(false);
                    } else {
                        console.log("No results found in responseJson:", responseJson);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching address:", error);
                });
        }
    };

    
    const onRegionChange = (newRegion) => {
        setRegion(newRegion);
        setRegionChangeProgress(true);
            fetchAddress();
            };

    const onLocationSelect = () => {
        dispatch(
            setOrigin({
                location: { "lat": region.latitude, "lng": region.longitude },
                description: userLocation,
            }))
        navigation.navigate('ViewCart')
    };

    if (loading) {
        return (
            <View style={styles.spinnerView}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <View style={{ flex: 2 }}>
                    {/* <View style={{
                        width: "100%", position: "absolute",
                        zIndex: 1, flexDirection: "row",
                    }}> */}
                        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                            <Icon name="arrow-back" color="black" size={30} />
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={.7} style={[styles.searchbar, styles.shadowProp]} onPress={() => setManualAddressVisible(true)}>
                            <Icon name="search" size={30} color='#ED5A6B' />
                            <Text style={{ color: "#6f6f6f", fontFamily: "Metropolis-Medium", marginHorizontal: 12, fontSize: 16 }}>Search address...</Text>
                        </TouchableOpacity>
                    {/* </View> */}
                    {!!region?.latitude && !!region?.longitude && (
                        <MapView
                            style={{ ...styles.map, marginTop: marginTop }}
                            initialRegion={region}
                            showsUserLocation={true}
                            onMapReady={onMapReady}
                            onRegionChangeComplete={onRegionChange}
                        >
                        </MapView>
                    )}

                    <View style={styles.mapMarkerContainer}>
                        <Icon name="location-sharp" color="#E41B23" size={35} />
                    </View>
                </View>
                <View style={styles.deatilSection}>
                    <Text
                        style={{
                            fontSize: 15,
                            fontFamily: 'Metropolis-Bold',
                            marginBottom: 20,
                            color: "#4f4f4f",
                            textTransform: "uppercase"
                        }}
                    >
                        Select delivery location
                    </Text>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Icon name="location" color="#ED5A6B" size={25} />
                            <Text style={{ fontSize: 10, color: '#999' }}>LOCATION</Text>
                        </View>
                    </View>
                    <Text
                        numberOfLines={3}
                        style={{
                            fontSize: 14,
                            paddingVertical: 10,
                            borderBottomColor: 'silver',
                            borderBottomWidth: 0.5,
                            color: "#4f4f4f",
                            fontFamily: "Metropolis-Medium",
                            lineHeight: 16,
                            textAlign: "left",
                            marginVertical: 5
                        }}
                    >
                        {!regionChangeProgress ? userLocation : 'Identifying Location...'}
                    </Text>
                    <View style={styles.btnContainer}>
                        <TouchableOpacity
                            style={[styles.button, regionChangeProgress && styles.disabledButton]}
                            onPress={onLocationSelect}
                            disabled={regionChangeProgress}
                        >
                            <Text style={styles.buttonText}>CONFIRM LOCATION</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <EnterManualAddress
                    navigation={navigation}
                    isVisible={isManualAddressVisible}
                    onClose={() => {
                        setManualAddressVisible(false)
                        navigation.navigate('ViewCart')
                    }} />
            </View>
        );
    }
};
const styles = StyleSheet.create({
    container: {
        display: "flex",
        height: Dimensions.get("screen").height,
        width: Dimensions.get("screen").width
    },
    map: {
        flex: 1
    },
    mapMarkerContainer: {
        left: '47%',
        position: 'absolute',
        top: '42%'
    },
    mapMarker: {
        fontSize: 40,
        color: "red"
    },
    deatilSection: {
        flex: 1,
        backgroundColor: "#fff",
        // padding: 10,
        display: "flex",
        justifyContent: "flex-start",
        paddingHorizontal: 15,
        paddingVertical: 10
    },
    spinnerView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    btnContainer: {
        width: Dimensions.get("window").width - 20,
        position: "absolute",
        bottom: 80,
        left: 10,
    },
    button: {
        backgroundColor: "#ED5A6B",
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: "center",
    },
    disabledButton: {
        backgroundColor: "#ccc", // Change to a suitable disabled color
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontFamily: "Metropolis-Medium",
        textTransform: "uppercase",
    },
    backButton: {
        padding: 15,
        position:"absolute",
        zIndex:1
    },
    searchbar: {
        backgroundColor: 'white',
        margin: 10,
        borderRadius: 20,
        padding: 7,
        flexDirection: "row",
        alignItems: "center",
        width:"70%",
        position:"absolute",
        zIndex:1,
        left:50
    },
    shadowProp: {
        elevation: 5,
        shadowColor: '#171717',
    },
});

export default EnterAddress;
