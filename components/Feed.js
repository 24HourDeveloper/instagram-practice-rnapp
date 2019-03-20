import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity
} from "react-native";
import { database, f, auth } from "../config/config";

export default class Feed extends React.Component {
  constructor() {
    super();
    this.state = {
      photo_feed: [],
      refresh: false,
      loading: true
    };
  }

  pluralCheck = s => {
    if (s == 1) {
      return " ago";
    } else {
      return "s ago";
    }
  };

  timeConverter = timeStamp => {
    const time = new Date(timeStamp * 1000);
    const seconds = Math.floor((new Date() - time) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
      return interval + " year" + this.pluralCheck(interval);
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " month" + this.pluralCheck(interval);
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " day" + this.pluralCheck(interval);
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " hour" + this.pluralCheck(interval);
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " minute" + this.pluralCheck(interval);
    }
    return interval + " seconds" + this.pluralCheck(interval);
  };

  componentDidMount() {
    this.loadFeed();
  }

  addToFlatList = (photo_feed, data, photo) => {
    var photoObj = data[photo];
    const self = this;
    database
      .ref("user")
      .child(photoObj.author)
      .child("username")
      .once("value")
      .then(function(snapshot) {
        const exist = snapshot.val() !== null;
        if (exist) data = snapshot.val();
        console.log("before photo feed push", photoObj);
        photo_feed.push({
          id: photo,
          url: photoObj.url,
          caption: photoObj.caption,
          posted: self.timeConverter(photoObj.posted),
          author: photoObj.author
        });

        self.setState({
          refresh: false,
          loading: false
        });
      })
      .catch(error => console.log(error));
  };

  loadFeed = () => {
    this.setState({
      refresh: true,
      photo_feed: []
    });

    var self = this;

    database
      .ref("photos")
      .orderByChild("posted")
      .once("value")
      .then(function(snapshot) {
        const exist = snapshot.val() !== null;
        if (exist) data = snapshot.val();

        var photo_feed = self.state.photo_feed;
        for (var photo in data) {
          self.addToFlatList(photo_feed, data, photo);
        }
      })
      .catch(error => console.log(error));
  };

  loadNew = () => {
    this.setState({
      refresh: true
    });
    this.setState({
      photo_feed: [],
      refresh: false
    });
  };

  render() {
    console.log(this.state.photo_feed);
    return (
      <View style={{ flex: 1 }}>
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
          <Text style={{ fontSize: 20 }}>Feed</Text>
        </View>

        {this.state.loading == true ? (
          <View>
            <Text>Loading...</Text>
          </View>
        ) : (
          <FlatList
            data={this.state.photo_feed}
            refreshing={this.state.refresh}
            onRefresh={this.loadNew}
            keyExtractor={(item, index) => index.toString()}
            style={{ flex: 1 }}
            renderItem={({ item, index }) => (
              <View
                key={index}
                style={{
                  width: "100%",
                  overflow: "hidden",
                  marginBottom: 5,
                  justifyContent: "space-between",
                  borderBottomWidth: 1,
                  borderColor: "#000"
                }}
              >
                <View
                  style={{
                    width: "100%",
                    justifyContent: "space-between",
                    flexDirection: "row",
                    padding: 5
                  }}
                >
                  <Text>{item.posted}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("User", {
                        userID: item.author
                      })
                    }
                  >
                    <Text>{item.author}</Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <Image
                    source={{
                      uri: item.url
                    }}
                    style={{ width: "100%", height: 275, resizeMode: "cover" }}
                  />
                </View>

                <View style={{ padding: 5 }}>
                  <Text>{item.caption}</Text>
                  <Text style={{ marginTop: 10, textAlign: "center" }}>
                    View comments....
                  </Text>
                </View>
              </View>
            )}
          />
        )}
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
