import {
  View,
  Text,
  ScrollView,
  Button,
  StyleSheet,
  Pressable,
} from 'react-native'
import TextField from '../TextField'
import { useState } from 'react'
import { addDoc, collection, getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

export default CreateEventPage = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [starPoints, setStarPoints] = useState(5)

  const [titleError, setTitleError] = useState(null)
  const [descriptionError, setDescriptionError] = useState(null)
  const [starPointsError, setStarPointsError] = useState(null)

  const validate = () => {
    if (!title) setTitleError('required')
    if (!description) setDescriptionError('required')
    if (!starPoints) setStarPointsError('required')
    return !(!title || !description || !starPoints)
  }

  const create = async () => {
    if (validate()) {
      setIsLoading(true)
      const db = getFirestore()
      const docRef = await addDoc(collection(db, 'events'), {
        title: title,
        description: description,
        starPoints: starPoints,
        organizationId: getAuth().currentUser.uid,
      })
      navigation.replace('EventDetails', { eventId: docRef.id })
    }
  }

  if (isLoading)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    )

  return (
    <View style={styles.body}>
      <ScrollView>
        <Text style={styles.title}>Create Event</Text>
        <TextField
          label="Title"
          onChange={(val) => setTitle(val)}
          errorText={titleError}
        />
        <TextField
          label="Description"
          onChange={(val) => setDescription(val)}
          errorText={descriptionError}
        />
        <TextField
          label="Star points"
          onChange={(val) => setStarPoints(val)}
          defaultValue={starPoints.toString()}
          errorText={starPointsError}
        />
        <View style={styles.buttonParent}>
          <Pressable style={styles.button} title="Create" onPress={create}>
            <Text style={styles.buttonText}>Create</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 16,
    marginTop: 36,
  },
  title: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 30,
    fontWeight: 'bold',
    marginLeft: 20,
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
  buttonParent: {
    borderRadius: 15,
    overflow: 'hidden',
  },

})
