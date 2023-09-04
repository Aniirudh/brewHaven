import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign'
import RIcon from 'react-native-vector-icons/MaterialIcons'
import Modal from "react-native-modal";
import { useDispatch, useSelector } from 'react-redux';
import { setAuthToken, setUserId } from '../features/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';

const PasswordModal = ({ isVisible, onClose, navigation, email }) => {
    const [password, setPassword] = useState('')
    const [alertVisible, setAlertVisible] = useState(false);
    const dispatch = useDispatch()

    const showAlert = () => {
        setAlertVisible(true);
      };
    
      // Function to close the custom alert
      const closeAlert = () => {
        setAlertVisible(false);
      };

    const loginHandler = async () => {
        try {
            const response = await fetch("https://2ab7-103-130-108-22.ngrok-free.app/auth/login/passcode-login", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: email,
                    password: password,
                }),
            });

            console.log("Raw response:", response);

            const responseData = await response.json();
            if (responseData.jwrToken) {
                const TOKEN = responseData.jwrToken;

                await AsyncStorage.setItem('authToken', TOKEN);
                await AsyncStorage.setItem('userId', responseData.userId.toString());

                console.log("token in login", TOKEN)
                dispatch(setAuthToken({ authToken: TOKEN }));
                dispatch(setUserId({ userId: responseData.userId }));
                navigation.replace('HomeLoading');
            } else {
                console.log("Authentication failed");
            }


        } catch (error) {
            console.error("Error sending authentication request:", error);
            showAlert(); 
        }
    };

    return (
        <View>
        <Modal
            onBackdropPress={onClose}
            onBackButtonPress={onClose}
            isVisible={isVisible}
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
                            <TextInput
                                value={password}
                                autoComplete='sms-otp'
                                autoFocus
                                style={styles.input}
                                placeholder='Password'
                                placeholderTextColor={'#4f4f4f'}
                                onChangeText={(text) => setPassword(text)}
                                secureTextEntry />
                            <View style={{ justifyContent: "flex-end" }}>
                                <TouchableOpacity style={styles.button} onPress={() => loginHandler()}>
                                    <Text style={styles.buttonText}>Login</Text>
                                </TouchableOpacity>
                                <Text style={styles.registerText} onPress={() => navigation.navigate('ForgotPassword')}>Forgot Password?</Text>
                            </View>
                        </View>
                        <View>

                        </View>
                    </View>

                </View>

            </View>
        </Modal>
        <AwesomeAlert
                show={alertVisible}
                showProgress={false}
                title="Authentication Failed"
                message="Invalid Username or password"
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={false} // Hide cancel button
                showConfirmButton={true}
                confirmText="OK"
                confirmButtonColor="#FC3839"
                onConfirmPressed={() => {
                    closeAlert(); // Close the alert on "OK" button press
                }}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#9f9f9f',
        margin: 5,
        color: '#2f2f2f',
        fontWeight: "300",
        fontFamily: "Metropolis-Medium",
        width: "100%"
    },
    button: {
        backgroundColor: '#FC3839',
        height: '50%',
        widht: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        letterSpacing: 10,
        paddingVertical: 12

    },
    buttonText: {
        color: 'white',
        fontFamily: "Metropolis-SemiBold",
        letterSpacing: 1,
        textTransform: 'uppercase'
    },

    closeButton: {
        margin: 10
    },
    registerText: {
        fontFamily: 'Metropolis-SemiBold',
        color: '#2f2f2f',
        marginTop: 10,
        fontSize: 13,
        alignItems: "center"
    },
    newUser: {
        marginTop: 10,
        color: '#4f4f4f'
    },

    shadowProp: {
        elevation: 5,
        shadowColor: '#171717',
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
        height: 350,
        // paddingBottom: 20,
    },
    modaltitle: {
        color: 'black',
        fontFamily: 'Metropolis-Bold',
        margin: 5,
        fontSize: 16,
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

    modalContentContainer: {
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        marginTop: 10,
        padding: 5,
    },

    container: {
        margin: 10
    }
});
export default PasswordModal;