import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
} from 'react-native'
import { Avatar, Card } from 'react-native-elements'

import { connect } from 'react-redux'
import Firebase from '../database/firebase'
import User from '../User'

function Profile(props) {
  const [userPosts, setUserPosts] = useState([])
  const [user, setUser] = useState(null)
  const [following, setFollowing] = useState(false)
  const [attendedEvents, setAttendedEvents] = useState([])
  const [starPoints, setStarPoints] = useState(0)

  async function fetchAttendedEvents() {
    Firebase.firestore()
      .collection('history')
      .where('userId', '==', `${props.route.params.uid}`)
      .get()
      .then((snapshot) => {
        const result = snapshot.docs.map((e) => e.data())
        setAttendedEvents(result)
        let total = 0
        for (let i = 0; i < result.length; i++) {
          total += parseInt(result[i].starPoints)
        }
        setStarPoints(total)
      });
  }

  useEffect(() => {
    props.navigation.addListener('focus', async () => {
      fetchAttendedEvents();
    });
  }, []);

  useEffect(() => {
    const { currentUser, posts } = props
    console.log({ currentUser, posts })

    if (props.route.params.uid === Firebase.auth().currentUser.uid) {
      setUser(currentUser)
      setUserPosts(posts)
    } else {
      //COMING FROM SEARCH COMPONENT WHERE WE NEED TO REPLACE THE PROFILE WITH SEARCHED ID
      Firebase.firestore()
        .collection('users')
        .doc(props.route.params.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            // console.log(snapshot)
            setUser(snapshot.data())
          } else {
            console.log('does not exist')
          }
        })

      Firebase.firestore()
        .collection('posts')
        .where('uid', '==', `${props.route.params.uid}`)
        .orderBy('creation', 'asc')
        .get()
        .then((snapshot) => {
          let posts = snapshot.docs.map((doc) => {
            const data = doc.data()
            const id = doc.id
            return { id, ...data }
          })
          // console.log(posts)
          setUserPosts(posts)
        })
    }

    if (props.following.indexOf(props.route.params.uid) > -1) {
      setFollowing(true)
    } else {
      setFollowing(false)
    }
  }, [props.route.params.uid, props.following])

  const convertDate = (date) => {
    // whatever formatting you want to do can be done here
    var d = date.toString()
    return d.substr(0, 21)
  }

  const onFollow = () => {
    Firebase.firestore()
      .collection('following')
      .doc(Firebase.auth().currentUser.uid)
      .collection('userFollowing')
      .doc(props.route.params.uid)
      .set({})
  }

  const onUnfollow = () => {
    Firebase.firestore()
      .collection('following')
      .doc(Firebase.auth().currentUser.uid)
      .collection('userFollowing')
      .doc(props.route.params.uid)
      .delete()
  }

  const onLogout = () => {
    Firebase.auth().signOut()
  }

  if (user === null) {
    return <View></View>
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.containerInfo}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>

          <View style={styles.details}>
            <View style={styles.profilePhotoBox}>
              <Image
                style={styles.profilePhoto}
                source={{
                  uri:
                    'https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png',
                }}
              ></Image>
            </View>

            {User.role === 'student' ? (
              <>
                <View style={styles.event}>
                  <Text style={styles.eventNum}>{attendedEvents.length}</Text>
                  <Text>Events Attended</Text>
                </View>

                <View style={styles.event}>
                  <Text style={styles.eventNum}>{starPoints}</Text>
                  <Text>Starpoints Earned</Text>
                </View>
              </>
            ) : (
              <Text style={styles.email}>   Organization</Text>
            )}
          </View>

          <View style={styles.followOrLogout}>
            {props.route.params.uid !== Firebase.auth().currentUser.uid ? (
              <View style={styles.buttonParent}>
                {following ? (
                  <Pressable
                    style={styles.button}
                    onPress={() => onUnfollow()}
                    android_ripple={{ color: 'gray' }}
                  >
                    <Text style={styles.buttonText}>Unfollow</Text>
                  </Pressable>
                ) : (
                  <Pressable
                    style={styles.button}
                    onPress={() => onFollow()}
                    android_ripple={{ color: 'gray' }}
                  >
                    <Text style={styles.buttonText}>Follow</Text>
                  </Pressable>
                )}
              </View>
            ) : (
              <View style={styles.buttonParent}>
                <Pressable
                  style={styles.button}
                  onPress={() => onLogout()}
                  android_ripple={{ color: 'gray' }}
                >
                  <Text style={styles.buttonText}>Logout</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>

        <View style={styles.eventGallery}>
          {props.route.params.uid === Firebase.auth().currentUser.uid ?
            <Text style={styles.eventHeader}>Your Activity</Text>
            :
            <Text style={styles.eventHeader}>Activity</Text>
          }

          {userPosts.map((item) => {
            return (
              <Card
                containerStyle={{
                  borderRadius: 15,
                  elevation: 0,
                  backgroundColor: 'white',
                  borderColor: 'white',
                }}
              >
                <View style={styles.eventImage}>
                  <View style={styles.postHeader}>
                    <Avatar
                      size={60}
                      rounded
                      title={user.name.charAt(0)}
                      containerStyle={{ backgroundColor: 'coral', margin: 10 }}
                    />
                    <View style={styles.eventTitle}>
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: 'bold',
                          marginBottom: 5,
                        }}
                      >
                        {item.title}
                      </Text>
                      <Text>{convertDate(item.creation.toDate())}</Text>
                    </View>
                  </View>
                  <View style={styles.eventContent}>
                    <Text>{item.content}</Text>
                  </View>
                  <Image
                    style={styles.image}
                    source={{ uri: item.downloadURL }}
                  />
                </View>
              </Card>
            )
          })}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },

  containerInfo: {
    margin: 20,
  },

  name: {
    fontWeight: 'bold',
    fontSize: 46,
  },

  email: {
    marginTop: 5,
    color: '#808080',
    fontWeight: 'bold',
    fontSize: 20,
  },

  details: {
    marginVertical: 25,
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: 100,
    alignItems: 'center',
  },

  profilePhotoBox: {
    width: '30%',
  },

  profilePhoto: {
    borderRadius: 1000,
    flex: 1,
    resizeMode: 'contain',
    alignItems: 'center',
  },

  event: {
    width: '35%',
    paddingLeft: 10,
    paddingBottom: 25,
  },

  eventNum: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  followOrLogout: {
    marginVertical: 10,
  },

  buttonParent: {
    borderRadius: 15,
    overflow: 'hidden',
  },

  button: {
    padding: 15,
    justifyContent: 'center',
    backgroundColor: '#000',
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
  },

  eventGallery: {
    flex: 1,
    marginBottom: 20,
  },

  eventHeader: {
    fontSize: 30,
    fontWeight: 'bold',
    marginLeft: 20,
  },

  //FOR EACH POST CARD

  eventTitle: {
    margin: 14,
  },

  eventContent: {
    margin: 10,
  },

  eventImage: {
    flex: 1 / 3,
  },

  image: {
    flex: 1,
    aspectRatio: 1 / 1,
    borderRadius: 15,
  },

  postHeader: {
    flexDirection: 'row',
  },
})

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
  following: store.userState.following,
})

export default connect(mapStateToProps, null)(Profile)
