import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthToken, selectUserId } from '../features/userSlice';
import { setOrigin } from '../features/navSlice';
import { selectOrigin, selectOriginalLocation } from '../features/navSlice';
import OrderSummary from '../components/OrderSummary';
import RIcon from 'react-native-vector-icons/Ionicons';

const initialCurrentOrder = [];
const CurrentOrders = ({ navigation }) => {
    const authToken = useSelector(selectAuthToken);
    const userId = useSelector(selectUserId);
    const [order, setOrder] = useState([]);
    const [currentOrder, setCurrentOrder] = useState(initialCurrentOrder)
    const origin = useSelector(selectOrigin);
    const dispatch = useDispatch();
    const [currentLocation, setCurrentLocation] = useState(origin);

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
                    setOrder(prevOrders => [...prevOrders, data]);
                })
                .catch(error => {
                    console.error('Error fetching currentOrder data:', error);
                });
        }
    }, [authToken.authToken]);
    useEffect(() => {
        if (order.length > 0) {
            setCurrentOrder(prevOrders => [...prevOrders, order[0]]);
        }
    }, [order])

    console.log("Current origin", currentLocation);
    console.log("one order", order)
    console.log("All order", currentOrder)
    // Define a renderItem function for the FlatList
    const renderItem = ({ item }) => (
        <View style={styles.cartItemContainer}>
            <Text style={{ color: "black" }}>{item.name}</Text>
            <Text style={{ color: "black" }}>Quantity: {item.beerQuantity}</Text>
            <Text style={{ color: "black" }}>Volume: {item.beerVolumeInMl}ml</Text>
            <Text style={{ color: "black" }}>Amount: {item.amountOfEachBeer}</Text>
        </View>
    );

    return (
        <View>
            <Text>CurrentOrders</Text>
            <View style={styles.riderContainer}>
                <OrderSummary cartItems={order[0]?.cartItems} currentOrder={order[0]} />
                <TouchableOpacity onPress={() => navigation.navigate('Map')} style={{ justifyContent: "flex-end", alignItems: "flex-end" }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={{ color: "black", fontFamily: "Metropolis-SemiBold" }}>Track Order</Text>
                        <RIcon name="chevron-forward" color="#4f4f4f" size={20} /></View>
                </TouchableOpacity>
            </View>

        </View>
    );
}

export default CurrentOrders;

const styles = StyleSheet.create({
    cartItemContainer: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        margin: 5,
    },
    riderContainer: {
        marginTop: 10,
        backgroundColor: 'white',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'white',
        marginHorizontal: 15,
    },
});
