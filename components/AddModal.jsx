import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign'
import RIcon from 'react-native-vector-icons/MaterialIcons'
import Modal from "react-native-modal";
import { useDispatch, useSelector } from 'react-redux';
import { addToBasket, removeFromBasket, selectBasketItems, selectBasketItemsWithId } from '../features/cartSlice';
import IndividualBeer from './IndividualBeer';
import { Cart } from './Cart';

const AddModal = ({navigation, isVisible, selectedBeer,onClose }) => {

   
    // console.log(items)
    console.log("Addd")
    return(
    <Modal
        onBackdropPress={onClose}
        onBackButtonPress={onClose}
        isVisible={isVisible}
        style={styles.modal}>
        {/* <View style={styles.center}>
                                    <TouchableOpacity style={styles.closeButton} onPress={toggleAddModal}>
                                        <Icon name="closecircle" color='white' size={25} />
                                    </TouchableOpacity>
                                </View> */}
        <View style={styles.modalContent}>
            {selectedBeer && (
                <View>

                    <View>
                        <Text style={styles.customtitle}>Customize you Order</Text>
                        <FlatList
                            data={selectedBeer.pricings} // Map through the pricings array
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <IndividualBeer actualBeerId={selectedBeer.id} id={item.id} name={selectedBeer.name} imageUrl={item.image_url} size_ml={item.size_ml} price={item.price} rating={selectedBeer.averageRating} tagline={selectedBeer.tagline}/>    
                            )}
                        />

                 </View>

                </View>
            )}
        </View>
        {/* <Cart navigation={navigation}/> */}
    </Modal>
);}

const styles = StyleSheet.create({


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
});

export default AddModal;