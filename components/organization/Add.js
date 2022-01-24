import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { FAB } from 'react-native-paper'
import Firebase from '../../database/firebase'
require('firebase/firestore')
import { serverTimestamp } from 'firebase/firestore'

export default function Add({ navigation, route }) {
  const [selectedValue, setSelectedValue] = useState('non-event')
  const [title, setTitle] = useState('')
  const [post, setPost] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const imagePath = `post/${
    Firebase.auth().currentUser.uid
  }/${Math.random().toString(36)}`

  const saveAllData = () => {
    if (title === '') {
      Alert.alert('Ooops!', 'title cannot be empty')
    } else {
      uploadImage()
    }
  }

  const uploadImage = async () => {
    const img = route.params?.photos

    //ONLY CAN SEND ONE IMAGE FOR NOW

    console.log(route.params?.photos)
    console.log(img[0].uri)
    if (img[0].uri != undefined) {
      const uri = img[0].uri
      const response = await fetch(uri)
      const blob = await response.blob()

      const task = Firebase.storage().ref().child(imagePath).put(blob)

      const taskProgress = (snapshot) => {
        console.log(`transferred: ${snapshot.bytesTransferred}`)
      }

      const taskCompleted = (snapshot) => {
        task.snapshot.ref.getDownloadURL().then((snapshot) => {
          savePostData(snapshot)
          console.log(snapshot)
        })
      }

      const taskError = (snapshot) => {
        console.log(snapshot)
      }

      task.on('state_changed', taskProgress, taskError, taskCompleted)
    } else {
      savePostData('')
    }
  }

  const savePostData = (downloadURL) => {
    setIsLoading(true)
    Firebase.firestore()
      .collection('posts')
      .add({
        downloadURL: downloadURL,
        title: title,
        content: post,
        status: 'non-event',
        creation: serverTimestamp(),
        uid: Firebase.auth().currentUser.uid,
      })
      .then(function () {
        setIsLoading(false)
        navigation.navigate('Main')
      })
  }

  return isLoading ? (
    <View>
      <ActivityIndicator size="large" color="#00938f" />
    </View>
  ) : (
    <View style={{ flex: 1 }}>
      <View style={styles.topContainer}>
        {/* <View style={styles.postCategory}>
          <Picker
            selectedValue={selectedValue}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedValue(itemValue)
            }
          >
            <Picker.Item label="Post" value="non-event" />
            <Picker.Item label="Event" value="event" />
          </Picker>
        </View> */}

        <Pressable
          style={styles.postButton}
          title="Save"
          onPress={() => saveAllData()}
        >
          <Text style={styles.textButton}>Save</Text>
        </Pressable>
      </View>
      <ScrollView>
        <TextInput
          style={styles.title}
          placeholder="Post Title..."
          onChangeText={(text) => setTitle(text)}
        />
        <View style={styles.contentContainer}>
          <TextInput
            style={styles.content}
            placeholder="Post Content..."
            multiline={true}
            onChangeText={(text) => setPost(text)}
          />
        </View>

        <Text style={styles.titleUpload}>Uploaded Photos</Text>

        {route.params?.photos == undefined ? (
          <Text style={{ marginLeft: 20 }}>No photo Uploaded yet</Text>
        ) : (
          <View style={styles.previewContainer}>
            {route.params?.photos.map((data) => {
              return (
                <View style={styles.previewContainer}>
                  <Image style={styles.preview} source={{ uri: data.uri }} />
                </View>
              )
            })}
          </View>
        )}
      </ScrollView>

      <FAB
        style={styles.fab}
        label="Upload"
        large
        icon="file-upload"
        onPress={() => {
          navigation.navigate('Upload')
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  topContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
  },
  postCategory: {
    paddingBottom: 20,
    height: 40,
    width: 105,
    marginTop: 8,
    borderColor: '#00938f',
    borderRadius: 4,
  },
  postButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    elevation: 3,
    margin: 15,
    backgroundColor: '#000',
  },
  textButton: {
    fontSize: 18,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  title: {
    margin: 25,
    fontSize: 30,
    fontWeight: 'bold',
  },

  content: {
    marginLeft: 22,
    fontSize: 20,
    padding: 5,
  },
  contentContainer: {
    height: 300,
  },

  titleUpload: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
    marginBottom: 10,
  },
  previewContainer: {
    flex: 1,

    margin: 10,
  },

  preview: {
    borderRadius: 30,
    width: '100%',
    aspectRatio: 1 / 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
  },
})
