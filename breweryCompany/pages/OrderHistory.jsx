import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthToken, selectUserId } from '../features/userSlice';
import RIcon from 'react-native-vector-icons/MaterialIcons'
import { setOrigin } from '../features/navSlice';

const OrderHistory = ({navigation}) => {

    const authToken = useSelector(selectAuthToken);
    const userId = useSelector(selectUserId)
    const [order, setOrder] = useState([])
    const dispatch= useDispatch()

    useEffect(() => {
        if (authToken.authToken) {
            fetch(`https://10fe-103-130-108-23.ngrok-free.app/get_cart/${userId.userId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${authToken.authToken}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            })
                .then(response => response.json())
                .then(data => {
                    setOrder(data)
                })
                .catch(error => {
                    console.error('Error fetching beer data:', error);
                });
        }
    }, [authToken.authToken]);

    console.log(order[0]?.lat)
    console.log(order[0]?.lng)
    console.log(order[0]?.address)

    const renderItem = ({ item }) => {
        if (!item || !item.cartItems) {
            return null; // Return null if item or cartItems is undefined
        }
        return (
            <View style={styles.orderContainer}>
                <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                    <Text style={styles.orderHeaderText}>Order #{item.id}  </Text>
                    <View style={{flexDirection:"row", alignItems:"center"}}>
                    <RIcon name="currency-rupee" color="#2f2f2f" size={15} />
                    <Text style={{ color: "black", fontFamily: "Metropolis-SemiBold" }}>{item.totalAmount}</Text>
                    </View></View>
                {item.cartItems.map((cartItem, index) => (
                    <View key={index} style={styles.cartItemContainer}>

                        {cartItem.beer &&
                            <View style={{ flexDirection: "row", alignItems:"center" }}>
                                <Text style={{ color: 'black', fontFamily: "Metropolis-SemiBold" }}>{cartItem.beer.name} </Text>
                                <Text style={{ color: "#9f9f9f", fontFamily: "Metropolis-Medium" }}>x{cartItem.beerQuantity}</Text>
                            </View>}
                    </View>
                ))}
                {/* onPress={(data, details = null) => {
                        dispatch(
                            setOrigin({
                                
                            location: details.geometry.location,
                            description: data.description,
                            
                        }))
                    }} */}
                    {/* dispatch(
            setOrigin({
                location: { "lat": region.latitude, "lng": region.longitude },
                description: userLocation,
            }))
        navigation.navigate('ViewCart') */}
                {/* <Text style={{ color: 'black' }}>Total Amount: {item.totalAmount}</Text> */}
                <Text style={{ color: 'black' ,fontFamily:"Metropolis-Thin"}}>Delivery Address: {item.address}</Text>
                <TouchableOpacity onPress={()=>{
                                                // dispatch(
                                                //     setOrigin({
                                                        
                                                //     location: {"lat": item?.lat, "lng": item?.lng},
                                                //     description: item?.address,
                                                    
                                                // }))
                                                navigation.navigate('PlacingOrder',{origin:{ location: {lat: item?.lat, lng: item?.lng},
                                                description: item?.address,}})
                    }}>
                <Text style={{ color: 'black' ,fontFamily:"Metropolis-Thin"}}>TRACK ORDER</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.orderHistory}>
                <Text style={{ color: "black", textTransform: "uppercase", fontFamily: "Metropolis-Bold" }}>Order History</Text>
            </View>
            <FlatList
                data={order}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
            />
        </View>
    )
}

export default OrderHistory

const styles = StyleSheet.create({
    orderHistory: {
        backgroundColor: "white",
        paddingVertical: 15,
        justifyContent: "center",
        alignItems: "center"
    },
    orderContainer: {
        height: 160,
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 10,
        backgroundColor: 'white',
        elevation: 5,
        paddingHorizontal: 10,
        justifyContent: 'center',
    },
    orderHeaderText: {
        fontSize: 10,
        marginBottom: 5,
        color: "black",
        textTransform: "uppercase",
        fontFamily: "Metropolis-Medium"
    },
    cartItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
})