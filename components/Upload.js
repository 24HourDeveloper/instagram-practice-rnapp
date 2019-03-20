import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image
} from "react-native";
import { f, database, storage, auth } from "../config/config";
import { Permissions, ImagePicker } from "expo";

export default class Upload extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false,
      imageId: this.uniqueId(),
      imageSelected: false,
      uploading: false,
      caption: "",
      progress: 0
    };

    this.checkLogIn();

    this.logIn();
    //auth.signOut();
  }

  _checkPermissions = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ camera: status });

    const { statusRoll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({ cameraRoll: statusRoll });
  };
  s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };

  uniqueId = () => {
    return (
      this.s4() +
      this.s4() +
      "-" +
      this.s4() +
      "-" +
      this.s4() +
      "-" +
      this.s4() +
      "-" +
      this.s4() +
      "-" +
      this.s4() +
      "-" +
      this.s4()
    );
  };

  findNewImage = async () => {
    this._checkPermissions();

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "Images",
      allowsEditing: true,
      quality: 1
    });

    if (!result.cancelled) {
      console.log("upload image");

      this.setState({
        imageSelected: true,
        imageId: this.uniqueId(),
        uri: result.uri
      });
      //this.uploadImage(result.uri);
    } else {
      console.log("cancel");
      this.setState({
        imageSelected: false
      });
    }
  };

  // uploadImage = async uri => {
  //   console.log(uri);
  //   var that = this;
  //   var userId = f.auth().currentUser.uid;
  //   var imageId = this.state.imageId;

  //   var re = /(?:\.([^.]+))?$/;
  //   var ext = re.exec(uri)[1];
  //   this.setState({ currentFileType: ext });

  //   try {
  //     const response = await fetch(uri);
  //     const blob = await response.blob();

  //     var FilePath = imageId + "." + that.state.currentFileType;

  //     const ref = storage.ref("user/" + userId + "/img").child(FilePath);

  //     var snapshot = ref.put(blob).on("state_changed", snapshot => {
  //       console.log("Progress", snapshot.bytesTransferred, snapshot.totalBytes);
  //     });
  //   } catch (e) {
  //     console.log("error" + e);
  //   }
  // };

  uploadImage = async uri => {
    //
    var that = this;
    var userid = f.auth().currentUser.uid;
    var imageId = this.state.imageId;

    var re = /(?:\.([^.]+))?$/;
    var ext = re.exec(uri)[1];
    this.setState({
      currentFileType: ext,
      uploading: true
    });

    /*const response = await fetch(uri);
    const blob = await response.blob();*/
    var FilePath = imageId + "." + that.state.currentFileType;

    const oReq = new XMLHttpRequest();
    oReq.open("GET", uri, true);
    oReq.responseType = "blob";
    oReq.onload = () => {
      const blob = oReq.response;
      //Call function to complete upload with the new blob to handle the uploadTask.
      this.completeUploadBlob(blob, FilePath);
    };
    oReq.send();

    var uploadTask = storage
      .ref("user/" + userid + "/img")
      .child(FilePath)
      .put(blob);

    uploadTask.on(
      "state_changed",
      function(snapshot) {
        var progress = (
          (snapshot.bytesTransferred / snapshot.totalBytes) *
          100
        ).toFixed(0);
        console.log("Upload is " + progress + "% complete");
        that.setState({
          progress: progress
        });
      },
      function(error) {
        console.log("error with upload - " + error);
      },
      function() {
        //complete
        that.setState({ progress: 100 });
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          console.log(downloadURL);
          that.processUpload(downloadURL);
        });
      }
    );
  };

  uploadPublish = () => {
    if (this.state.caption !== "") {
      this.uploadImage(this.state.uri);
    } else {
      alert("Please enter a caption...");
    }
  };

  completeUploadBlob = (blob, FilePath) => {
    var that = this;
    var userid = f.auth().currentUser.uid;
    var imageId = this.state.imageId;

    var uploadTask = storage
      .ref("user/" + userid + "/img")
      .child(FilePath)
      .put(blob);

    uploadTask.on(
      "state_changed",
      function(snapshot) {
        var progress = (
          (snapshot.bytesTransferred / snapshot.totalBytes) *
          100
        ).toFixed(0);
        console.log("Upload is " + progress + "% complete");
        that.setState({
          progress: progress
        });
      },
      function(error) {
        console.log("error with upload - " + error);
      },
      function() {
        //complete
        that.setState({ progress: 100 });
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          console.log(downloadURL);
          that.processUpload(downloadURL);
        });
      }
    );
  };

  processUpload = imageUrl => {
    //Process here...

    //Set needed info
    var imageId = this.state.imageId;
    var userId = f.auth().currentUser.uid;
    var caption = this.state.caption;
    var dateTime = Date.now();
    var timestamp = Math.floor(dateTime / 1000);
    //Build photo object
    //author, caption, posted, url

    var photoObj = {
      author: userId,
      caption: caption,
      posted: timestamp,
      url: imageUrl
    };

    //Update database

    //Add to main feed
    database.ref("/photos/" + imageId).set(photoObj);

    //Set user photos object
    database.ref("/users/" + userId + "/photos/" + imageId).set(photoObj);

    alert("Image Uploaded!!");

    this.setState({
      uploading: false,
      imageSelected: false,
      caption: "",
      uri: ""
    });
  };

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
        {this.state.loggedIn ? (
          <View style={{ flex: 1 }}>
            {this.state.imageSelected == true ? (
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    height: 70,
                    paddingTop: 30,
                    backgroundColor: "#fff"
                  }}
                >
                  <Text>Upload</Text>
                </View>
                <View style={{ padding: 5 }}>
                  <Text style={{ marginTop: 5 }}>Caption:</Text>
                  <TextInput
                    style={{
                      marginVertical: 10,
                      height: 100,
                      padding: 5,
                      borderColor: "grey",
                      borderWidth: 1,
                      borderRadius: 3
                    }}
                    editable={true}
                    placeholder="Enter Caption"
                    maxLength={150}
                    multiline={true}
                    numberOfLines={4}
                    onChangeText={text => this.setState({ caption: text })}
                  />
                  <TouchableOpacity
                    onPress={() => this.uploadPublish()}
                    style={{
                      padding: 10,
                      backgroundColor: "blue",
                      borderRadius: 10
                    }}
                  >
                    <Text style={{ textAlign: "center", color: "#fff" }}>
                      Upload Publish
                    </Text>
                  </TouchableOpacity>
                  {this.state.uploading == true ? (
                    <View style={{ marginTop: 10 }}>
                      <Text>{this.state.progress}%</Text>
                      {this.state.progress !== 100 ? (
                        <ActivityIndicator size="small" color="blue" />
                      ) : (
                        <Text>Processing</Text>
                      )}
                    </View>
                  ) : (
                    <View>
                      <Text />
                    </View>
                  )}
                  <Image
                    source={{ uri: this.state.uri }}
                    style={{
                      marginTop: 10,
                      resizeMode: "cover",
                      width: "100%",
                      height: 275
                    }}
                  />
                </View>
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{ fontSize: 28, padding: 15, textAlign: "center" }}
                >
                  Upload
                </Text>
                <TouchableOpacity
                  onPress={() => this.findNewImage()}
                  style={{
                    padding: 10,
                    backgroundColor: "blue",
                    borderRadius: 10
                  }}
                >
                  <Text style={{ textAlign: "center", color: "#fff" }}>
                    Select Photo
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          <Text>Log in</Text>
        )}
      </View>
    );
  }
}
