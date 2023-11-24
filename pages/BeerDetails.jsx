import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, Text, TextInput, FlatList, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import RIcon from 'react-native-vector-icons/MaterialIcons'
import StarRating from 'react-native-star-rating';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import { selectAuthToken, selectUserId } from '../features/userSlice';
import AddModal from '../components/AddModal';
import { Cart } from '../components/Cart';
import Food from '../components/Food';

const BeerDetails = ({ navigation, route }) => {
  const id = route.params.id;
  const [beer, setBeer] = useState(null);
  const [userReview, setUserReview] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewsVisibility, setReviewsVisibility] = useState(false)
  const [iconName, setIconName] = useState("chevron-down")
  const authToken = useSelector(selectAuthToken);
  const userId = useSelector(selectUserId)
  const [isAddModalVisible, setAddModalVisible] = useState(false);

  const submitReviewAndRating = async () => {
    setReviewModalVisible(false);
    const requestBody = {
      "ratingValue": userRating,
      "review": userReview
    };
    try {
      const response = await fetch(`https://2ab7-103-130-108-22.ngrok-free.app/beerratings/${id}/${userId.userId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken.authToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      // console.log('Data:', data);

    } catch (error) {
      console.error('Error sending checkout request:', error);
    }
  };
  console.log("BEER RATINGS IS CALLED")

  const toggleReviewsVisibility = () => {
    setReviewsVisibility(!reviewsVisibility);
    setIconName(reviewsVisibility ? "chevron-down" : "chevron-up");
  };

  useEffect(() => {
    if (authToken.authToken) {
      fetch(`http://54.89.234.175:8080/beers/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken.authToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => {
          setBeer(data);
        })
        .catch(error => {
          console.error('Error fetching beer details:', error);
        });
    }
  }, [authToken.authToken, id, reviewModalVisible]);

  return (
    <View style={styles.container}>
      {beer && (
        <View style={styles.contentContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" color="black" size={30} />
          </TouchableOpacity>

          <View style={styles.imageContainer}>
            <Image source={{ uri: beer.image_url }} style={styles.image} />
          </View>
          <ScrollView>
            <View style={styles.nameContainer}>
              <Text style={styles.beerName}>{beer.name}</Text>
              <View style={styles.standardContainer}>
                <RIcon name="currency-rupee" color="#2f2f2f" size={20} />
                <Text style={styles.price}>{beer.pricings[0].price} -</Text>
                <RIcon name="currency-rupee" color="#2f2f2f" size={20} />
                <Text style={styles.price}>{beer.pricings[3].price}</Text>
              </View>
            </View>

            <View style={styles.standardContainer}>
              <Text style={styles.attributes}>ABV{"(%)"}: {beer.abv}</Text>
              <Text style={styles.attributes}>|</Text>
              <Text style={styles.attributes}>IBU: {beer.ibu}</Text>
            </View>

            <View style={styles.descriptionContainer}>
              <Text style={styles.heading}>Ingredients used</Text>
              <Text style={styles.descriptionText}>{beer.ingredient_name}</Text>
            </View>
            <View style={styles.descriptionContainer}>
              <Text style={styles.heading}>Description</Text>
              <Text style={styles.descriptionText}>{beer.description}</Text>
            </View>
            <View style={styles.descriptionContainer}>
              <Text style={styles.heading}>Brewer's Tips</Text>
              <Text style={styles.descriptionText}>{beer.brewers_tips}</Text>
            </View>

            <View style={[styles.descriptionContainer, styles.showReviewsContainer]}>
              <TouchableOpacity activeOpacity={.7} onPress={toggleReviewsVisibility} style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.heading} >Reviews & Ratings</Text>
                <Icon name={iconName} color="black" size={25} />
              </TouchableOpacity>


              {reviewsVisibility && beer.ratings && (
                <FlatList
                  data={beer.ratings}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.reviewContainer}>
                      {/* <UIcon name="user-circle"
                    color="#5f5f5f"
                    size={35}/> */}
                      <View style={{ marginHorizontal: 5 }}>
                        <Text style={{ fontSize: 15, color: "black", fontFamily: "Metropolis-SemiBold" }}>{item.user.firstName}</Text>
                        <StarRating
                          disabled
                          maxStars={5}
                          rating={item.rating}
                          fullStarColor="#FFD700"
                          emptyStarColor="#CCCCCC"
                          halfStarColor="#FFD700"
                          starSize={15}
                        />
                        <Text style={styles.reviewText}>{item.review}</Text>

                      </View>
                    </View>
                  )}
                />
              )}



            </View>
            <Food navigation={navigation} />
          </ScrollView>
          <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
            <TouchableOpacity style={styles.reviewButton} onPress={() => setReviewModalVisible(true)}>
              <Text style={styles.reviewButtonText}>Write a Review</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reviewButton} onPress={() => setAddModalVisible(true)}>
              <Text style={styles.reviewButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <Modal
        onBackdropPress={() => setReviewModalVisible(false)}
        onBackButtonPress={() => setReviewModalVisible(false)}
        isVisible={reviewModalVisible}
        style={styles.modal}>
        <View style={styles.modalContent}>
          <View style={styles.userReviewContainer}>

            <Text style={styles.price}>Write a Review</Text>
            <View style={{ maxHeight: "80%", minHeight: "20%", marginVertical: 10 }}>
              <TextInput numberOfLines={4}
                multiline={true}
                style={styles.userReviewInput}
                placeholder="Write your review here..."
                placeholderTextColor="#5f5f5f"
                onChangeText={(text) => setUserReview(text)}
                value={userReview}
              />

            </View>
            <View style={{ marginTop: 10 }}>
              <StarRating
                disabled={false}
                maxStars={5}
                rating={userRating}
                fullStarColor="#FFD700"
                emptyStarColor="#CCCCCC"
                halfStarColor="#FFD700"
                halfStarEnabled={true}
                selectedStar={(rating) => setUserRating(rating)}
              />
              <TouchableOpacity
                style={styles.submitButton}
                onPress={submitReviewAndRating}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <AddModal
        isVisible={isAddModalVisible}
        selectedBeer={beer}
        navigation={navigation}
        onClose={() => setAddModalVisible(false)}
      />
      <Cart navigation={navigation} />
    </View>
  );
};



export default BeerDetails

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  price: {
    color: "black",
    fontFamily: "Metropolis-SemiBold",
    fontSize: 15,
  },
  attributes: {
    color: "#6F6F6F",
    fontFamily: "Metropolis-Medium",
    marginLeft: 15,
    marginVertical: 5
  },
  contentContainer: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    zIndex: 1,
    padding: 15,
  },
  imageContainer: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '35%',
    paddingVertical: 25,
  },
  image: {
    width: '50%',
    height: '100%',
    resizeMode: 'contain',
  },
  nameContainer: {
    marginHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 'auto',
    alignItems: 'center',
  },
  beerName: {
    color: 'black',
    fontFamily: 'Metropolis-Bold',
    fontSize: 25,
  },
  standardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  descriptionContainer: {
    marginHorizontal: 15,
    marginTop: 10,
  },
  heading: {
    color: 'black',
    fontFamily: 'Metropolis-Medium',
    fontSize: 15,
    marginBottom: 5,
    textTransform: "uppercase"
  },
  descriptionText: {
    color: '#5f5f5f',
    fontFamily: 'Metropolis-Thin',
    lineHeight: 15,
    fontSize: 13,
  },
  reviewContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 5,
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  reviewText: {
    marginTop: 5,
    fontFamily: 'Metropolis-Medium',
    color: "black"
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    paddingTop: 12,
    paddingHorizontal: 12,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    minHeight: 350,
    paddingBottom: 0,
    marginBottom: 0
  },
  userReviewContainer: {
    marginHorizontal: 15,
    marginTop: 20,
  },
  reviewButton: {
    // backgroundColor: '#ffff',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ED5A6B',
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 55,
    // paddingHorizontal:10,
    width: "40%"
  },
  reviewButtonText: {
    color: '#ED5A6B',
    fontFamily: 'Metropolis-SemiBold',
    textTransform: 'uppercase'
  },
  submitButton: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ED5A6B"
  },
  submitButtonText: {
    color: '#ED5A6B',
    fontFamily: 'Metropolis-SemiBold',
  },
  userReviewInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10, // Remove the fixed padding
    flex: 1, // Allow the TextInput to expand
    color: "black",
    fontFamily: "Metropolis-Medium",
    flexWrap: "wrap",
    textAlignVertical: "top", // Start the content from the top
  },
  showReviewsContainer: {
    marginTop: 15
  }

})