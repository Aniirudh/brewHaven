import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { selectBasketItems, selectBasketTotal} from '../features/cartSlice'
import { selectTrackOrderVisibility } from '../features/userSlice'
import deliveryBike from '../assets/delivery-bike.png'

export const Cart = ({ navigation }) => {
    const dispatch= useDispatch()
    const items = useSelector(selectBasketItems)
    const cartTotal = useSelector(selectBasketTotal)
    const showTrackOrder = useSelector(selectTrackOrderVisibility)

    if (items.length === 0 && !showTrackOrder) return (
        null
    );
    if(items.length === 0 && showTrackOrder){
        return(
        <View style={styles.cartContainer}>
            <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate('Map')}>
                <Text style={styles.viewCart}>Track Order</Text>
                {/* <Text>{cartTotal}</Text> */}
                {/* <Image source={deliveryBike} style={{ width: "20%", height: "40%", resizeMode: 'contain' }} /> */}
            </TouchableOpacity>
        </View>
    )}

    return (
        <View style={styles.cartContainer}>
            <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate('ViewCart')}>
                <Text style={styles.cartText}>{items.length} item{"(s)"} added</Text>
                <Text style={styles.viewCart}>View Cart</Text>
                {/* <Text>{cartTotal}</Text> */}
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    cartContainer: {
        position: 'relative',
        // bottom:10,
        width: '100%',
        zIndex: 50,

    },
    cartText: {
        color: '#ffff',
        fontFamily: 'Metropolis-SemiBold',
        textTransform: 'uppercase'
    },
    cartButton: {
        backgroundColor: '#FC3839',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#FC3839',
        margin: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 55,

    },
    viewCart: {
        fontFamily: 'Metropolis-Bold',
        textTransform: 'uppercase',
        color: '#ffff'
    },
    trackOrderButton:{
        // backgroundColor:"white",
        // borderWidth: 1,
        // borderRadius: 110,
        // // flexDirection:"row",
        // justifyContent:"center",
        // alignItems:"center",
        height:50,
        width:50,
        position:"absolute",
        zIndex:1
    }
})
