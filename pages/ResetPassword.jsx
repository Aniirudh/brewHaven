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


    const [alertVisible, setAlertVisible] = useState(false);
    const [alertData, setAlertData] = useState({
        title: '',
        message: '',
        statusCode: '',
    });

    const showAlert = (title, message, statusCode) => {
        setAlertData({ title, message, statusCode });
        setAlertVisible(true);
    };

    // Function to close the custom alert
    const closeAlert = () => {
        setAlertVisible(false);
    };

    // Function to request OTP
    const requestOTP = async () => {
        try {
            const response = await fetch("http://54.89.234.175:8080/forgot-password", {
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
                showAlert('Error', 'Enter valid Phone Number', 'Invalid Phone Number');
            }
        } catch (error) {
            console.error("Error sending authentication request:", error);
        }
    };

    // Function to verify OTP
    const verifyOTP = async () => {
        try {
            const response = await fetch("http://54.89.234.175:8080/verify-otp", {
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
                showAlert('Error', 'Invalid OTP', 'Authentication failed');
            }
        } catch (error) {
            console.error("Error sending authentication request:", error);
        }
    };

    // Function to reset password
    const resetPassword = async () => {
        // Check if both newPassword and confirmPassword are not empty and meet your validation criteria
        if (newPassword.trim() !== '' && confirmPassword.trim() !== '') {
            // Implement your API call here to reset the password
            // Ensure newPassword and confirmPassword match
            const passwordRegex = /^(?=.*[A-Za-z0-9])[A-Za-z0-9\d@#$%^&!_*]+$/;
            if (newPassword.length >= 4 &&
                passwordRegex.test(newPassword) &&
                newPassword === confirmPassword) {
                // Passwords match, proceed with the API call set-new-password
                // Upon success, show a success message or navigate to the login page
                try {
                    const response = await fetch("http://54.89.234.175:8080/set-new-password", {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            newPassword: newPassword,
                            confirmNewPassword: confirmPassword,
                        }),
                    });

                    console.log("Raw response:", response);

                    if (response.status === 200) {
                        setStep(3);
                        // Alert.alert('Password Reset Successful', 'You can now log in with your new password.', [
                        //   { text: 'OK', onPress: () => navigation.replace('Login') },
                        // ]);
                        setPasswordResetSuccess(true);
                    } else {
                        console.log("Authentication failed");
                        Alert.alert('Password Reset Unsuccessful', 'Please try again.', [
                            { text: 'OK', onPress: () => navigation.replace('Profile') },
                        ]);
                    }

                } catch (error) {
                    console.error("Error sending authentication request:", error);
                }
            } else {
                // Passwords do not match, show an error message
                showAlert('Error', 'Password must be at least 4 characters long and can include letters, numbers, and special characters. It must also start with a letter or number.', 'Password Requirements');
            }
        } else {
            // Show an error message for empty passwords
            showAlert('Error', 'Please enter a valid password.', 'Password Error');
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
                    <TouchableOpacity style={styles.button} onPress={verifyOTP}>
                        <Text style={styles.buttonText}>Verify OTP</Text>
                    </TouchableOpacity>               
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
                    <TouchableOpacity style={styles.button} onPress={resetPassword}>
                        <Text style={styles.buttonText}>Reset Password</Text>
                    </TouchableOpacity>
                </View>
            )}
            <Modal
                visible={alertVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={closeAlert}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalHeader}>
                            {alertData.statusCode}
                        </Text>
                        <Text style={styles.modalMessage}>{alertData.message}</Text>
                        <TouchableOpacity style={styles.button} onPress={closeAlert}>
                            <Text style={styles.buttonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                visible={passwordResetSuccess}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setPasswordResetSuccess(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalHeader}>Password Reset Successful</Text>
                        <Text style={styles.modalMessage}>
                            You can now log in with your new password.
                        </Text>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                // Close the modal and navigate to the login screen
                                setPasswordResetSuccess(false);
                                navigation.replace('Login');
                            }}
                        >
                            <Text style={styles.buttonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        borderBottomWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        color: "black",
    },
    button: {
        backgroundColor: '#fc3839',
        widht: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        marginTop: 5,
        letterSpacing: 10,
        paddingVertical: 15,
        paddingHorizontal: 15
    },
    buttonText: {
        color: 'white',
        fontFamily: "Metropolis-SemiBold",
        letterSpacing: 1,
        textTransform: 'uppercase'
    },
});