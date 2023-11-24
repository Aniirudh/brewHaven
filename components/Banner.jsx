import React, { useRef, useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet, FlatList } from 'react-native'
import banner1 from '../assets/bannerImages/banner1.jpg'
import banner2 from '../assets/bannerImages/banner2.jpg'
import banner3 from '../assets/bannerImages/banner3.jpg'

const Banner = () => {

  const data = [
    {
      title: "item 1",
      imgUrl: banner2,
    },
    {
      title: "item 2",
      imgUrl: banner3,
    },
    {
      title: "item 3",
      imgUrl: banner1,
    },
  ];

  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToNextIndex = () => {
    if (flatListRef.current) {
      const nextIndex = (currentIndex + 1) % data.length;
      setCurrentIndex(nextIndex);
      flatListRef.current.scrollToIndex({
        animated: true,
        index: nextIndex,
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(scrollToNextIndex, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [currentIndex]);




  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image style={styles.image} source={item.imgUrl} />
    </View>
  )

  return (
    <View style={{
      backgroundColor: 'white',
    }}>
       <FlatList
        ref={flatListRef}
        horizontal
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.title}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToInterval={360} // Adjust this value based on your card width
        snapToAlignment="center"
        decelerationRate="fast"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    width: 360,
    height: 200,
    borderRadius: 20,
    marginRight: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
})

export default Banner
