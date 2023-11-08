import {useState, useRef} from 'react';
import {View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard} from 'react-native'
import {Input, Button} from '@rneui/themed'
import { useCreateUserMutation } from "../../stores/api/usersApi"
import { useToast } from 'react-native-toast-notifications'



const UserForm = (props) => {
  const {navigation} = props
  const lastNameRef = useRef(null)
  const [createUser, { isLoading }] = useCreateUserMutation()
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName]	= useState('')
	const [submitted, setSubmitted] = useState(false)
  const toast = useToast()

    const handleSubmit = () => {
        if (firstName !== '' && lastName !== '') {
			setSubmitted(true)
			setFirstName('')
			setLastName('')
			createUser({
				user: {
					firstName: firstName,
					lastName: lastName
				}
			}).then(() => {
        toast.show( `Hej, ${firstName} ${lastName}, välkommen!`, {
          type: "success",
          placement: "top",
          duration: 4000,
          animationType: "slide-in",
        })
        navigation.navigate('UserList')
        setFirstName('')
        setLastName('')
      }).catch((error) => {
        toast.show(error, {type: "danger"})
      })
		} else {
			setSubmitted(false)
      toast.show( `Du måste fylla i alla fält!`, {
        type: "warning",
        placement: "top",
        duration: 4000,
        animationType: "slide-in",
      })
		}
    }
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.container}>
              <View style={styles.containerHeader}>
                <Text style={styles.title}>Ny användare</Text>
              </View>
              <View style={styles.containerForm}>
                  <Input
                    returnKeyType='next'
                    onSubmitEditing={() => lastNameRef.current.focus()}
                    placeholder="Förnamn"
                    value={firstName}
                    disabled={isLoading}
                    onChangeText={setFirstName}
                  />
                  <Input
                      placeholder="Efternamn"
                      value={lastName}
                      onChangeText={setLastName}
                      returnKeyType='send'
                      disabled={isLoading}
                      ref={lastNameRef}
                      onSubmitEditing={() => handleSubmit()}
                  />
                  <Button
                      title="Lägg till"
                      onPress={() => handleSubmit()}
                      loading={isLoading}
                  />
              </View>
          </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      backgroundColor: '#eaeaea',
    },
    containerHeader: {
        flex: 2,
        backgroundColor: '#eaeaea',
      },
    containerForm: {
        flex: 3,
        flexGrow: 10,
        textAlign: 'center',
        backgroundColor: '#eaeaea',
    },
    title: {
      marginTop: 16,
      paddingVertical: 8,
      color: '#20232a',
      textAlign: 'center',
      fontSize: 30,
      fontWeight: 'bold',
    },
  });

export default UserForm;
