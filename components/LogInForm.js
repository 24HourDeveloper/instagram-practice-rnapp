import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput
} from "react-native";
import { Facebook } from "expo";
import { f, database, storage, auth } from "../config/config";

export default class LogInForm extends React.Component {
  constructor() {
    super();

    this.state = {
      email: "",
      password: ""
    };

    //this.registerUser("hellofakeemail@gmail.com", "fakepassword");

    f.auth().onAuthStateChanged(user => {
      if (user) console.log("Logged in", user);
      else console.log("Logged out");
    });
  }
  // registerUser = (email, password) => {
  //   auth
  //     .createUserWithEmailAndPassword(email, password)
  //     .then(user => console.log(user))
  //     .catch(error => console.log(error));
  // };

  logIn = (email, password) => {
    if (email !== "" && password !== "") {
      auth
        .signInWithEmailAndPassword(email, password)
        .then(user => this.setState({ email: "", password: "" }))
        .catch(err => console.log(err));
    } else {
      alert("Enter something");
    }
  };

  signOut = () => {
    auth.signOut();
  };

  logInWithFB = async () => {
    const { token, type } = await Facebook.logInWithReadPermissionsAsync(
      "2205289836160074",
      {
        permissions: ["public_profile", "email"]
      }
    );

    if (type === "success") {
      const credentials = await f.auth.FacebookAuthProvider.credential(token);
      f.auth()
        .signInWithCredential(credentials)
        .catch(err => console.log(err));
    } else {
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          value={this.state.email}
          placeholder="Enter Email"
          onChangeText={text => this.setState({ email: text })}
        />
        <TextInput
          value={this.state.password}
          placeholder="Enter Password"
          onChangeText={text => this.setState({ password: text })}
        />
        <TouchableOpacity
          onPress={() => this.logIn(this.state.email, this.state.password)}
          style={{ padding: 10, backgroundColor: "blue", margin: 10 }}
        >
          <Text style={{ color: "#fff" }}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.logInWithFB()}
          style={{ padding: 10, backgroundColor: "blue", margin: 10 }}
        >
          <Text style={{ color: "#fff" }}>Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.signOut()}
          style={{ padding: 10, backgroundColor: "blue", margin: 10 }}
        >
          <Text style={{ color: "#fff" }}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
