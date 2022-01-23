// components/welcome.js

import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Alert } from 'react-native';

export default class Welcome extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.logo}>Starpoint App</Text>
          <Text style={styles.welcome}>Welcome!</Text>

          <Text style={styles.start}>Let's get started.</Text>
          <Text style={styles.iama}>I am a:</Text>

          <View style={styles.buttonParent}>
            <Pressable
              style={styles.button}
              onPress={() => this.props.navigation.navigate('Student')}
              android_ripple={{color: 'gray'}}
              >
              <Text style={styles.buttonText}>Student</Text>
            </Pressable>  
          </View>

          <View style={styles.buttonParent}>
            <Pressable
              style={styles.button}
              onPress={() => this.props.navigation.navigate('Organization')}
              android_ripple={{color: 'gray'}}
              >
              <Text style={styles.buttonText}>Organization</Text>
            </Pressable>  
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: 35,
    backgroundColor: "#00938f",
  },

  content: {
    marginTop: 50,
  },

  logo: {
    fontSize: 20,
    textAlign: 'center',
    color: "#fff"
  },

  welcome: {
    marginTop: 30,
    fontSize: 46,
    fontWeight: 'bold',
    color: "#fff"
  },

  start: {
    fontSize: 20,
    color: "#fff"
  },

  iama: {
    marginTop: 40,
    fontSize: 20,
    color: "#fff"
  },

  buttonParent: {
    marginVertical: 15,
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
});