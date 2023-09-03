import React,{useState,useEffect} from 'react'
import {View,Text,StyleSheet,TouchableOpacity,FlatList,Image} from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
import RIcon from 'react-native-vector-icons/MaterialIcons'
import Cards from '../components/Cards'
import { Cart } from '../components/Cart'
import {useSelector} from 'react-redux'
import { selectAuthToken } from '../features/userSlice'

const CategorySpecific = ({navigation,route}) => {

    const authToken = useSelector(selectAuthToken)
    const [beer, setBeer] = useState([]);
    const category= route.params.category
        console.log(category)
    useEffect(() => {
        if (authToken.authToken) {
            fetch(`https://10fe-103-130-108-23.ngrok-free.app/beers/categories/${category}`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${authToken.authToken}`,
                Accept: "application/json",
      "Content-Type": "application/json",
              },
            })
            .then(response => {
              return response.json();
            })
            .then(data => {
              setBeer(data);
            })
            .catch(error => {
              console.error("Error sending authentication request:", error);
            });
          }
        }, [authToken.authToken]);
    const renderItem = ({ item }) => (
        <Cards
            navigation={navigation}
            item={item}
            id={item.id}
            imageUrl={item.image_url}
            name={item.name}
            tagline={item.tagline}
            rating={item.averageRating}
            price="450"
            pricings={item.pricings}
        />
    );
    return (
        <View style={{flex:1}}>
        <View style={{flex:1}}>
            <View style={styles.headingContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.line} />
                <View>
                    <Text style={styles.heading}>{category}</Text>
                </View>
                <View style={styles.line} />
            </View>
            </View>
            <FlatList
                data={beer}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
            
        </View>
        <Cart navigation={navigation}/>
        </View>
    );
};

const styles = StyleSheet.create({
    line:{
        flex: 1, 
        height: 1, 
        backgroundColor: '#9f9f9f'
    },
    heading:{
        textTransform:'uppercase',
        width:250,
        textAlign:'center',
        fontFamily:'Metropolis-Medium',
        color:'#8f8f8f',
        letterSpacing:1,
        // margin:5
    },
    headingContainer:{
        marginTop:15,
        marginBottom:5
    },
    card: {
        height: 160,
        margin: 10,
        borderRadius: 10,
        backgroundColor: 'white',
        elevation: 5,
        padding: 8,
        justifyContent: 'center'

    },
    shadowProp: {
        elevation: 5,
        shadowColor: '#171717',
    },
    cardImage: {
        height: 130,
        width: '30%',
        resizeMode: 'contain'
    },
    content: {
        width: '70%'
    },
    title: {
        color: 'black',
        fontFamily: "Metropolis-Bold",
        fontSize: 15
    },
    tagline: {
        color: '#4f4f4f',
        fontFamily: "Metropolis-Light",
        marginTop: 5
    },
    rating: {
        marginTop: 0,
        flexDirection: 'row',
        alignItems: 'center'
    },
    ratingText: {
        color: '#18983E',
        margin: 3,
        fontFamily: 'Metropolis-SemiBold'
    },
    price:{
        color:'#2f2f2f',
        fontFamily: 'Metropolis-SemiBold'
    },
    pricing:{
        flexDirection:'row',
        alignItems:'center'
    },
    footer:{
        flexDirection:'row',
        alignItems:'center',
        marginTop:5,
        justifyContent:'space-between'
    },
    more:{
        color:'#9f9f9f',
        fontFamily:'Metropolis-Medium',
        
    },
    button:{
        backgroundColor:'#ED5A6B',
        paddingHorizontal:15,
        paddingVertical:5,
        borderRadius:5,
        marginRight:10
    },
    buttonText:{
        fontFamily:'Metropolis-SemiBold',
        color:'white',
        textTransform:'uppercase'
    }
});


export default CategorySpecific
