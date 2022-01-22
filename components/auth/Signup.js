// components/signup.js

import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
} from 'react-native'
import Firebase from '../../database/firebase'
import { RadioButton } from 'react-native-paper'

export default class Signup extends Component {
  constructor() {
    super()
    this.state = {
      displayName: '',
      email: '',
      password: '',
      role: 'student',
      isLoading: false,
    }
  }

  updateInputVal = (val, prop) => {
    const state = this.state
    state[prop] = val
    this.setState(state)
  }

  updateChecked = (val, prop) => {
    const state = this.state
    state[prop] = val
    this.setState(state)
  }

  registerUser = () => {
    if(this.state.email === '' && this.state.password === '') {
      Alert.alert('Enter details to sign up!')
    } else {
      this.setState({
        isLoading: true,
      })
      Firebase.auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((res) => {
          Firebase.firestore()
            .collection('users')
            .doc(Firebase.auth().currentUser.uid)
            .set({
              name: this.state.displayName,
              email: this.state.email,
              role: this.state.role
            })

          res.user.updateProfile({
            displayName: this.state.displayName,
          })

          console.log('User registered successfully!' + res)
          // this.setState({
          //   isLoading: false,
          //   displayName: '',
          //   email: '',
          //   password: '',
          //   role: ''
          // })
          // this.props.navigation.navigate('Login')
        })
        .catch((error) => this.setState({ errorMessage: error.message }))
    }
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E" />
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.inputStyle}
          placeholder="Name"
          value={this.state.displayName}
          onChangeText={(val) => this.updateInputVal(val, 'displayName')}
        />
        <TextInput
          style={styles.inputStyle}
          placeholder="Email"
          value={this.state.email}
          onChangeText={(val) => this.updateInputVal(val, 'email')}
        />
        <TextInput
          style={styles.inputStyle}
          placeholder="Password"
          value={this.state.password}
          onChangeText={(val) => this.updateInputVal(val, 'password')}
          maxLength={15}
          secureTextEntry={true}
        />
        <View style={styles.buttonContainer}>
          <RadioButton
            value="student"
            status={this.state.role === 'student' ? 'checked' : 'unchecked'}
            onPress={() => this.updateChecked('student', 'role')}
          />
          <Text>Student</Text>
        </View>
        <View style={styles.buttonContainer}>
          <RadioButton
            value="organization"
            status={
              this.state.role === 'organization' ? 'checked' : 'unchecked'
            }
            onPress={() => this.updateChecked('organization', 'role')}
          />
          <Text>Organization</Text>
        </View>

        <Button
          color="#3740FE"
          title="Sign up"
          onPress={() => this.registerUser()}
        />

        <Text
          style={styles.loginText}
          onPress={() => this.props.navigation.navigate('Login')}
        >
          Already Registered? Click here to login
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 35,
    backgroundColor: '#dddddd'
  },
  inputStyle: {
    width: '100%',
    marginBottom: 15,
    paddingBottom: 15,
    alignSelf: 'center',
    borderColor: '#ccc',
    borderBottomWidth: 1,
  },
  loginText: {
    color: '#3740FE',
    marginTop: 25,
    textAlign: 'center',
  },
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dddddd'
  }
});
