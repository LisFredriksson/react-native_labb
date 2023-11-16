import { Input, Button } from "@rneui/themed";
import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useToast } from "react-native-toast-notifications";
// import i18n, {changeLanguage} from "../../../i18n";
import { useUpdateUserMutation } from "../../stores/api/usersApi";

const UpdateForm = ({ route, navigation }) => {
  const user = route?.params?.user;
  const lastNameRef = useRef(null);
  const firstNameRef = useRef(null);
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const [id, setId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const toast = useToast();

  useEffect(() => {
    // Check if default values are different from current state values
    if (user.id !== id) {
      setId(user.id);
    }
    if (user.firstName !== firstName) {
      setFirstName(user.firstName);
    }
    if (user.lastName !== lastName) {
      setLastName(user.lastName);
    }
  }, [user.id, user.firstName, user.lastName]);

  const handleSubmit = () => {
    if (firstName !== "" && lastName !== "") {
      setSubmitted(true);
      updateUser({
        user: {
          id,
          firstName,
          lastName,
        },
      })
        .then(() => {
          toast.show(`Hej, ${firstName} ${lastName}, är Uppdaterad!`, {
            type: "success",
            placement: "top",
            duration: 4000,
            animationType: "slide-in",
          });
          navigation.navigate("UserList");
          setFirstName("");
          setLastName("");
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
          <Text style={styles.title}>Uppdatera</Text>
        </View>
        <View style={styles.containerForm}>
          <Input
            returnKeyType="next"
            onSubmitEditing={() => firstNameRef.current.focus()}
            placeholder="Id"
            value={user.id}
            disabled={isLoading}
            onChangeText={setId}
          />
          <Input
            returnKeyType="next"
            onSubmitEditing={() => lastNameRef.current.focus()}
            placeholder="Förnamn"
            defaultValue={user.firstName}
            disabled={isLoading}
            ref={firstNameRef}
            onChangeText={setFirstName}
          />
          <Input
            placeholder="Efternamn"
            onChangeText={setLastName}
            defaultValue={user.lastName}
            returnKeyType="send"
            disabled={isLoading}
            ref={lastNameRef}
            onSubmitEditing={() => handleSubmit()}
          />
          <Button
            title="Update"
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
  },
});

export default UpdateForm;
