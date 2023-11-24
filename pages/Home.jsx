import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import Cards from '../components/Cards';
import Categories from '../components/Categories';
import { Cart } from '../components/Cart';
import { useSelector } from 'react-redux';
import { selectAuthToken } from '../features/userSlice';
import Banner from '../components/Banner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Food from '../components/Food';

const Home = ({ navigation }) => {
    const authToken = useSelector(selectAuthToken)
    const [beer, setBeer] = useState([]);
    console.log(authToken.authToken)
    console.log("Token in home", authToken.authToken)
    useEffect(() => {
        if (authToken.authToken) {
            fetch(`http://54.89.234.175:8080/beers/Highrated`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authToken.authToken}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            })
                .then(response => {
                    console.log('Response:', response);
                    return response.json();
                })
                .then(data => {
                    setBeer(data);
                })
                .catch(error => {
                    console.error("Error sending authentication request:", error);
                });
        }
    }, [authToken.authToken]);


    const pricing = 450;
    const renderItem = ({ item }) => (
        <Cards
            navigation={navigation}
            item={item}
            id={item.id}
            imageUrl={item.image_url}
            name={item.name}
            tagline={item.tagline}
            rating={item.averageRating}
            price={pricing}
            pricing={item.pricings}
        />
    );

    return (
        <View style={{ flex: 1 }}>
            <Header navigation={navigation} beer={beer} />

            <FlatList
                data={beer}
                ListHeaderComponent={() => (
                    <View style={{ marginLeft: 10 }}>
                        <Banner />
                        <Categories navigation={navigation} />
                        <Food navigation={navigation} />
                        <View style={styles.headingContainer}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={styles.line} />
                                <View>
                                    <Text style={styles.heading}>In the spotlight</Text>
                                </View>
                                <View style={styles.line} />
                            </View>
                        </View>
                    </View>
                )}

                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.contentContainer}
            />

            <Cart navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        flexGrow: 1,
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
    },
    headingContainer: {
        marginTop: 15,
        marginBottom: 5,
    },
});

export default Home;
