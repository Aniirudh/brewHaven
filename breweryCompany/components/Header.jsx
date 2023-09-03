import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput,onPress } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import UIcon from 'react-native-vector-icons/FontAwesome'
import user from '../assets/user.png'
import Banner from './Banner'
import Cards from './Cards'
import Location from './Location'
import { useDispatch, useSelector } from 'react-redux';
import { selectOrigin, selectOriginalLocation,setOrigin } from '../features/navSlice'

const Header = ({navigation}) => {

    const location=useSelector(selectOriginalLocation)
    const dispatch=useDispatch()
    dispatch(setOrigin({
        location: { "lat": (location.location.lat), "lng": (location.location.lng)},
        description: location.description
    }))
    return (
        <View style={{backgroundColor:"#F4F2F2"}}>
            <View style={styles.navbar}>
                <View style={styles.location}>
                    <Icon name="location-on" size={45} color='#ED5A6B'></Icon>
                    <Text numberOfLines={1} style={styles.locationName}>{location.description}</Text>
                    {/* <Location/> */}
                </View>
                <TouchableOpacity onPress={()=>navigation.navigate('Profile')}>
                    <UIcon name="user-circle-o" color='#8f8f8f' size={35} style={styles.profileImage}/>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={[styles.searchbar, styles.shadowProp]} onPress={()=>navigation.navigate('Search')}>
                <Icon name="search" size={30} color='#ED5A6B'/>
                <Text style={{color:"#6f6f6f",fontFamily:"Metropolis-Medium",marginHorizontal:12,fontSize:16}}>Search...</Text>
            </TouchableOpacity>
            {/* <View style={{marginLeft:10}}>
            <Banner/>
            
            </View> */}
        </View>
    )
}

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    location: {
        marginHorizontal: 5,
        flexDirection: 'row',
        alignItems: 'center',
        width:"80%"
    },
    locationName: {
        fontSize: 15,
        color: 'black',
        fontFamily:"Metropolis-Medium",       

    },
    profileImage: {       
        marginRight: 10,
        
    },
    searchbar:{
        backgroundColor:'white',
        margin:10,
        borderRadius:10,
        padding:7,
        marginTop:10,
        flexDirection:"row",
        alignItems:"center"
    },
    shadowProp: {
        elevation: 5,
    shadowColor: '#171717',
      },
})

export default Header
