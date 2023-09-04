import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import Icon from 'react-native-vector-icons/AntDesign';
import RIcon from 'react-native-vector-icons/MaterialIcons';
import BIcon from 'react-native-vector-icons/Ionicons';
import RazorpayCheckout from 'react-native-razorpay';
import {
    removeFromBasket,
    selectBasketItems,
    addToBasket,
    selectBasketTotal,
    clearCart,
} from '../features/cartSlice';
import {
    selectOrigin,
    setDestiation,
} from '../features/navSlice';
import { selectAuthToken, selectUserId, setTrackOrderVisibility } from '../features/userSlice';
import SelectAddress from '../components/SelectAddress';

// Memoized selectors
const selectGroupedItems = (items) =>
    items.reduce((results, item) => {
        (results[item.id] = results[item.id] || []).push(item);
        return results;
    }, {});

const ViewCart = ({ navigation }) => {
    const items = useSelector(selectBasketItems, shallowEqual);
    const groupedItemsInBasket = useMemo(() => selectGroupedItems(items), [items]);
    const basketTotal = useSelector(selectBasketTotal);
    const origin = useSelector(selectOrigin);
    const authToken = useSelector(selectAuthToken);
    const userId = useSelector(selectUserId);
    const [modeOfCheckout, setModeOfCheckout] = useState("")

    console.log("items", groupedItemsInBasket)
    const dispatch = useDispatch();

    const [isAddressModalVisible, setAddressModalVisible] = useState(false);
    const [takeAway, setTakeAway] = useState(false);
    const [delivery, setDelivery] = useState(false);
    const [deliveryFee, setDeliveryFee] = useState(50)

    useEffect(() => {
        if (items.length === 0) {
            navigation.goBack();
        }
    }, [items, navigation]);

    useEffect(() => {
        dispatch(
            setDestiation({
                location: { lat: 12.9344793, lng: 77.6130544 },
                description: "Bob's Bar, 7th Block, Koramangala, Bengaluru, Karnataka, India",
            })
        );
    }, [dispatch]);

    const handleCheckout = useCallback(async (modeOfCheckout) => {
        // Prepare the cart items array from the groupedItemsInBasket
        console.log("checkoutmod", modeOfCheckout)
        const cartItems = []
        for (const [key, items] of Object.entries(groupedItemsInBasket)) {

            if (items[0]?.actualBeerId) {
                cartItems.push({
                    beerId: items[0]?.actualBeerId, // Convert the key to an integer if needed
                    beerQuantity: items.length,
                    beerVolumeInMl: items[0]?.size_ml,
                    beerAmount: items[0]?.price * items.length,
                    amountOfEachBeer: items[0]?.price
                });
            } else if (items[0]?.foodId) {
                cartItems.push({
                    foodId: items[0]?.foodId, // Convert the key to an integer if needed
                    foodQuantity: items.length,
                    foodAmount: items[0]?.price * items.length,
                    amountOfEachFood: items[0]?.price
                });
            }
        };

        console.log("CART", cartItems)
        const totalAmount = cartItems.reduce((total, item) => total + (item.beerAmount || 0) + (item.foodAmount || 0), 0.0);

        const requestBody = {
            userId: userId.userId,
            cartItems: cartItems,
            totalAmount: (modeOfCheckout === "DELIVERY") ? totalAmount + 150 : totalAmount,
            modeOfPayment: "ONLINE",
            modeOfDelivery: modeOfCheckout,
            status: "NOT DELIVERED",
            address: origin.description,
            lat: origin.location.lat,
            lng: origin.location.lng,
        };
        console.log("Request", requestBody)
        try {
            const response = await fetch(
                `http://54.89.234.175:8080/add_cart/${userId.userId}`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${authToken.authToken}`,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestBody),
                }
            );

            const data = await response.json();
            // dispatch(clearCart());
            console.log('Data response:', data);
            // if(data.messaage==="Cart added successfully"){
            dispatch(clearCart())
            // }
        } catch (error) {
            console.error('Error sending checkout request:', error);
        }
    }, [groupedItemsInBasket, authToken, userId, origin, dispatch]);

    const handleDeliveryCheckout = () => {
        console.log(modeOfCheckout)
        const options = {
            description: 'Credits towards consultation',
            image: 'https://i.imgur.com/3g7nmJC.jpg',
            currency: 'INR',
            key: 'rzp_test_b9g4fEjJObtIyC',
            amount: (basketTotal) * 100,
            name: 'Brew Haven',
            order_id: '', // Replace this with an order_id created using Orders API.
            prefill: {
                email: 'gaurav.kumar@example.com',
                contact: '9191919191',
                name: 'Gaurav Kumar',
            },
            theme: { color: '#ED5A6B' },
        };

        RazorpayCheckout.open(options)
            .then((data) => {
                console.log(`Success: ${data.razorpay_payment_id}`);
                handleCheckout(modeOfCheckout);
                navigation.navigate('PlacingOrder');
            })
            .catch((error) => {
                alert(`Error: ${error.code} | ${error.description}`);
            });
    };

    const calculateTotalPrice = (price, quantity) => {
        return price * quantity;
    };

    const handleTakeawaySelect = () => {
        setTakeAway(!takeAway);
        setModeOfCheckout("TAKEAWAY")
        setDelivery(false);
    };

    const handleDeliverySelect = () => {
        setDelivery(!delivery);
        setModeOfCheckout("DELIVERY")
        setTakeAway(false);
    };
    return (
        <View style={styles.cartContainer}>
            <View style={styles.headerContainer}>
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'flex-start' }}>
                    <View style={{ flexDirection: 'row', width: '63%', justifyContent: 'space-between', marginHorizontal: 10 }}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <BIcon name="chevron-back" size={25} color="black" />
                        </TouchableOpacity>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.header}>Item{"(s)"} added</Text>
                        </View>
                    </View>
                </View>
            </View>
            <ScrollView>
                <View style={styles.orders}>
                    {Object.entries(groupedItemsInBasket).map(([key, items]) => (
                        <View key={key} style={styles.itemContainer}>
                            <View>
                                <Image source={{ uri: items[0]?.imageUrl }} style={styles.itemImage} />
                            </View>



                            <View style={styles.nameContainer}>
                                <Text style={styles.itemName}>{items[0]?.name}</Text>
                                {items[0]?.size_ml && (
                                    <Text style={styles.itemName}>{items[0]?.size_ml} ml</Text>
                                )}
                            </View>




                            <View style={styles.counterButton}>
                                <TouchableOpacity disabled={!items.length} onPress={() => dispatch(removeFromBasket({ id: items[0]?.id }))}>
                                    <Icon name="minuscircle" size={25} color='#ED5A6B' />
                                </TouchableOpacity>
                                <Text style={styles.couterButtonText}>{items.length}</Text>
                                <TouchableOpacity onPress={() => dispatch(addToBasket({ id: items[0]?.id, name: items[0].name, imageUrl: items[0].imageUrl, tagline: items[0].tagline, rating: items[0].rating, price: items[0].price }))}>
                                    <Icon name="pluscircle" size={25} color='#ED5A6B' />
                                </TouchableOpacity>

                            </View>
                            <View style={styles.pricing}>
                                <RIcon name="currency-rupee" color='#2f2f2f' style={styles.price} />
                                <Text style={styles.price}>{calculateTotalPrice(items[0]?.price, items.length)}</Text>
                            </View>


                        </View>
                    ))}

                </View>

                <View style={styles.billSummary}>
                    <View style={styles.feeContainer}>
                        <Text style={styles.billSummaryText}>Select mode of checkout</Text>
                        <View style={styles.fee}>
                            <View style={styles.checkoutOption}>
                                <TouchableOpacity onPress={handleTakeawaySelect}>
                                    <Icon
                                        name={takeAway ? 'checkcircle' : 'checkcircleo'}
                                        size={20}
                                        color={takeAway ? '#ED5A6B' : 'black'}
                                        style={{ paddingHorizontal: 10 }}
                                    />
                                </TouchableOpacity>
                                <Text style={styles.totalText}>Takeaway</Text>
                            </View>
                            <View style={styles.checkoutOption}>
                                <TouchableOpacity onPress={handleDeliverySelect}>
                                    <Icon
                                        name={delivery ? 'checkcircle' : 'checkcircleo'}
                                        size={20}
                                        color={delivery ? '#ED5A6B' : 'black'}
                                        style={{ paddingHorizontal: 10 }}
                                    />
                                </TouchableOpacity>
                                <Text style={styles.totalText}>Delivery</Text>
                            </View>
                        </View>

                    </View>
                </View>

                <View style={styles.billSummary}>
                    <View style={styles.feeContainer}>
                        <Text style={styles.billSummaryText}>Bill summary</Text>
                        <View style={styles.fee}>
                            <Text style={styles.subtotalText}>Subtotal</Text>
                            <View style={styles.pricing}>
                                <RIcon name="currency-rupee" color='#2f2f2f' />
                                <Text style={styles.subtotalText}>{basketTotal}</Text>
                            </View>
                        </View>
                        {(modeOfCheckout === "DELIVERY") &&
                            <View style={styles.fee}>
                                <Text style={styles.subtotalText}>Delivery Fee </Text>
                                <View style={styles.pricing}>
                                    <RIcon name="currency-rupee" color='#2f2f2f' />
                                    <Text style={styles.subtotalText}>150</Text>
                                </View>
                            </View>
                        }
                        <View style={styles.line} />
                        {(modeOfCheckout === "DELIVERY") ? (
                            <View style={styles.fee}>
                                <Text style={styles.totalText}>Total </Text>
                                <View style={styles.pricing}>
                                    <RIcon name="currency-rupee" color='#2f2f2f' />
                                    <Text style={styles.totalText}>{basketTotal + 150}</Text>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.fee}>
                                <Text style={styles.totalText}>Total </Text>
                                <View style={styles.pricing}>
                                    <RIcon name="currency-rupee" color='#2f2f2f' />
                                    <Text style={styles.totalText}>{basketTotal}</Text>
                                </View>
                            </View>
                        )

                        }


                    </View>
                </View>

                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                    <View style={styles.totalOrder}>
                        {delivery ? (
                            <View style={styles.addressContainer}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "center" }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                        <RIcon name="location-on" size={25} color="#ED5A6B" />
                                        <Text style={{ color: 'black', fontFamily: 'Metropolis-Bold' }}>Deliver to</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => setAddressModalVisible(true)}>
                                        <Text style={{ color: "#ED5A6B", textTransform: "uppercase", fontFamily: "Metropolis-Medium", marginHorizontal: 10 }}>Change</Text>
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <Text style={styles.address}>{origin?.description}</Text>
                                </View>
                                {!origin ? (
                                    <TouchableOpacity style={styles.checkoutButton} onPress={() => setAddressModalVisible(true)}>
                                        <Text style={styles.checkoutButtonText}>Select Address</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity style={styles.checkoutButton} onPress={() => handleDeliveryCheckout()}>
                                        <Text style={styles.checkoutButtonText}>Checkout to payment</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        ) : (
                            // <TouchableOpacity style={styles.checkoutButton} onPress={() => handleDeliveryCheckout()}>
                            //     <Text style={styles.checkoutButtonText}>Checkout to payment</Text>
                            // </TouchableOpacity>
                            null
                        )}
                        {takeAway && (
                            <TouchableOpacity style={styles.checkoutButton} onPress={() => handleDeliveryCheckout()}>
                                <Text style={styles.checkoutButtonText}>Checkout to payment</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </ScrollView>
            <SelectAddress
                navigation={navigation}
                isVisible={isAddressModalVisible}
                onClose={() => setAddressModalVisible(false)} />
        </View>
    )
}

const styles = StyleSheet.create({
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#9f9f9f',
    },
    cartContainer: {
        height: '100%',
        flex: 1
    },
    header: {
        fontFamily: 'Metropolis-Bold',
        color: 'black',
        textTransform: 'uppercase',
    },
    orders: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'white',
        marginHorizontal: 10,
        elevation: 5,
    },
    headerContainer: {
        backgroundColor: 'white',
        marginTop: 0,
        marginBottom: 10,
        paddingVertical: 20,
        width: '100%',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        // elevation: 5,
        // padding: 8,
        // backgroundColor: 'white',
        // marginHorizontal: 10,
        // marginVertical: 5,
        paddingHorizontal: 15,
        paddingVertical: 10
    },
    nameContainer: {
        width: '40%'
    },
    itemName: {
        fontFamily: 'Metropolis-Medium',
        color: 'black',
        fontSize: 13,
        // textTransform: 'uppercase',
        width: '100%',
    },
    itemImage: {
        width: 50,
        height: 70,
        resizeMode: 'contain'
    },
    counterButton: {
        flexDirection: 'row',
        alignItems: 'center'
        // backgroundColor: '#ED5A6B',
    },
    couterButtonText: {
        color: '#4f4f4f',
        fontFamily: 'Metropolis-SemiBold',
        margin: 10
    },
    checkoutButton: {
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
    checkoutButtonText: {
        color: '#ffff',
        fontFamily: 'Metropolis-SemiBold',
        textTransform: 'uppercase'
    },
    price: {
        color: 'black',
        fontFamily: 'Metropolis-Medium',
        fontSize: 13
    },
    pricing: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    totalOrder: {
        justifyContent: 'flex-end',
        backgroundColor: 'white',
        marginBottom: 0,
        borderWidth: 1,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderColor: 'white'
    },
    subtotalText: {
        fontFamily: 'Metropolis-SemiBold',
        color: '#8f8f8f'
    },
    totalText: {
        fontFamily: 'Metropolis-SemiBold',
        color: '#2f2f2f'
    },
    fee: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    billSummary: {
        margin: 10,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10
    },
    feeContainer: {
        marginHorizontal: 15,
        marginVertical: 10,
    },
    addressContainer: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'white',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        marginBottom: 5,
        marginHorizontal: 2,
        flexDirection: 'column',
        padding: 10
    },
    address: {
        width: "100%",
        marginHorizontal: 10,
        marginTop: 5,
        color: 'black',
        fontFamily: 'Metropolis-Thin'
    },
    billSummaryText: {
        color: '#6f6f6f',
        fontFamily: 'Metropolis-SemiBold',
        textTransform: 'uppercase',
        justifyContent: 'center',
        textAlign: 'center'
    },
    checkoutOptions: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    checkoutOptionsLabel: {
        fontFamily: 'Metropolis-Bold',
        color: 'black',
        fontSize: 16,
        marginBottom: 5,
    },
    checkoutOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    checkoutOptionText: {
        fontFamily: 'Metropolis-Medium',
        color: 'black',
        fontSize: 16,
        marginLeft: 10,
    },
})

export default ViewCart

