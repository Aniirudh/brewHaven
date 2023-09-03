import React, { useEffect } from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import * as Animatable from 'react-native-animatable'
import * as Progress from 'react-native-progress'
import RazorpayCheckout from 'react-native-razorpay';

const PlacingOrder = ({ navigation }) => {
  // Make sure the path to your GIF is correct
  const gifSource = require("../assets/beer100.gif")

  useEffect(() => {
    setTimeout(() => {
      console.log("in loading")
      navigation.replace('Map')
    }, 1000)
  }, [])

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#EA6348' }}>

      {/* Use Animatable.View to apply animations */}
      <View style={{ justifyContent: 'space-between' }}>
        <View>
          <Animatable.Image
            source={gifSource}
            animation="slideInUp" // Apply the appropriate animation
            iterationCount={1}
            style={{ width: '100%', height: 300, resizeMode: 'contain' }} // Adjust dimensions as needed
          /></View>

        <Animatable.Text
          animation="slideInUp"
          iterationCount={1}
          style={styles.waitText}>Waiting for Restaurant to accept your order !</Animatable.Text>
        <Animatable.View animation="slideInUp"
          iterationCount={1}>
          <ActivityIndicator animation="slideInUp" size="large" color="white" style={{ marginTop: 15 }} />
        </Animatable.View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  waitText: {
    fontFamily: 'Metropolis-Bold',
    color: 'white',
    fontSize: 15
  }
})

export default PlacingOrder
