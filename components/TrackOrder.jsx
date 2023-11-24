import React,{useState} from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import { selectBasketItems, selectBasketTotal } from '../features/cartSlice'
import { selectTrackOrderVisibility } from '../features/userSlice'

export const TrackOrder = ({ navigation }) => {
    const items = useSelector(selectBasketItems)
    const cartTotal = useSelector(selectBasketTotal)
    const showTrackOrder= useSelector(selectTrackOrderVisibility)
    return (
        <View>
        {showTrackOrder && (
            <View style={styles.cartContainer}>
            <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate('Map')}>
                <Text style={styles.viewCart}>Track Order</Text>
                {/* <Text>{cartTotal}</Text> */}
            </TouchableOpacity>
        </View>
        )}
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
        backgroundColor: '#ED5A6B',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#ED5A6B',
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
    }
})
