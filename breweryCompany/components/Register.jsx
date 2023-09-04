import React,{useState} from 'react'
import {View,Text,TextInput,StyleSheet, TouchableOpacity, onPress} from 'react-native'

const Register = ({navigation}) => {

    const [firstName,setFirstName]=useState('');
    const [lastName,setLastName]=useState('');
    const [email,setEmail]=useState('');
    const [number,setNumber]=useState('');
    const [password,setPassword]=useState('');

    const SignUp=()=>{
        fetch('https://2ab7-103-130-108-22.ngrok-free.app/registration', {
            method: "POST",
            headers: {
            //   Authorization: `Bearer ${TOKEN}`,
              Accept: "application/json",
    "Content-Type": "application/json",
            },
            body: JSON.stringify({
                firstName:firstName,
                lastName:lastName,
                email:email,
                phoneNumber:'+91'+number,
                password:password,
                role:"ROLE_ADMIN"
              }),
          })
          .then(response => {
            console.log('Response:', response);
            return response.json();
          })
          .then(data => {
            console.log('Data:', data);
          })
          .catch(error => {
            console.error("Error sending authentication request:", error);
          });
        navigation.navigate('Login')
    }


  return (
    <View style={styles.container}>
    <View style={styles.form}>
        <TextInput
        value={firstName}
        style={styles.input}
        placeholder='Frist Name'
        placeholderTextColor={'#4f4f4f'}
        onChangeText={(text)=>setFirstName(text)}
        />
        <TextInput
        value={lastName}
        style={styles.input}
        placeholder='Last Name'
        placeholderTextColor={'#4f4f4f'}
        onChangeText={(text)=>setLastName(text)}
        />
        <TextInput
        value={email}
        style={styles.input}
        placeholder='Email'
        placeholderTextColor={'#4f4f4f'}
        onChangeText={(text)=>setEmail(text)}
        />
        <TextInput
        value={number}
        style={styles.input}
        placeholder='Phone Number'
        placeholderTextColor={'#4f4f4f'}
        onChangeText={(text)=>setNumber(text)}
        />
        <TextInput
        value={password}
        style={styles.input}
        placeholder='Password'
        placeholderTextColor={'#4f4f4f'}
        onChangeText={(text)=>setPassword(text)}
        secureTextEntry/>
        <TouchableOpacity style={styles.button} onPress={()=>SignUp()}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        
      
    </View>
    </View>
  )
}
const styles=StyleSheet.create({
    container:{
      flex:1,
      justifyContent:'center',
      alignItems:'center',
    },
    form:{   
      width:'80%'
    },
    input:{
      borderBottomWidth:1,
      borderBottomColor:'#9f9f9f',
      margin:5,
      color:'#4f4f4f',
      fontWeight:"300"
    },
    button:{
      backgroundColor:'#fc3839',
      height:'13%',
      widht:'100%',
      alignItems:'center',
      justifyContent:'center',
      borderRadius:5,
      marginTop:10
      
    },
    buttonText:{
      color:'white',
      fontWeight:'bold'
    },
    registerText:{
      fontWeight:'bold',
      color:'#2f2f2f'
    },
    newUser:{
      marginTop:10,
      color:'#4f4f4f'
    }
})
export default Register
