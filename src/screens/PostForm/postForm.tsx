import { Input, Button, CheckBox, Icon } from "@rneui/themed";
import { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useToast } from "react-native-toast-notifications";
import { useSelector } from "react-redux";

import { useCreatePostMutation } from "../../stores/api/postsApi";

const PostForm = (props) => {
  const { navigation } = props;
  const loggedInAs = useSelector((state: any) => state.auth.loggedInAs);
  const createdByRef = useRef(null);
  const [createPost, { isLoading }] = useCreatePostMutation();
  const [postText, setPostText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSelected, setSelection] = useState<boolean>(false);
  const toast = useToast();

  const handleSubmit = () => {
    if (postText !== "") {
      setSubmitted(true);
      setPostText("");
      createPost({
        post: {
          text: postText,
          createdBy: `${loggedInAs.firstName} ${loggedInAs.lastName}`,
          createdDate: new Date().toLocaleDateString(),
          userId: `${loggedInAs.id}`,
          private: isSelected,
        },
      })
        .then(() => {
          toast.show(`Inlägget postat!`, {
            type: "success",
            placement: "top",
            duration: 4000,
            animationType: "slide-in",
          });
          navigation.navigate("PostList");
          setPostText("");
        })
        .catch((error) => {
          toast.show(error, { type: "danger" });
        });
    } else {
      setSubmitted(false);
      toast.show(`Du måste fylla i alla fält!`, {
        type: "warning",
        placement: "top",
        duration: 4000,
        animationType: "slide-in",
      });
    }
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.containerHeader}>
          <Text style={styles.title}>
            {loggedInAs.firstName} {loggedInAs.lastName}
          </Text>
        </View>
        <View style={styles.containerForm}>
          <CheckBox
            checked={isSelected}
            title="private"
            containerStyle={{
              backgroundColor: "transparent",
              padding: 0,
              marginBottom: 10,
            }}
            onPress={() => setSelection(!isSelected)}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
          />
          <Input
            placeholder="Ny post"
            value={postText}
            onChangeText={setPostText}
            returnKeyType="send"
            disabled={isLoading}
            onSubmitEditing={() => handleSubmit()}
          />
          <Button
            title="Posta"
            onPress={() => handleSubmit()}
            loading={isLoading}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#eaeaea",
  },
  containerHeader: {
    flex: 2,
    backgroundColor: "#eaeaea",
  },
  containerForm: {
    flex: 3,
    flexGrow: 10,
    textAlign: "center",
    backgroundColor: "#eaeaea",
  },
  title: {
    marginTop: 16,
    paddingVertical: 8,
    color: "#20232a",
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
  }
});

export default PostForm;
