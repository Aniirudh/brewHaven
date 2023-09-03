import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign'
import RIcon from 'react-native-vector-icons/MaterialIcons'
import Modal from "react-native-modal";

const DetailModal = ({ isVisible, onClose,name,abv,ibu,ph,brewers_tips,imageUrl, isDetailModalVisible }) => (
    <Modal
        onBackdropPress={onClose}
        onBackButtonPress={onClose}
        isVisible={isVisible}
        // swipeDirection="down"
        // onSwipeComplete={toggleDetailModal}
        // animationIn="fadeInUp"
        // animationOut="fadeOutDown"
        // animationInTiming={500}
        // animationOutTiming={500}
        // backdropTransitionInTiming={500}
        // backdropTransitionOutTiming={500}
        style={styles.modal}>
        <View style={styles.modalContent}>
            {/* <TouchableOpacity style={styles.closeButton} onPress={toggleDetailModal}>
                        <Icon name="closecircle" color='black' size={25}/>
                    </TouchableOpacity> */}
            
                <View>
                    <View style={styles.center}>
                        {/* <TouchableOpacity style={styles.closeButton} onPress={toggleDetailModal}>
                                        <Icon name="closecircle" color='black' size={25} />
                                    </TouchableOpacity> */}
                    </View>
                    <View>
                        <View style={styles.modalContentContainer}>
                            <View style={styles.beerInfo}>
                                <Text style={styles.modaltitle}>{name}</Text>
                                {/* <Text style={styles.beerDescription}>{selectedBeer.description}</Text> */}
                                <View style={styles.unit}>
                                    <Text style={styles.unitHeading}>ABV{"(%)"} : {abv}</Text>
                                    <Text style={styles.unitHeading}>IBU: {ibu}</Text>
                                </View>
                                <View style={styles.container}>
                                    <Text style={styles.ingredientsHeading}>Ingredients:</Text>
                                    <Text style={styles.ingredients}>Maris Otter Extra Pale, Caramalt, Munich, Fuggles, First Gold, Cascade</Text>
                                </View>
                                <View style={styles.container}>
                                    <Text style={styles.ingredientsHeading}>Brewer's Tips</Text>
                                    <Text style={styles.ingredients}>{brewers_tips}</Text>
                                </View>
                            </View>
                            <View>
                                <Image source={{ uri: imageUrl}} style={styles.img} />
                            </View>
                        </View>
                        <View>

                        </View>
                    </View>

                </View>
            
        </View>
    </Modal>
);

const styles = StyleSheet.create({

    card: {
        height: 160,
        margin: 10,
        borderRadius: 10,
        backgroundColor: 'white',
        elevation: 5,
        padding: 8,
        justifyContent: 'center'

    },

    closeButton: {
        margin: 10
    },
    addImg: {
        width: 50,
        height: 80,
        resizeMode: 'contain'
    },
    shadowProp: {
        elevation: 5,
        shadowColor: '#171717',
    },
    content: {
        width: '70%'
    },
    title: {
        color: 'black',
        fontFamily: "Metropolis-Bold",
        fontSize: 15,
        marginBottom: 5
    },
    customtitle: {
        color: 'black',
        fontFamily: "Metropolis-Bold",
        fontSize: 15,
        margin: 5
    },
    tagline: {
        color: '#4f4f4f',
        fontFamily: "Metropolis-Light",
        // marginTop: 5
    },
    rating: {
        marginTop: 0,
        flexDirection: 'row',
        alignItems: 'center'
    },
    ratingText: {
        color: '#18983E',
        margin: 3,
        fontFamily: 'Metropolis-SemiBold'
    },
    price: {
        color: '#2f2f2f',
        fontFamily: 'Metropolis-SemiBold'
    },
    pricing: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        justifyContent: 'space-between'
    },

    buttonText: {
        fontFamily: 'Metropolis-SemiBold',
        color: 'white',
        textTransform: 'uppercase'
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
    modaltitle: {
        color: 'black',
        fontFamily: 'Metropolis-Bold',
        margin: 5,
        fontSize: 16,
    },
    beerInfo: {
        width: '70%'
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
    img: {
        width: 100,
        height: 250,
        resizeMode: 'contain',
        marginTop: 15
    },
    modalContentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        padding: 5
    },
    beerDescription: {
        color: '#9f9f9f',
        fontFamily: 'Metropolis-Light',
        textAlign: 'justify',
        marginBottom: 10
    },
    unit: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10
    },
    unitHeading: {
        color: '#4f4f4f',
        fontFamily: 'Metropolis-Regular',
        letterSpacing: 0.1,
        // textTransform: 'uppercase'
    },
    ingredientsHeading: {
        color: 'black',
        fontFamily: 'Metropolis-SemiBold',
        letterSpacing: 0.1,
        textTransform: 'uppercase'
    },
    ingredients: {
        marginTop: 5,
        color: '#9f9f9f',
        fontFamily: 'Metropolis-Light',
        letterSpacing: 0.8,
        // textAlign: 'justify',
    },
    container: {
        margin: 10
    }
});
export default DetailModal;