import React, { useState } from 'react'
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
} from 'react-native'
import { Divider } from 'react-native-paper';
import Firebase from '../database/firebase'

export default function Search(props) {
  const [users, setUsers] = useState([])

  const fetchUsers = (search) => {
    Firebase.firestore()
      .collection('users')
      .where('name', '>=', search)
      .get()
      .then((snapshot) => {
        let users = snapshot.docs.map((doc) => {
          const data = doc.data()
          const id = doc.id
          return { id, ...data }
        })
        setUsers(users)
      })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search</Text>

      <TextInput
        style={styles.text}
        placeholder="Search events/organizations here..."
        onChangeText={(search) => fetchUsers(search)}
      />
      <FlatList 
        numColumns={1}
        horizontal={false}
        data={users}
        renderItem={({ item }) => (
          <View style={styles.buttonListParent}>
            <Pressable
              onPress={() => props.navigation.navigate('Profile', { uid: item.id })}
              style={styles.buttonList}
              android_ripple={{color: 'gray'}}
            >
              <Text style={styles.result}>{item.name}</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },

  title: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 30,
    fontWeight: 'bold',
    marginLeft: 25,
  },

  text: {
    marginHorizontal: 25,
    marginBottom: 25,
    backgroundColor: 'lightgrey',
    borderRadius: 12,
    padding: 10,
    paddingLeft: 20,
  },

  buttonListParent: {
    paddingHorizontal: 25,
  },

  buttonList: {
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, .15)'
  },

  result: {
    margin: 20,
  },
})
