// components/signup.js

import React, { Component } from 'react'
import { StyleSheet, Text, View, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native'
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

          console.log('success')

          res.user.updateProfile({
            displayName: this.state.displayName,
          })

          console.log('User registered successfully!' + res)
          this.setState({
            isLoading: false,
            displayName: '',
            email: '',
            password: '',
            role: ''
          })
          //this.props.navigation.navigate('LoginStudent')
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
        <Text style={styles.inputHeader}>Sign up</Text>

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
        
        <View style={styles.buttonParent}>
          <Pressable
            style={styles.button}
            onPress={() => this.registerUser()}
            android_ripple={{color: 'gray'}}
            >
              <Text style={styles.buttonText}>Sign up</Text>
          </Pressable>    
        </View>

        <Text
          style={styles.loginText}
          onPress={() => this.props.navigation.navigate('LoginStudent')}
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

  inputHeader: {
    fontSize: 46,
    fontWeight: 'bold',
    marginBottom: 50,
    color: "#000"
  },

  inputStyle: {
    width: '100%',
    marginBottom: 25,
    paddingVertical: 15,
    paddingLeft: 15,
    alignSelf: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "#fff"
  },
  
  buttonParent: {
    marginTop: 25,
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden'
  },

  button: {
    padding: 15,
    justifyContent: "center",
    backgroundColor: "#000",
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold"
  },

  loginText: {
    color: "#000",
    marginTop: 25,
    textAlign: 'center',
    textDecorationLine: 'underline'
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
