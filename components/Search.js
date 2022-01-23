import React, { useState } from 'react'
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
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
      <TextInput
        style={styles.text}
        placeholder="Type Here..."
        onChangeText={(search) => fetchUsers(search)}
      />
      <FlatList 
        numColumns={1}
        horizontal={false}
        data={users}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate('Profile', { uid: item.id })
            }
          >
            <Text style={styles.result}>{item.name}</Text>
            <Divider/>
          </TouchableOpacity>
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

  text: {
    margin: 25,
    backgroundColor: 'lightgrey',
    borderRadius: 12,
    padding: 10,
    paddingLeft: 20,
  },

  result: {
    margin: 20,
  },
})
