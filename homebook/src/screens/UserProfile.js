import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import MapView from 'react-native-maps';
import * as firebase from 'firebase';

class UserProfile extends Component {
  state = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    docId: '',
  };

  pushCloseButton = () => Navigation.pop(this.props.componentId, {
    component: {
      name: 'AddUser'
    }
  });

  pushHomeScreen() {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'HomeScreen'
      }
    });
  }

  firstNameHandler = val => {
    this.setState({
      firstName: val,
    });
  };

  lastNameHandler = val => {
    this.setState({
      lastName: val,
    });
  };

  phoneNumberHandler = val => {
    this.setState({
      phone: val,
    });
  };

  emailHandler = val => {
    this.setState({
      email: val,
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

                firstname: doc.data().firstN,
                lastname: doc.data().lastN,
                docId: doc.id,
            });


        });


    }).catch(function (error) {
        alert("Error getting documents: " + error);
    });


  }




  confirmHandler = val => {


    const accountInfo = {
      firstN: this.state.firstName,
      lastN: this.state.lastName,
      phoneNum: this.state.phone,
      email: this.state.email,
    };
    var db = firebase.firestore();

    db.collection("users").add(accountInfo)
      .then((docRef) => {


        const friendsInfo = {
          firstN: this.state.firstName,
          lastN: this.state.lastName,
          phoneNum: this.state.phone,
          email: this.state.email,
          refpoint: docRef.id,
        };
        db.collection("users").doc(this.state.docId).collection("friends").add(friendsInfo)
          .then((docRef) => {
            //alert("Document written with ID: " + docRef.id);

          }).catch((error) => {
            //alert("error here")
           //alert("Error adding document: " + error);
          });

      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });


    this.pushHomeScreen()




  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.icons}>
          <TouchableOpacity
            style={styles.shareIcon}
            onPress={this.pushCloseButton}>
            <Icon size={35} name='ios-close' color='white' />
          </TouchableOpacity>
        </View>
        <Text style={styles.mainText}>{this.state.firstname} {this.state.lastname}</Text>
        <TextInput
          style={styles.textInputStyle}
          placeholder="Phone Number"
          placeholderTextColor="gray"
          onChangeText={this.phoneNumberHandler}
        />
        <TextInput
          style={styles.textInputStyle}
          placeholder="Email"
          placeholderTextColor="gray"
          onChangeText={this.emailHandler}
        />
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={this.confirmHandler}
        >
          <Text style={{ color: 'white', fontWeight: '500' }}>ADD CONTACT</Text>
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
    backgroundColor: '#222222',
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 55
  },
  shareIcon: {
    position: 'relative',
    right: 120
  },
  addIcon: {
    position: 'relative',
    left: 120
  },
  mainText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    width: 300,
    textAlign: 'center'
  },
  textInputStyle: {
    width: 300,
    marginTop: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    fontSize: 17,
    height: 32,
    color: 'white'
  },
  confirmButton: {
    width: 300,
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A90E2',
    height: 32
  }
});

export default UserProfile;