import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import MapView from 'react-native-maps';
import * as firebase from 'firebase';

import { connect } from 'react-redux';

class FriendProfile extends Component {
    state = {
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        docId: '',

        focusedLocation: {
            longitude: 0,
            latitude: 0,
            latitudeDelta: 0.0122,
            longitudeDelta:
                Dimensions.get("window").width /
                Dimensions.get("window").height *
                0.0122
        }
    };

    pushCloseButton = () => Navigation.pop(this.props.componentId, {
        component: {
            name: 'UserProfile'
        }
    });

    pushEditButton = () => Navigation.push(this.props.componentId, {
        component: {
            name: 'EditUser'
        }
    });

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


                    docId: doc.id,
                });


            });


        }).then(() => {
            db.collection("users").doc(this.state.docId).collection("friends").doc(this.props.refpoint).get()
                .then(doc => {

                    this.setState({
                        firstname: doc.data().firstN,
                        lastname: doc.data().lastN,
                        phone: doc.data().phoneNum,
                        email: doc.data().email,
                        docId: doc.id,
                        focusedLocation: {
                            ...this.state.focusedLocation,
                            longitude: doc.data().longitude,
                            latitude: doc.data().latitude,
                        },
                    })

                }).catch(function (error) {
                    alert("Error getting documents: " + error);
                });
        }).catch(function (error) {
            alert("Error getting documents: " + error);
        });
    }

    render() {
        marker = <MapView.Marker coordinate={this.state.focusedLocation} />
        return (
            <View style={styles.container}>
                <View style={styles.icons}>
                    <TouchableOpacity
                        style={styles.shareIcon}
                        onPress={this.pushCloseButton}>
                        <Icon size={35} name='ios-close' color='white' />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.edit}
                        onPress={this.pushEditButton}>
                        <Text style={{ color: 'white', fontSize: 16 }}>Edit</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.alignment}>
                    <ScrollView>
                        <Text style={styles.mainText}>{this.state.firstname} {this.state.lastname}</Text>
                        <Text style={styles.category}>Phone Number:</Text>
                        <Text style={styles.textInputStyle}>{this.state.phone}</Text>
                        <Text style={styles.category}>Email:</Text>
                        <Text style={styles.textInputStyle}>{this.state.email}</Text>
                        <Text style={styles.location}>Location</Text>
                        <MapView
                            region={this.state.focusedLocation}
                            style={styles.map}
                            ref={ref => this.map = ref}
                        >
                            {marker}
                        </MapView>
                        <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={this.deleteUser}
                        >
                            <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>DELETE USER</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
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
        justifyContent: 'space-between',
        marginTop: 55,
        width: '85%'
    },
    alignment: {
        width: '85%'
    },
    mainText: {
        fontWeight: 'bold',
        fontSize: 30,
        marginTop: 25,
        color: 'white'
    },
    category: {
        marginTop: 17,
        fontWeight: 'bold',
        fontSize: 17,
        color: 'white',
    },
    location: {
        marginTop: 17,
        fontWeight: 'bold',
        fontSize: 17,
        color: 'white',
        textAlign: 'center'
    },
    textInputStyle: {
        marginTop: 5,
        fontSize: 17,
        color: 'white',
    },
    map: {
        width: '100%',
        height: 300,
        marginTop: 20
    },
    deleteButton: {
        width: '100%',
        marginTop: 35,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#BF1736',
        borderRadius: 20,
        height: 40
    }
});

const mapStateToProps = state => {
    return {
        refpoint: state.reference.friendref,
    };
};


export default connect(mapStateToProps)(FriendProfile);