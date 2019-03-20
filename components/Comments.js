import React, { Component } from "react";
import { Text, View } from "react-native";
import { f, database, storage, auth } from "../config/config";

export default class Upload extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false
    };

    this.checkLogIn();

    //this.logIn();
    auth.signOut();
  }
  checkLogIn = () => {
    const self = this;
    f.auth().onAuthStateChanged(user => {
      if (user) self.setState({ loggedIn: true });
      else self.setState({ loggedIn: false });
    });
  };

  logIn = (email, password) => {
    if (email !== "" && password !== "") {
      auth
        .signInWithEmailAndPassword("hellofakeemail@gmail.com", "fakepassword")
        .then(user => console.log(user))
        .catch(err => console.log(err));
    } else {
      alert("Enter something");
    }
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        {this.state.loggedIn ? <Text>Log out</Text> : <Text>Log in</Text>}
      </View>
    );
  }
}
