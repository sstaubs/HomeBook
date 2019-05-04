import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import { getReference, getUser } from "../store/actions/index";

class HomeScreen extends Component {
    state = {
        refresh: false,
    };

    ReferenceHandler = placeName => {
        this.props.onGetReference(placeName);
    };

    openSideMenu = () => Navigation.mergeOptions(this.props.componentId, {
        sideMenu: {
            left: { visible: true }
        }
    });



    pushUserProfile = () => {
        Navigation.push(this.props.componentId, {
            component: {
                name: 'UserProfile'
            }
        });
    }

    pushFriendProfile = () => Navigation.push(this.props.componentId, {
        component: {
            name: 'FriendProfile'
        }
    });

    pushAddUser = () => Navigation.push(this.props.componentId, {
        component: {
            name: 'AddUser'
        }
    });

    componentDidMount() {
        this.navigationEventListener = Navigation.events().bindComponent(this);
    }
    

   /* componentDidAppear() {
        this.setState({
            refresh: !this.state.refresh
        });
    }
    */

    

    friendHandler = val => {
        //alert(this.state.referenceArray[val])
        this.ReferenceHandler(this.props.user.referenceArray[val])
        //alert(this.props.refpoint);
        this.pushFriendProfile();
    };


    render() {



        return (
            <View style={styles.container}>
                <View style={styles.icons}>
                    <TouchableOpacity
                        style={styles.signoutIcon}
                        onPress={this.openSideMenu}>
                        <Icon size={25} name='ios-menu' color='white' />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.addIcon}
                        onPress={this.pushAddUser}>
                        <Icon size={35} name='ios-add' color='white' />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.alignment}>
                    <TouchableOpacity
                        onPress={this.pushUserProfile}>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                            <Icon size={35} name='ios-contact' color='white' />
                            <Text style={styles.mainText}>   {this.props.user.firstN} {this.props.user.lastN}</Text>

                        </View>
                    </TouchableOpacity>

                    <FlatList
                        style={styles.list}
                        data={this.props.user.friendNameArray}
                        getData={this.state}

                        renderItem={({ item, index }) =>
                            <TouchableOpacity
                                onPress={() => this.friendHandler(index)}
                            >
                                <Text style={styles.bodyText}>{item}</Text>
                            </TouchableOpacity>
                        }
                        keyExtractor={(index) => index.toString()}
                    />
                </ScrollView>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#222222'
    },
    alignment: {
        width: '85%'
    },
    icons: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '85%',
        marginTop: 40
    },
    mainText: {
        fontWeight: 'bold',
        fontSize: 30,
        marginTop: 25,
        color: 'white'
    },
    list: {
        marginTop: 20
    },
    bodyText: {
        color: 'white',
        marginTop: 10,
        fontSize: 18
    }
});
const mapStateToProps = state => {
    return {
        user: state.reference.user,

    };
};


const mapDispatchToProps = dispatch => {
    return {
        onGetReference: name => dispatch(getReference(name)),
        onGetUser: () => dispatch(getUser()),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);