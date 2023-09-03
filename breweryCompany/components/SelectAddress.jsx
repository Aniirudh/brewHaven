import React, { useState,useEffect } from 'react'
import { View, Text, StyleSheet,TouchableOpacity, FlatList } from 'react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Map from './Map';
import { useDispatch,useSelector } from 'react-redux'
import { setDestiation, setOrigin } from '../features/navSlice';
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/AntDesign'
import NavIcon from 'react-native-vector-icons/MaterialIcons'
import { selectAuthToken, selectUserId } from '../features/userSlice';


const SelectAddress = ({ isVisible, onClose, navigation }) => {
    const dispatch = useDispatch();

    const authToken = useSelector(selectAuthToken);
    const userId = useSelector(selectUserId)
    const [beer, setBeer] = useState([]);
    const [address,setAddress] = useState([])

    useEffect(() => {
        if (authToken.authToken) {
            fetch(`https://10fe-103-130-108-23.ngrok-free.app/address/${userId.userId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${authToken.authToken}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            })
                .then(response => response.json())
                .then(data => {
                    setAddress(data);
                })
                .catch(error => {
                    console.error('Error fetching address data:', error);
                });
        }
    }, [authToken.authToken]);
    console.log(address)

    const GOOGLE_MAPS_APIKEY = 'AIzaSyAZOYcbktSK5cB_hNu91XWV15jAB9JlzIA'
    return (
        <Modal
        onBackdropPress={onClose}
        onBackButtonPress={onClose}
        isVisible={isVisible}
        style={styles.modal}>
        <View style={styles.modalContent}>
            <View style={{height:"80%"}}>
                <View style={{marginHorizontal:10,marginVertical:10}}>
                    <Text style={{color:"black",fontFamily:"Metropolis-Medium",fontSize:16}}>Select an Address</Text>
                </View>
                <TouchableOpacity onPress={()=>navigation.navigate('EnterAddress')} style={{marginHorizontal:10,marginVertical:10,borderWidth:1,borderColor:"gray",paddingHorizontal:10,paddingVertical:12,borderRadius:10,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <Icon name="plus" size={25} color="#ED5A6B"/>
                    <Text style={{color:"black",marginHorizontal:10,fontFamily:"Metropolis-Medium"}}>Add Address</Text>
                    </View>
                    <View>
                        <NavIcon name="navigate-next" size={25} color="#4f4f4f"/>

                    </View>
                </TouchableOpacity>
                <View>
                <FlatList
                data={address}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.addressContainer}  onPress={() => {
                        dispatch(
                            setOrigin({
                                
                            location: {lat: item.lat, lng: item.lng},
                            description: item.address,
                            
                        }))
                        onClose()
                    }}>
                        <Text style={styles.addressText}>{item.address}</Text>
                    </TouchableOpacity>
                )}/>
            </View>
            </View>
            
            <View style={{ flex: 1,justifyContent:'flex-end'}}>
                {/* <TouchableOpacity style={styles.checkoutButton} onPress={onClose}>
                    <Text style={styles.checkoutButtonText}>Select Address</Text>
                </TouchableOpacity> */}

            </View>
        </View>
        </Modal>
    )

}


const styles = StyleSheet.create({
    container:{
        backgroundColor:'white',
        // padding:20
        },
    textInput: {
        color: 'black',
        backgroundColor:'#E5E4E2',
        placeholderTextColor: 'black',
        fontFamily:"Metropolis-Medium"
    },
    textInputContainer:{
        borderWidth:1,
        borderColor:'white',
        borderRadius:20,
        margin:10,
        

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
        textTransform:'uppercase'
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
        maxHeight:550
    },
    modalContentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        padding: 5
    },
    addressContainer: {
        borderBottomWidth: 1,
        borderBottomColor: "silver",
        paddingHorizontal: 10,
        paddingVertical:10
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
        textTransform:"uppercase",
        marginVertical:5,
        alignItems:"flex-end"
      },
})

export default SelectAddress
