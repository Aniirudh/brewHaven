import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign'
import RIcon from 'react-native-vector-icons/MaterialIcons'
import DetailModal from './DetailModal';
import AddModal from './AddModal';
import { useDispatch, useSelector } from 'react-redux';
import { selectTrackOrderVisibility } from '../features/userSlice'
import { addToBasket, removeFromBasket, selectBasketItems, selectBasketItemsWithId } from '../features/cartSlice';

const Cards = ({ navigation, item, id, imageUrl, name, tagline, rating, price,pricings }) => {
    const [isDetailModalVisible, setDetailModalVisible] = useState(false);
    const [isAddModalVisible, setAddModalVisible] = useState(false);
    const [itemButton, setItemButton] = useState(false)
    const items = useSelector((state) => selectBasketItemsWithId(state, id))
    const dispatch = useDispatch()
    const showTrackOrder = useSelector(selectTrackOrderVisibility)
    const size_ml= 0

    const addItemToBasket = () => {
        dispatch(addToBasket({ id, name, imageUrl, tagline, rating,price, size_ml }))
        setItemButton(true)
    }


    const removeItemFromBasket = () => {
        if (items.length === 1) {
            setItemButton(false)
        }
else if (!items.length > 0) { return; }

        dispatch(removeFromBasket({ id }))
    }

    // console.log(items)

    const handleOnAddPress = (item) => {
        // setAddModalVisible(true);
        setItemButton(true)
    };

    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity activeOpacity={.85} style={[styles.card]} onPress={() => navigation.navigate('BeerDetails',{id: id}) }>
                <View style={{ flexDirection: 'row' }}>
                    <Image style={styles.cardImage} source={{ uri: imageUrl }} />
                    <View style={styles.content}>
                        <Text style={styles.title}>{name}</Text>
                        <Text numberOfLines={1} style={styles.tagline}>{tagline}</Text>
                        <View style={styles.rating}>
                            <Icon name="star" color="#18983E" size={15} />
                            <Text style={styles.ratingText}>{rating}</Text>
                        </View >
                        <View style={styles.pricing}>
                            <RIcon name="currency-rupee" color="#2f2f2f" size={16} />
                            <Text style={styles.price}>{item.pricings[0].price} - </Text>
                            <RIcon name="currency-rupee" color="#2f2f2f" size={16} />
                            <Text style={styles.price}>{item.pricings[3].price}</Text>
                        </View>
                        <View style={styles.footer}>
                            <TouchableOpacity onPress={() => setDetailModalVisible(true)}>
                                <Text style={styles.more}>More Details {">"}</Text>
                            </TouchableOpacity>
                            {itemButton ? (
                                <View style={styles.counterButton}>
                                    <TouchableOpacity disabled={!items.length} onPress={removeItemFromBasket}>
                                        <Icon name="minuscircle" size={25} color='#ED5A6B' />
                                    </TouchableOpacity>
                                    <Text style={styles.couterButtonText}>{items.length}</Text>
                                    <TouchableOpacity onPress={addItemToBasket}>
                                        <Icon name="pluscircle" size={25} color='#ED5A6B' />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                // <TouchableOpacity style={styles.button} onPress={addItemToBasket}>
                                //     <Text style={styles.buttonText}>Add</Text>
                                // </TouchableOpacity>
                                <TouchableOpacity style={styles.button} onPress={()=> setAddModalVisible(true)}>
                                    <Text style={styles.buttonText}>Add</Text>
                                </TouchableOpacity>
                            )}


                        </View>
                    </View>
                </View>
            </TouchableOpacity>
            <DetailModal
                isVisible={isDetailModalVisible}
                name={item.name}
                abv={item.abv}
                ibu={item.ibu}
                ph={item.ph}
                brewers_tips={item.brewers_tips}
                imageUrl={item.image_url}
                onClose={() => setDetailModalVisible(false)}
                isDetailModalVisible={isDetailModalVisible}
            />

            <AddModal
                isVisible={isAddModalVisible}
                selectedBeer={item}
                navigation={navigation}
                // onQuantityChange={(newQuantity) => updateQuantity(selectedBeer, newQuantity)}
                // onDeleteQuantity={() => deleteQuantity(selectedBeer)}
                // addQuantity={() => addQuantity(selectedBeer)}
                // quantity={0}
                onClose={() => setAddModalVisible(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#9f9f9f'
    },
    heading: {
        textTransform: 'uppercase',
        width: 250,
        textAlign: 'center',
        fontFamily: 'Metropolis-Medium',
        color: '#8f8f8f',
        letterSpacing: 1,
        // margin:5
    },
    headingContainer: {
        marginTop: 15,
        marginBottom: 5
    },
    card: {
        height: 160,
        marginHorizontal: 10,
        marginVertical:5 ,
        borderRadius: 10,
        backgroundColor: 'white',
        elevation: 5,
        padding: 8,
        justifyContent: 'center'

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
        resizeMode: 'contain',
        
    },
    shadowProp: {
        elevation: 5,
        shadowColor: '#171717',
    },
    cardImage: {
        height: 130,
        width: '30%',
        resizeMode: 'contain', 
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
    more: {
        color: '#7f7f7f',
        fontFamily: 'Metropolis-Medium',
        borderWidth: 0.6,
        borderColor: '#9f9f9f',
        paddingHorizontal: 5,
        paddingVertical: 3,
        fontSize: 12,
        borderRadius: 15

    },
    button: {
        backgroundColor: '#FC3839',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 5,
        marginRight: 10,
    },
    counterButton: {
        flexDirection: 'row',
        alignItems: 'center'
        // backgroundColor: '#ED5A6B',
    },
    buttonText: {
        fontFamily: 'Metropolis-SemiBold',
        color: 'white',
        textTransform: 'uppercase'
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

export default Cards;