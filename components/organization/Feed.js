import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button } from 'react-native'
import { Avatar } from 'react-native-elements'

import { connect } from 'react-redux'
import Firebase from '../../database/firebase'

function Feed(props) {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    let posts = []
    if (props.usersLoaded == props.following.length) {
      for (let i = 0; i < props.following.length; i++) {
        const user = props.users.find((el) => el.uid === props.following[i])
        
        if (user != undefined) {
          posts = [...posts, user.posts]
          console.log(user.posts)
        }
      }

      posts.sort(function (x, y) {
        return x.creation - y.creation
      })

     

      setPosts(posts)
    }
  }, [props.usersLoaded])

  const convertDate = (date) => {
    // whatever formatting you want to do can be done here
    var d = date.toString()
    return d.substr(0, 21)
  }

  return (
    <View style={styles.containerGallery}>
      {/* <FlatList
        horizontal={false}
        data={posts}
        renderItem={({ item }) => (
          <View style={styles.containerImage}>
            <View style={styles.postHeader}>
              <Avatar
                size={60}
                rounded
                title="P"
                containerStyle={{ backgroundColor: 'coral', margin: 10 }}
              />
               <Text>{item.user.name}</Text> 
              <Text>{convertDate(item.creation.toDate())}</Text>
              <Text>{item.content}</Text>
            </View>
            <Image style={styles.image} source={{ uri: item.downloadURL }} />
          </View>
        )}
      /> */}
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
  users: store.usersState.users,
  usersLoaded: store.usersState.usersLoaded,
})

export default connect(mapStateToProps, null)(Feed)
