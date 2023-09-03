import React, { useState } from 'react'
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useDispatch } from 'react-redux'
import { setDestiation, setOrigin } from '../features/navSlice';
import Modal from "react-native-modal";


const EnterManualAddress = ({ isVisible, onClose, navigation }) => {
    const dispatch = useDispatch();


    const GOOGLE_MAPS_APIKEY = 'AIzaSyAZOYcbktSK5cB_hNu91XWV15jAB9JlzIA'
    return (
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
            <View style={{height:"80%"}}>
                <GooglePlacesAutocomplete
                
                    placeholder='Search for area, street name'
                    textInputProps={{
                        placeholderTextColor: 'gray',
                        returnKeyType: "search",
                        multiline:true,
                        numberOfLines:4,
                        color:"black",
                        fontFamily:"Metropolis-Medium",
                        height:75,
                        borderWidth:0.5,
                        borderRadius:20,
                        borderColor:"#9f9f9f",
                        padding:5
                      }}
                    minLength={2}
                    listViewDisplayed="auto"
                    returnKeyType={'search'}
                    fetchDetails={true}
                    enablePoweredByContainer={false}
                    onPress={(data, details = null) => {
                        dispatch(
                            setOrigin({
                                
                            location: details.geometry.location,
                            description: data.description,
                            
                        }))
                    }}
                    query={{
                        key: 'AIzaSyAZOYcbktSK5cB_hNu91XWV15jAB9JlzIA',
                        language: 'en',
                    }}
                    nearbyPlacesAPI='GooglePlacesSearch'
                    // debounce={400}
                    renderRow={(rowData) => {
                        const title = rowData.structured_formatting.main_text;
                        const address = rowData.structured_formatting.secondary_text;
                        return (
                            <View style={{paddingVertical:2}}>
                                <Text style={{ fontSize: 14, color: 'black',alignItems:"center",fontFamily:"Metropolis-Medium" }}>{title}</Text>
                                <Text style={{ fontSize: 14, color: 'black',fontFamily:"Metropolis-Thin" }}>{address}</Text>
                            </View>
                        );
                    }}
                    >
                </GooglePlacesAutocomplete>
            </View>
            <View style={{ flex: 1,justifyContent:'flex-end'}}>
                <TouchableOpacity style={styles.checkoutButton} onPress={onClose}>
                    <Text style={styles.checkoutButtonText}>Select Address</Text>
                </TouchableOpacity>

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
})

export default EnterManualAddress