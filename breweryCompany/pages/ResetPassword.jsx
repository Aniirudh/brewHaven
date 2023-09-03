import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Button, Alert } from 'react-native';
import BIcon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { selectAuthToken } from '../features/userSlice';

const ResetPassword = ({ navigation, route }) => {
    const authToken = useSelector(selectAuthToken);
    const [number, setNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(2); // Step 1: Enter Number (Skipped), Step 2: Verify OTP, Step 3: Reset Password

    // Function to request OTP
    const requestOTP = async () => {
        try {
            const response = await fetch("https://10fe-103-130-108-23.ngrok-free.app/forgot-password", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${authToken.authToken}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: route.params.email,
                }),
            });

            console.log("Raw response:", response);

            const responseData = response;
            if (responseData.status === 200) {
                setStep(2);
            } else {
                console.log("Authentication failed");
            }
        } catch (error) {
            console.error("Error sending authentication request:", error);
        }
    };

    // Function to verify OTP
    const verifyOTP = async () => {
        try {
            const response = await fetch("https://10fe-103-130-108-23.ngrok-free.app/verify-otp", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    eotp: otp,
                }),
            });

            console.log("Raw response:", response);

            if (response.status === 200) {
                setStep(3);
            } else {
                console.log("Authentication failed");
            }
        } catch (error) {
            console.error("Error sending authentication request:", error);
        }
    };

    // Function to reset password
    const resetPassword = async () => {
        // Implement your API call here to reset the password
        // Ensure newPassword and confirmPassword match
        if (newPassword === confirmPassword) {
            // Passwords match, proceed with the API call set-new-password
            // Upon success, show a success message or navigate to login page
            try {
                const response = await fetch("https://10fe-103-130-108-23.ngrok-free.app/set-new-password", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "newPassword": newPassword,
                        "confirmNewPassword": confirmPassword
                    }),
                });

                console.log("Raw response:", response);

                const responseData = await response.json();
                if (responseData.status === 200) {
                    setStep(3);
                } else {
                    console.log("Authentication failed");
                }

                dispatch(setUserId({ userId: responseData.userId }));
            } catch (error) {
                console.error("Error sending authentication request:", error);
            }

            Alert.alert('Password Reset Successful', 'You can now log in with your new password.', [
                { text: 'OK', onPress: () => navigation.replace('Profile') },
            ]);
        } else {
            // Passwords do not match, show an error message
            Alert.alert('Password Mismatch', 'New passwords do not match. Please try again.');
        }
    };

    // Automatically request OTP when the component loads
    useEffect(() => {
        requestOTP();
    }, []); // Empty dependency array, so it runs only once on component load

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {step !== 2 && (
                    <TouchableOpacity onPress={() => setStep(step - 1)}>
                        <BIcon name="chevron-back" size={25} color="black" />
                    </TouchableOpacity>
                )}
            </View>
            <Text style={styles.title}>Reset Password</Text>
            {step === 2 && (
                <View>
                    <Text style={{ color: "black" }}>Enter the OTP sent to your number:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="OTP"
                        onChangeText={text => setOtp(text)}
                        value={otp}
                        placeholderTextColor={"black"}
                    />
                    <Button title="Verify OTP" onPress={verifyOTP} />
                </View>
            )}
            {step === 3 && (
                <View>
                    <Text style={{ color: "black" }}>Set a new password:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="New Password"
                        onChangeText={text => setNewPassword(text)}
                        value={newPassword}
                        secureTextEntry
                        placeholderTextColor={"black"}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm New Password"
                        onChangeText={text => setConfirmPassword(text)}
                        value={confirmPassword}
                        secureTextEntry
                    />
                    <Button title="Reset Password" onPress={resetPassword} />
                </View>
            )}
        </View>
    );
};

export default ResetPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    header: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'flex-start',
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: "black",
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        color: "black",
    },
});