import { StyleSheet, Text, View, TouchableOpacity, FlatList, onPress, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import BIcon from 'react-native-vector-icons/Ionicons'
import Icon from 'react-native-vector-icons/FontAwesome'
import RIcon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { selectAuthToken, selectUserId } from '../features/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Profile = ({ navigation }) => {
    const [reviewsVisibility, setReviewsVisibility] = useState(false)
    const [iconName, setIconName] = useState("chevron-down")
    const authToken = useSelector(selectAuthToken);
    const userId = useSelector(selectUserId)
    const [user, setUser] = useState(null)
    useEffect(() => {
        if (authToken.authToken) {
            fetch(`https://2ab7-103-130-108-22.ngrok-free.app/userwithaddress/${userId.userId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${authToken.authToken}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            })
                .then(response => response.json())
                .then(data => {
                    setUser(data)
                })
                .catch(error => {
                    console.error('Error fetching beer data:', error);
                });
        }
    }, [authToken.authToken]);

    const toggleReviewsVisibility = () => {
        setReviewsVisibility(!reviewsVisibility);
        setIconName(reviewsVisibility ? "chevron-down" : "chevron-up");
    };


    const handleDeleteAddress = async (addressId) => {
        console.log("address id", addressId)
        const requestBody = {
            "ratingValue": 34,
            "review": 234
        };
        console.log(authToken.authToken)
        try {
            const response = await fetch(`https://2ab7-103-130-108-22.ngrok-free.app/delete_addresse/${addressId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${authToken.authToken}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
            console.log(response)
            if (response.ok) {
                // Update the user state after deleting the address
                const updatedAddressList = user?.addressList.filter(item => item.id !== addressId);
                setUser(prevUser => ({
                    ...prevUser,
                    addressList: updatedAddressList,
                }));
            } else {
                console.error('Failed to delete address:', response.status);
            }
        } catch (error) {
            console.error('Error deleting address:', error);
        }
    };

    const logoutHandler = async () => {
        // Clear AsyncStorage
        try {
            await AsyncStorage.clear();
            // Dispatch actions to clear Redux state if needed
            // ...

            // Navigate to the login screen
            navigation.replace('Login'); // Replace 'Login' with your login screen name
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };


    console.log(user)
    return (
        <ScrollView style={{ backgroundColor: "white", flex: 1 }}>


            <View style={styles.header}>
                <View style={{ flexDirection: 'row', width: '55%', justifyContent: 'space-between', marginHorizontal: 10 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <BIcon name="chevron-back" size={25} color="black" />
                    </TouchableOpacity>
                    <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                        <Text style={{ color: "black", textTransform: "uppercase", fontFamily: "Metropolis-SemiBold" }}>Profile</Text>
                    </View>
                </View>
            </View>
            <View>
                {/* <View style={{ flexDirection: "row", justifyContent: "center", marginVertical: 15 }}>
                    <Icon name="user-circle" size={100} color="gray" />
                </View> */}
                <View style={styles.userDetails}>

                    <Text style={[styles.text, styles.name]}>{user?.firstName} {user?.lastName}</Text>
                    <Text style={styles.text}>{user?.phoneNumber}</Text>
                    <Text style={styles.text}>{user?.email}</Text>
                    <View>
                        <TouchableOpacity activeOpacity={.7} onPress={toggleReviewsVisibility} style={{ borderBottomWidth: 1, borderBottomColor: "silver", flexDirection: "row", justifyContent: "space-between", alignItems:"center" }}>
                            <Text style={[ styles.name, styles.textContainer]}>Saved addresses</Text>
                            <RIcon name={iconName} color="#7f7f7f" size={25} />
                        </TouchableOpacity>

                        {/* <Text style={[styles.text, styles.name, styles.textContainer]}>Saved addresses</Text> */}
                        {reviewsVisibility && user?.addressList && (
                            <FlatList
                                data={user.addressList}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <View style={styles.addressContainer}>
                                        <Text style={styles.addressText}>{item.address}</Text>
                                        <TouchableOpacity onPress={() => handleDeleteAddress(item?.id)}>
                                            <View style={{ alignItems: "flex-end" }}>
                                                <Text style={styles.deleteButton}>Delete</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        )}
                    </View>

                    <View >
                        <TouchableOpacity onPress={() => navigation.navigate("OrderHistory")}  style={{ borderBottomWidth: 1, borderBottomColor: "silver", flexDirection: "row", justifyContent: "space-between", alignItems:"center" }}>
                            <Text style={[ styles.name, styles.textContainer]}>Past orders</Text>
                            <RIcon name="chevron-forward" color="#7f7f7f" size={25} />
                            </TouchableOpacity>
                    </View>
                    <View >
                        <TouchableOpacity onPress={() => navigation.navigate("ResetPassword",{email: user?.email})}  style={{ borderBottomWidth: 1, borderBottomColor: "silver", flexDirection: "row", justifyContent: "space-between", alignItems:"center" }}>
                            <Text style={[ styles.name, styles.textContainer]}>Reset password</Text>
                            <RIcon name="chevron-forward" color="#7f7f7f" size={25} />
                            </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity style={styles.logoutButton} onPress={logoutHandler}>
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </View>


        </ScrollView>
    )
}

export default Profile

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 15
    },
    name: {
        textTransform: "uppercase"
    },
    text: {
        color: "black",
        fontFamily: "Metropolis-Medium",
        borderBottomWidth: 1,
        borderBottomColor: "silver",
        fontSize: 15,
        letterSpacing: 1,
        marginVertical: 10,
        padding: 10
    },
    userDetails: {
        marginHorizontal: 15,
        flexDirection: "column",
        justifyContent: "space-around",
        marginVertical: 10
    },
    textContainer: {
        color: "black",
        fontFamily: "Metropolis-Medium",
        fontSize: 15,
        letterSpacing: 1,
        marginVertical: 10,
        padding: 10
    },
    addressContainer: {
        borderBottomWidth: 1,
        borderBottomColor: "silver",
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 5
    },
    addressText: {
        color: "black",
        fontFamily: "Metropolis-Thin",
        fontSize: 15,
    },
    deleteButton: {
        color: 'red',
        fontFamily: 'Metropolis-Medium',
        fontSize: 12,
        textTransform: "uppercase",
        marginVertical: 5,
        alignItems: "flex-end"
    },
    logoutButton: {
        flexDirection:"row",
        backgroundColor: 'red',
        marginHorizontal: 15,
        marginTop: 20,
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent:"center",
        
        width:"30%"
    },
    logoutButtonText: {
        color: 'white',
        fontFamily: 'Metropolis-SemiBold',
        fontSize: 16,
        textTransform: 'uppercase',
    },
})