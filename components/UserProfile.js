import React, { Component } from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import { f, database } from "../config/config";
export default class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      userId: ""
    };
    f.auth().onAuthStateChanged(user => {
      if (user) console.log("logged in");
    });

    console.log("constructor");

    this.checkParams = this.checkParams.bind(this);
    this.fetchUserInfo = this.fetchUserInfo.bind(this);
  }

  checkParams = () => {
    const params = this.props.navigation.state.params;
    console.log(params.userID);

    if (params) {
      if (params.userID) {
        this.setState({
          userId: params.userID
        });
        this.fetchUserInfo(params.userID);
      }
    }
  };

  fetchUserInfo = userId => {
    const self = this;

    database
      .ref("user")
      .child(userId)
      .child("username")
      .once("value")
      .then(function(snapshot) {
        const exist = snapshot.val() !== null;
        if (exist) data = snapshot.val();
        self.setState({
          username: data
        });
      })
      .catch(error => console.log(error));

    database
      .ref("user")
      .child(userId)
      .child("name")
      .once("value")
      .then(function(snapshot) {
        const exist = snapshot.val() !== null;
        if (exist) data = snapshot.val();
        self.setState({
          name: data
        });
      })
      .catch(error => console.log(error));

    database
      .ref("user")
      .child(userId)
      .child("avatar")
      .once("value")
      .then(function(snapshot) {
        const exist = snapshot.val() !== null;

        if (exist) data = snapshot.val();
        self.setState({
          avatar: data,
          loading: true
        });
      })
      .catch(error => console.log(error));
  };

  componentDidMount() {
    console.log("componentDidMount");
    this.checkParams();
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View>
          <View
            style={{
              flexDirection: "row",
              height: 70,
              paddingTop: 20,
              paddingHorizontal: 10,
              justifyContent: "space-between",
              alignItems: "center",
              borderColor: "#000",
              borderBottomWidth: 1,
              elevate: 1
            }}
          >
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Text style={{ width: 100 }}>Go Back</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 20, width: 100 }}>Profile</Text>
            <Text style={{ width: 100 }} />
          </View>
        </View>
        <View
          style={{
            justifyContent: "space-evenly",
            alignItems: "center",
            flexDirection: "row",
            paddingVertical: 10
          }}
        >
          <Image
            source={{
              uri: this.state.avatar
            }}
            style={{
              marginLeft: 10,
              width: 100,
              height: 100,
              borderRadius: 50
            }}
          />
          <View style={{ marginRight: 10 }}>
            <Text>{this.state.name}</Text>
            <Text>{this.state.username}</Text>
          </View>
        </View>
        {/* <View style={{ paddingBottom: 20, borderBottomWidth: 1 }}>
          <TouchableOpacity
            style={{
              marginTop: 10,
              marginHorizontal: 40,
              paddingVertical: 15,
              borderRadius: 20,
              borderColor: "#000",

              borderWidth: 1.5
            }}
          >
            <Text style={{ textAlign: "center" }}>Log Out</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              marginTop: 10,
              marginHorizontal: 40,
              paddingVertical: 15,
              borderRadius: 20,
              borderColor: "#000",

              borderWidth: 1.5
            }}
          >
            <Text style={{ textAlign: "center" }}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Upload")}
            style={{
              marginTop: 10,
              marginHorizontal: 40,
              paddingVertical: 15,
              borderRadius: 20,
              borderColor: "#000",
              backgroundColor: "#eee",
              borderWidth: 1.5
            }}
          >
            <Text style={{ textAlign: "center" }}>Upload New +</Text>
          </TouchableOpacity>
        </View> */}
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Loading photos...</Text>
        </View>
      </View>
    );
  }
}
