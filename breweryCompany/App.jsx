  import React,{useEffect,useState} from 'react'
  import {View,Text, StyleSheet} from 'react-native'
  import Login from './components/Login'
  import Register from './components/Register';
  import { NavigationContainer } from '@react-navigation/native';
  import { createNativeStackNavigator } from '@react-navigation/native-stack';
  import Home from './pages/Home';
  import CategorySpecific from './pages/CategorySpecific';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import { Provider } from 'react-redux';
  import store from './store';
  import ViewCart from './pages/ViewCart'
  import PlacingOrder from './pages/PlacingOrder';
  import Delivery from './pages/Delivery';
  import SelectAddress from './components/SelectAddress';
  import Map from './components/Map';
  import Profile from './pages/Profile';
  import EnterAddress from './pages/EnterAddress';
  import Search from './pages/Search';
  import HomeLoading from './pages/HomeLoading';
  import BeerDetails from './pages/BeerDetails';
  import OrderHistory from './pages/OrderHistory';
  import CurrentOrders from './pages/CurrentOrders';
  import { useDispatch, useSelector } from 'react-redux';
import { setAuthToken, setUserId } from './features/userSlice';

  const App = () => {

    const Stack = createNativeStackNavigator();
    // const dispatch=useDispatch()
    // const [initialRoute, setInitialRoute] = useState("Login");
    const [user, setUser] = useState(false);
    const [authenticationToken, setAuthToken] = useState(null);
    const [userIdentification,setUserId] = useState(null)
  //   const checkAuthToken = async () => {
  //     try {
  //       const authenticationToken = await AsyncStorage.getItem("authenticationToken");
  //       const userIdentification= await AsyncStorage.getItem("userIdentification");
  //       if (authenticationToken) {
  //         console.log("token in app",authenticationToken)
  //         setAuthToken(authenticationToken);
  //         setUserId(userIdentification)
  //         setUser(true)
  //       }
  //     } catch (error) {
  //       console.error("Error checking authentication token:", error);
  //     }
  //   };

  // useEffect(() => {
  //   checkAuthToken();
  // }, []);
  // useEffect(() => {
  //   const isAuthenticated = AsyncStorage.getItem("authToken");
  //   if (isAuthenticated) {
  //     console.log(isAuthenticated)
  //     setUser(true);
  //   }
  // }, []);

  // console.log(initialRoute)



    return (
      <Provider store={store}>
      <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown:false}}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="HomeLoading" component={HomeLoading}/>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Search" component={Search}/>
          <Stack.Screen name="CategorySpecific" component={CategorySpecific} />
          <Stack.Screen name="ViewCart" component={ViewCart}
          options={{presentation:'modal',headerShown:false}}
          />
          <Stack.Screen name="PlacingOrder" component={PlacingOrder}/>
          <Stack.Screen name="Delivery" component={Delivery}/>
          <Stack.Screen name="SelectAddress" component={SelectAddress}/>
          <Stack.Screen name="Map" component={Map}/>
          <Stack.Screen name="Profile" component={Profile}/>
          <Stack.Screen name="EnterAddress" component={EnterAddress}/>
          <Stack.Screen name="OrderHistory" component={OrderHistory}/>
          <Stack.Screen name="BeerDetails" component={BeerDetails}/>
          </Stack.Navigator>
      
      </NavigationContainer>
      </Provider>
    )
  }
  const styles=StyleSheet.create({
    container:{
      backgroundColor:'white',
    }
  })

  export default App
