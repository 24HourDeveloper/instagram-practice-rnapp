import React, { Component } from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";

export default class Profile extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View>
          <View
            style={{
              height: 70,
              paddingTop: 20,
              justifyContent: "center",
              alignItems: "center",
              borderColor: "#000",
              borderBottomWidth: 1,
              elevate: 1
            }}
          >
            <Text style={{ fontSize: 20 }}>Profile</Text>
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
              uri:
                "https://yt3.ggpht.com/a-/AAuE7mDGQh9L3n_EULfeZEO9rs_JR4BY376CSrlxdw=s900-mo-c-c0xffffffff-rj-k-no"
            }}
            style={{
              marginLeft: 10,
              width: 100,
              height: 100,
              borderRadius: 50
            }}
          />
          <View style={{ marginRight: 10 }}>
            <Text>Name</Text>
            <Text>Username</Text>
          </View>
        </View>
        <View style={{ paddingBottom: 20, borderBottomWidth: 1 }}>
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
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Loading photos...</Text>
        </View>
      </View>
    );
  }
}
