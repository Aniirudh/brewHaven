// OrderSummary.js
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const OrderSummary = ({ cartItems, currentOrder }) => {
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      {item.food && (
        <>
          <Text style={{color:"black", fontFamily:"Metropolis-Medium"}}>{item.food.name}</Text>
          <Text style={{color:"black"}}> x {item.foodQuantity}</Text>
          <Text  style={{color:"black"}}> ₹{item.foodAmount}</Text>
        </>
      )}
      {item.beer && (
        <>
          <Text  style={{color:"black",fontFamily:"Metropolis-Medium"}}>{item.beer.name}</Text>
          <Text  style={{color:"black"}}> x {item.beerQuantity}</Text>
          <Text  style={{color:"black"}}> ₹{item.beerAmount}</Text>
        </>
      )}
      
    </View>
  );
console.log(currentOrder)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Summary</Text>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      {currentOrder?.modeOfDelivery==="DELIVERY" && 
      <View style={{flexDirection:"row",justifyContent:"center",marginBottom:10}}>
      <Text style={{color:"#5f5f5f", fontFamily:"Metropolis-Medium"}}>Delivery Fee: ₹ 150 </Text>
      </View>
      }
      
    <View style={{ borderTopWidth:1, borderTopColor:"silver", marginBottom:10, flexDirection:"row",justifyContent:"space-around"}}>
    <Text  style={{color:"black",fontFamily:"Metropolis-Bold", marginVertical:10}}>Grand Total:  ₹{currentOrder?.totalAmount}</Text>
    </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'white',
    marginHorizontal: 15,
  },
  title: {
    fontFamily: 'Metropolis-Bold',
    color: 'black',
    fontSize: 15,
    marginBottom: 10,
    justifyContent:"center",
    alignItems:"center"
  },
  itemContainer: {
    marginBottom: 10,
    flexDirection:"row",
    justifyContent:"space-around",
    width:"100%"
  },
});

export default OrderSummary;
