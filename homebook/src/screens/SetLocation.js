import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Navigation } from 'react-native-navigation';
import MapView from 'react-native-maps';
import * as firebase from 'firebase';

class SetLocation extends Component {
    state = {
        focusedLocation: {
          latitude: 37.7900352,
          longitude: -122.4013726,
          latitudeDelta: 0.0122,
          longitudeDelta:
            Dimensions.get("window").width /
            Dimensions.get("window").height *
            0.0122
        },
        locationChosen: false,
        docId: '',
      };

      pickLocationHandler = event => {
        const coords = event.nativeEvent.coordinate;
        this.map.animateToRegion({
          ...this.state.focusedLocation,
          latitude: coords.latitude,
          longitude: coords.longitude
        });
        this.setState(prevState => {
          return {
            focusedLocation: {
              ...prevState.focusedLocation,
              latitude: coords.latitude,
              longitude: coords.longitude
            },
            locationChosen: true
          };
        });
      };

      getLocationHandler = () => {
        navigator.geolocation.getCurrentPosition(pos => {
          const coordsEvent = {
            nativeEvent: {
              coordinate: {
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude
              }
            }
          };
          this.pickLocationHandler(coordsEvent);
        },
      err => {
        console.log(err);
        alert("Fetching the Position failed, please pick one manually!");
      })
      }

    pushHomeScreen = () => Navigation.push(this.props.componentId, {
        component: {
          name: 'HomeScreen'
        }
    });

    SetLocationAndPush = () => {
      var db = firebase.firestore();
      
      db.collection("users").doc(this.state.docId).set({
        latitude: this.state.focusedLocation.latitude,
        longitude: this.state.focusedLocation.longitude,
      },{merge: true})
      .then(() => {
        console.log("Document successfully updated!");
      }).then(() => {
        this.pushHomeScreen()
      })
      .catch((error) => {
        // The document probably doesn't exist.
        alert("Error updating document: "  + error);
      });
    
    };
    
    componentDidMount() {
      var db = firebase.firestore();
  
      db.collection("users").where("uid", "==", firebase.auth().currentUser.uid).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          //alert(doc.data().email);
          //alert(doc.id, " => ", doc.data());
          //alert(doc)
  
          this.setState({
            docId: doc.id,
          });
        });
  
      }).catch(function (error) {
        alert("Error getting documents: " + error);
      });
  
    }

    render() {
        let marker = null;

        if (this.state.locationChosen) {
            marker = <MapView.Marker coordinate={this.state.focusedLocation} />
        }

        return (
                <View style={styles.container}>
                    <Text style={styles.mainText}>Set Location</Text>
                    <Text style={styles.subText}>Adjust pin to correct location</Text>
                    <MapView
                    initialRegion={this.state.focusedLocation}
                    region={this.state.focusedLocation}
                    style={styles.map}
                    showsUserLocation = {true}
                    onPress={this.pickLocationHandler}
                    ref={ref => this.map = ref}
                    >
                        {marker}
                    </MapView>
                    <TouchableOpacity
                        style={styles.locateButton}
                        onPress={this.getLocationHandler}
                    >
                        <Text style={{ color: 'black', fontWeight: '500' }}>LOCATE ME!</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.confirmButton}
                        
                        onPress={this.SetLocationAndPush}
                    >
                        <Text style={{ color: '#222222', fontWeight: '500' }}>CONFIRM COORDINATES</Text>
                    </TouchableOpacity>
                </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#222222'
    },
    mainText: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
        width: 300,
        textAlign: 'center',
        marginTop: 94
      },
      subText: {
        color: 'white',
        fontSize: 17,
        marginTop: 50,
        width: 300,
        textAlign: 'center'
      },
      map: {
          width: '100%',
          height: 400,
          marginTop: 20
      },
      locateButton: {
        width: 300,
        marginTop: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'yellow',
        height: 32
      },
      confirmButton: {
        width: 300,
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#70B456',
        height: 32,
        marginBottom: 100
      }
});

export default SetLocation;