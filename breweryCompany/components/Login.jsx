import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, onPress, Image, Modal } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { setAuthToken, setUserId } from '../features/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OtpModal from './OtpModal';
import PasswordModal from './PasswordModal';
import logo from '../assets/logo.png'

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isOtpVisible, setOtpVisible] = useState(false)
  const [isPasswordVisible, setPasswordVisible] = useState(false)
  const dispatch = useDispatch()
  useEffect(() => {
    // Check if auth token and user id exist in AsyncStorage
    const checkAsyncStorage = async () => {
      try {
        const authToken = await AsyncStorage.getItem('authToken');
        const userId = await AsyncStorage.getItem('userId');
        console.log("token ", authToken)
        if (authToken && userId) {
          // Dispatch auth token and user id to Redux
          navigation.replace('HomeLoading');
          dispatch(setAuthToken({ authToken: authToken }));
          dispatch(setUserId({ userId: userId }));

          // Navigate to HomeLoading screen

        }
      } catch (error) {
        console.error('Error checking AsyncStorage:', error);
      }
    };

    checkAsyncStorage();
  }, [navigation, dispatch]);


  const loginHandler = async () => {
    try {
      const response = await fetch("http://54.89.234.175:8080/auth/login/otp-login1", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
        }),
      });

      console.log("Raw response:", response);

      const responseData = response;
      if (responseData.status === 200) {

        setOtpVisible(true)
      } else {
        console.log("Authentication failed");
      }

      dispatch(setUserId({ userId: responseData.userId }));
    } catch (error) {
      console.error("Error sending authentication request:", error);
    }
  };
  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.image} />
      <View style={styles.form}>
        <TextInput
          value={email}
          style={styles.input}
          placeholder='Email/ Phone Number'
          placeholderTextColor={'#6f6f6f'}
          onChangeText={(text) => setEmail(text)}
        />
        {/* <TextInput
        value={password}
        style={styles.input}
        placeholder='Password'
        placeholderTextColor={'#4f4f4f'}
        onChangeText={(text)=>setPassword(text)}
        secureTextEntry/> */}
        <TouchableOpacity style={styles.button} onPress={() => loginHandler()}>
          <Text style={styles.buttonText}>Login with otp</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setPasswordVisible(true)}>
          <Text style={styles.buttonText}>Login with password</Text>
        </TouchableOpacity>
        <Text style={styles.newUser}>New to this platform?<Text style={styles.registerText} onPress={() => navigation.navigate('Register')}> SIgn Up</Text></Text>

      </View>
      <OtpModal
        isVisible={isOtpVisible}
        navigation={navigation}
        onClose={() => setOtpVisible(false)}
      />

      <PasswordModal
        isVisible={isPasswordVisible}
        navigation={navigation}
        email={email}
        onClose={() => setPasswordVisible(false)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: "white"
  },
  image: {
    width: "100%",
    height: "50%",
    resizeMode: "contain"
  },
  form: {
    width: '80%',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#9f9f9f',
    margin: 5,
    color: '#2f2f2f',
    fontWeight: "300",
    fontFamily: "Metropolis-Medium"
  },
  button: {
    backgroundColor: '#FC3839',
    height: '15%',
    widht: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 5,
    letterSpacing: 10
  },
  buttonText: {
    color: 'white',
    fontFamily: "Metropolis-SemiBold",
    letterSpacing: 1,
    textTransform: 'uppercase'
  },
  registerText: {
    fontWeight: 'bold',
    color: '#2f2f2f'
  },
  newUser: {
    marginTop: 10,
    color: '#4f4f4f'
  }
})

export default Login
