import React from 'react';
import { View, SafeAreaView, Alert, Modal, Keyboard, Platform } from 'react-native';
import MessageList from "./components/MessageList";
import Toolbar from "./components/Toolbar";
import { createImageMessage, createLocationMessage, createTextMessage } from "./utils/MessageUtils";
import ImageViewer from 'react-native-image-zoom-viewer';
import * as Location from 'expo-location';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
      this._keyboardDidHide,
    );
  }

  state = {
    messages: [
      createImageMessage('https://unsplash.it/300/300'),
      createTextMessage('World'),
      createTextMessage('Hello'),
      createLocationMessage({
        latitude: 14.5865,
        longitude: 121.1149,
      }),
    ],
    selectedImage: null,
    isInputFocused: false,
    keyboardHeight: 0,
  };

  _keyboardDidShow = (event) => {
    this.setState({ keyboardHeight: event.endCoordinates.height });
  };

  _keyboardDidHide = () => {
    this.setState({ keyboardHeight: 0 });
  };

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  handlePressMessage = (message) => {
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            this.deleteMessage(message);
            this.setState({ isInputFocused: false });
          },
        },
      ],
      { cancelable: false }
    );
  };

  handlePressToolbarLocation = async () => {
    const { messages } = this.state;

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});

        const { latitude, longitude } = location.coords;

        this.setState({
          messages: [
            createLocationMessage({
              latitude,
              longitude,
            }),
            ...messages,
          ],
        });
      } else {
        console.error('Location permission not granted. Please allow access to your location in the device settings.');
      }
    } catch (error) {
      console.error('Error getting location. Please check your internet connection and try again.', error);
    }
  };

  handlePressImage = (uri) => {
    this.setState({ selectedImage: uri });
  };

  deleteMessage = (message) => {
    const { messages } = this.state;
    const updatedMessages = messages.filter(msg => msg.id !== message.id);
    this.setState({ messages: updatedMessages });
  };

  renderFullScreenImage() {
    const { selectedImage } = this.state;
    if (!selectedImage) return null;

    return (
      <Modal transparent={true} onRequestClose={() => this.setState({ selectedImage: null })}>
        <View style={{ flex: 1 }}>
          <ImageViewer
            imageUrls={[{ url: selectedImage }]}
            enableSwipeDown={true}
            onSwipeDown={() => this.setState({ selectedImage: null })}
          />
        </View>
      </Modal>
    );
  }

  handleSubmit = (text) => {
    const { messages } = this.state;
    this.setState({
      messages: [createTextMessage(text), ...messages],
    });
  };

  handleChangeFocus = (isFocused) => {
    this.setState({ isInputFocused: isFocused });
  };

  handlePressToolbarCamera = () => {
  };

  renderToolbar() {
    const { isInputFocused, keyboardHeight } = this.state;
    const toolbarPosition = {
      bottom: keyboardHeight,
    };

    return (
      <View style={[styles.toolbar, toolbarPosition]}>
        <Toolbar
          isFocused={isInputFocused}
          onSubmit={this.handleSubmit}
          onChangeFocus={this.handleChangeFocus}
          onPressCamera={this.handlePressToolbarCamera}
          onPressLocation={this.handlePressToolbarLocation}
        />
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <MessageList
            messages={this.state.messages}
            onPressMessage={this.handlePressMessage}
            onPressImage={this.handlePressImage}
          />
        </View>
        {this.renderToolbar()}
        {this.renderFullScreenImage()}
      </SafeAreaView>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#91a683',
  },
  content: {
    flex: 1,
  },
  toolbar: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'white',
  },
};

export default App;
