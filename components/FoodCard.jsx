import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, onPress } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/AntDesign'
import RIcon from 'react-native-vector-icons/MaterialIcons'
import { addToBasket, removeFromBasket, selectBasketItems, selectBasketItemsWithId } from '../features/cartSlice';

const FoodCard = ({navigation, item, foodId, id, name, imageUrl, rating, price, size_ml }) => {
    const items = useSelector((state) => selectBasketItemsWithId(state, item.id))
    const dispatch = useDispatch()
    const removeItemFromBasket = () => {
        if (items.length === 1) {
            // setItemButton(false)
        }
        else if (!items.length > 0) { return; }

        dispatch(removeFromBasket({ id }))
    }
    const addItemToBasket = () => {
        dispatch(addToBasket({ foodId, id, name, imageUrl, rating, price, size_ml }))
        // setItemButton(true)
    }

    return (
        <TouchableOpacity style={styles.card} onPress={()=>navigation.navigate('FoodDetails', {id:id})}>
            <Image style={styles.image} source={{ uri: item.image_url }} />
            <Text style={styles.name}>{item.food_name}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "90%" }}>
                <Text style={styles.calories}>{item.calories}</Text>
                <Text style={styles.price}> ₹{item.food_price}</Text>
            </View>
            <View style={styles.counterButton}>
                <TouchableOpacity disabled={!items.length} onPress={removeItemFromBasket}>
                    <Icon name="minuscircle" size={25} color='#FC3839' />
                </TouchableOpacity>
                <Text style={styles.couterButtonText}>{items.length}</Text>
                <TouchableOpacity onPress={addItemToBasket}>
                    <Icon name="pluscircle" size={25} color='#FC3839' />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 180, // Adjust the card width as per your design
        backgroundColor: 'white',
        marginHorizontal: 5,
        borderRadius: 10,
        elevation: 5,
        padding: 10,
        alignItems: 'center',
        marginVertical: 2
    },
    image: {
        width: 150, // Adjust the image width as per your design
        height: 130, // Adjust the image height as per your design
        resizeMode: 'cover',
    },
    name: {
        fontFamily: 'Metropolis-Bold',
        fontSize: 16,
        marginTop: 10,
        color: "black"
    },
    calories: {
        fontFamily: 'Metropolis-Light',
        fontSize: 14,
        marginTop: 5,
        color: "black"
    },
    price: {
        fontFamily: 'Metropolis-SemiBold',
        fontSize: 15,
        marginTop: 10,
        color: "black"
    },
    counterButton: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    couterButtonText: {
        color: '#4f4f4f',
        fontFamily: 'Metropolis-SemiBold',
        margin: 10
    },
});

export default FoodCard;
