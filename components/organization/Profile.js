import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button } from 'react-native'
import { Avatar } from 'react-native-elements'

import { connect } from 'react-redux'
import Firebase from '../../database/firebase'

function Profile(props) {
  const [userPosts, setUserPosts] = useState([])
  const [user, setUser] = useState(null)
  const [following, setFollowing] = useState(false)

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

  const onLogout = ()=>{
    Firebase.auth().signOut();
  }

  if (user === null) {
    return <View></View>
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
        <Text>{user.name}</Text>
        <Text>{user.email}</Text>

        {props.route.params.uid !== Firebase.auth().currentUser.uid ? (
          <View>
            {following ? (
              <Button title="Following" onPress={() => onUnfollow()} />
            ) : (
              <Button title="Follow" onPress={() => onFollow()} />
            )}
          </View>
        ) : (
          <Button title="Logout" onPress={() => onLogout()} />
        )}
      </View>

      <View style={styles.containerGallery}>
        <FlatList
          horizontal={false}
          data={userPosts}
          renderItem={({ item }) => (
            <View style={styles.containerImage}>
              <View style={styles.postHeader}>
                <Avatar
                  size={60}
                  rounded
                  title="P"
                  containerStyle={{ backgroundColor: 'coral', margin: 10 }}
                />
                <Text>{user.name}</Text>
                <Text>{convertDate(item.creation.toDate())}</Text>
                <Text>{item.content}</Text>
              </View>
              <Image style={styles.image} source={{ uri: item.downloadURL }} />
            </View>
          )}
        />
      </View>
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
  containerGallery: {
    flex: 1,
  },
  containerImage: {
    flex: 1 / 3,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },
  postHeader: {
    margin: 10,
    flexDirection: 'row',
  },
})

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
  following: store.userState.following,
})

export default connect(mapStateToProps, null)(Profile)
