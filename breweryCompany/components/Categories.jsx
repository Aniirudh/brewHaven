import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import pale from '../assets/paleAle.png';
import lager from '../assets/lagerBeer.png';
import wheat from '../assets/wheatBeer.png';
import popular from '../assets/popular.png';
import food from '../assets/food.png'
import requests from '../utils/requests';

const categoryData = [
  { category: 'Pale_ale', image: pale, text: 'Pale Ale' },
  { category: 'Lager', image: lager, text: 'Lager' },
  { category: 'Wheat_Beer', image: wheat, text: 'Wheat Beer' },
  { category: 'Bock', image: popular, text: 'Bock' },
];

const Categories = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.category}
      onPress={() => navigation.navigate('CategorySpecific', { category: item.category })}
    >
      <Image source={item.image} style={styles.categoryImage} />
      <Text style={styles.categoryText}>{item.text}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ backgroundColor: 'white', paddingVertical:10 }}>
      <View style={styles.headingContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.line} />
          <View>
            <Text style={styles.heading}>What's on your mind?</Text>
          </View>
          <View style={styles.line} />
        </View>
      </View>
      <FlatList
        data={categoryData}
        renderItem={renderItem}
        keyExtractor={(item) => item.category}
        horizontal={true}
        contentContainerStyle={styles.categoryContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#9f9f9f',
  },
  heading: {
    textTransform: 'uppercase',
    width: 250,
    textAlign: 'center',
    fontFamily: 'Metropolis-Medium',
    color: '#8f8f8f',
    letterSpacing: 1,
    margin: 5,
  },
  headingContainer: {
    marginTop: 5,
  },
  categoryImage: {
    width: 60,
    height: 70,
    margin: 5,
    resizeMode: 'contain',
  },
  categoryText: {
    fontFamily: 'Metropolis-SemiBold',
    color: '#8f8f8f',
    fontSize: 12,
  },
  category: {
    alignItems: 'center',
    backgroundColor: '#F4F2F2',
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#F8F3F8',
    marginHorizontal: 5,
  },
  categoryContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
});

export default Categories;
