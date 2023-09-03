import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { selectAuthToken } from '../features/userSlice';
import FoodCard from './FoodCard'; // Import the FoodCard component

const Food = ({ navigation }) => {
    const authToken = useSelector(selectAuthToken);
    const [food, setFood] = useState([]);

    useEffect(() => {
        if (authToken.authToken) {
            fetch(`https://10fe-103-130-108-23.ngrok-free.app/foods`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${authToken.authToken}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    setFood(data);
                })
                .catch((error) => {
                    console.error('Error sending authentication request:', error);
                });
        }
    }, [authToken.authToken]);
    console.log(food)
    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={styles.line} />
                                <View>
                                    <Text style={styles.heading}>Chef's best</Text>
                                </View>
                                <View style={styles.line} />
                            </View>
            <FlatList
                horizontal
                data={food}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <FoodCard item={item} id={item.id} name={item.food_name} imageUrl={item.image_url} rating={item.averageRating} price={item.food_price} size_ml={null}/>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
    },
    heading: {
        fontFamily: 'Metropolis-Medium',
        fontSize: 20,
        marginBottom: 10,
        color: "black"
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#9f9f9f',
    },
    heading: {
        textTransform: 'uppercase',
        width: 250,
        textAlign: 'center',
        fontFamily: 'Metropolis-Medium',
        color: '#8f8f8f',
        letterSpacing: 1,
        marginBottom: 10,
    },
});

export default Food;
