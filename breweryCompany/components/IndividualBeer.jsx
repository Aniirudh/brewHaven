import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign'
import RIcon from 'react-native-vector-icons/MaterialIcons'
import { useDispatch, useSelector } from 'react-redux';
import { selectTrackOrderVisibility } from '../features/userSlice'
import { addToBasket, removeFromBasket, selectBasketItems, selectBasketItemsWithId } from '../features/cartSlice';

const IndividualBeer = ({ navigation,actualBeerId,  id, imageUrl, name, size_ml,tagline, rating, price }) => {

    const [itemButton, setItemButton] = useState(false)
    const items = useSelector((state) => selectBasketItemsWithId(state, id))
    const dispatch = useDispatch()
    const showTrackOrder = useSelector(selectTrackOrderVisibility)

    const addItemToBasket = () => {
        dispatch(addToBasket({ actualBeerId, id, name, imageUrl, tagline, rating,price, size_ml }))
        setItemButton(true)
    }


    const removeItemFromBasket = () => {
        if (items.length === 1) {
            setItemButton(false)
        }
else if (!items.length > 0) { return; }

        dispatch(removeFromBasket({ id }))
    }


    return (
        <View>
            <View style={styles.customCard}>
                <View style={styles.cardItems}>
                    <Image source={{ uri: imageUrl }} style={styles.addImg} />
                    <Text style={{ color: "black",fontFamily:"Metropolis-Medium" }}>{size_ml} ml</Text>
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                    <RIcon name="currency-rupee" color="#2f2f2f" size={15} />
                    <Text style={{ color: "black", fontFamily:"Metropolis-Medium" }}>{price}</Text>
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
                    
                </View>
            </View>
        </View>
    )
}

export default IndividualBeer

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#ED5A6B',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 5,
        marginRight: 10,
    },
    buttonText: {
        fontFamily: 'Metropolis-SemiBold',
        color: 'white',
        textTransform: 'uppercase'
    },
    customCard: {
        height: 100,
        // elevation: 5,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#9f9f9f',
        padding: 25,
        shadowColor: '#9f9f9f',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5
    },
    cardItems: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    closeButton: {
        margin: 10
    },
    addImg: {
        width: 50,
        height: 80,
        resizeMode: 'contain'
    },
    tagline: {
        color: '#4f4f4f',
        fontFamily: "Metropolis-Light",
        // marginTop: 5
    },
    price: {
        color: '#2f2f2f',
        fontFamily: 'Metropolis-SemiBold'
    },
    pricing: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    customtitle: {
        color: 'black',
        fontFamily: "Metropolis-Bold",
        fontSize: 15,
        margin: 5
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
    modal: {
        justifyContent: "flex-end",
        margin: 0,
    },
    modalContent: {
        backgroundColor: "white",
        paddingTop: 12,
        paddingHorizontal: 12,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        minHeight: 350,
        paddingBottom: 20,
    },

    barIcon: {
        width: 60,
        height: 5,
        backgroundColor: "#7f7f7f",
        borderRadius: 3,
    },
    center: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
})