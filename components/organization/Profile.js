import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList } from 'react-native'

import { connect } from 'react-redux'
import Firebase from '../../database/firebase'

function Profile(props) {
  const [userPosts, setUserPosts] = useState([])
  const [user, setUser] = useState(null)

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
        .collection('feed')
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
  }, [props.route.params.uid])

  if (user === null) {
    return <View></View>
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
        <Text>{user.name}</Text>
        <Text>{user.email}</Text>
      </View>

      <View style={styles.containerGallery}>
        <FlatList
          horizontal={false}
          data={userPosts}
          renderItem={({ item }) => (
            <View style={styles.containerImage}>
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
})

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
})

export default connect(mapStateToProps, null)(Profile)
