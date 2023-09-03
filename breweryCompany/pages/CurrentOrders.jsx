import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthToken, selectUserId } from '../features/userSlice';
import { setOrigin } from '../features/navSlice';
import { selectOrigin, selectOriginalLocation } from '../features/navSlice';

const CurrentOrders = ({ navigation }) => {
    const authToken = useSelector(selectAuthToken);
    const userId = useSelector(selectUserId);
    const [currentOrder, setCurrentOrder] = useState([]);
    const origin = useSelector(selectOrigin);
    const dispatch = useDispatch();
    const [currentLocation, setCurrentLocation] = useState(origin);

    useEffect(() => {
        if (authToken.authToken) {
            fetch(`https://10fe-103-130-108-23.ngrok-free.app/get_current_cart/${userId.userId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${authToken.authToken}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            })
                .then(response => response.json())
                .then(data => {
                    // Use functional update to add new items to the existing array
                    setCurrentOrder(prevOrders => [...prevOrders, data]);
                })
                .catch(error => {
                    console.error('Error fetching currentOrder data:', error);
                });
        }
    }, [authToken.authToken]);

    console.log("Current order", currentOrder);
    console.log("Current origin", currentLocation);

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
            <FlatList
                data={currentOrder}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
            />
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate('Map')
                }
                style={{ color: "black" }}
            >
                <Text>Track Order</Text>
            </TouchableOpacity>
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
});
