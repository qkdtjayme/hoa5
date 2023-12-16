import React from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ToolbarButton = ({ title, icon, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    {icon ? (
      <View style={styles.button}>
        {icon}
      </View>
    ) : (
      <Text style={styles.button}>
        {title}
      </Text>
    )}
  </TouchableOpacity>
);

ToolbarButton.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.element,
  onPress: PropTypes.func.isRequired,
};

export default class Toolbar extends React.Component {
  static propTypes = {
    isFocused: PropTypes.bool.isRequired,
    onChangeFocus: PropTypes.func,
    onSubmit: PropTypes.func,
    onPressCamera: PropTypes.func,
    onPressLocation: PropTypes.func,
  };

  static defaultProps = {
    onChangeFocus: () => {},
    onSubmit: () => {},
    onPressCamera: () => {},
    onPressLocation: () => {},
  };

  state = {
    text: "",
  };

  handleChangeText = (text) => {
    this.setState({ text });
  };

  handleSubmitEditing = () => {
    const { onSubmit } = this.props;
    const { text } = this.state;
    if (!text) return;
    onSubmit(text);
    this.setState({ text: "" });
  };

  setInputRef = (ref) => {
    this.input = ref;
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.isFocused !== this.props.isFocused) {
      if (nextProps.isFocused) {
        this.input.focus();
      } else {
        this.input.blur();
      }
    }
  }

  handleFocus = () => {
    const { onChangeFocus } = this.props;
    onChangeFocus(true);
  };

  handleBlur = () => {
    const { onChangeFocus } = this.props;
    onChangeFocus(false);
  };

  render() {
    const {
      onPressCamera,
      onPressLocation,
      onPressButton1,
      onPressButton2,
    } = this.props;
    const { text } = this.state;

    return (
      <View style={styles.toolbar}>
        <ToolbarButton title="📷" onPress={onPressCamera} />
        <ToolbarButton title="📍" onPress={onPressLocation} />
        <ToolbarButton title="🎵" onPress={onPressButton1} />
        <ToolbarButton title="🎙️" onPress={onPressButton2} />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            underlineColorAndroid={"transparent"}
            placeholder={"Type something"}
            blurOnSubmit={false}
            value={text}
            onChangeText={this.handleChangeText}
            onSubmitEditing={this.handleSubmitEditing}
            ref={this.setInputRef}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    paddingLeft: 16,
    backgroundColor: "white",
  },
  buttonText: {
    top: -2,
    marginRight: 12,
    fontSize: 20,
    color: "grey",
  },
  button: {
    top: -2,
    marginRight: 12,
    fontSize: 20,
    color: "grey",
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: "rgba(0,0,0,0.02)",
  },
  input: {
    flex: 1,
    fontSize: 18,
  },
});
