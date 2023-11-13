import {FlatList, Text, View, RefreshControl, StyleSheet} from 'react-native'
import { ListItem, Button } from '@rneui/base';
import { useGetUsersQuery } from '../../stores/api/usersApi'
import { useDeleteUserMutation } from "../../stores/api/usersApi";
import { useToast } from 'react-native-toast-notifications'

const UserList = ({navigation}) => {
    const [ deleteUser ] = useDeleteUserMutation();
    const toast = useToast();
    const deleteHandler = async (user) => {
        try {
        const response = await deleteUser({ user: { id: user.id } });

        // Check if the response is an error or not
        if ('error' in response) {
            console.error("Delete error:", response.error);
        } else {
            toast.show( `${user.firstName} ${user.lastName} raderad!`, {
                type: "warning",
                placement: "top",
                duration: 4000,
                animationType: "slide-in",
              })
        }
        } catch (error) {
        console.error("API call error:", error);
        }
    }
    const  {data, isLoading, refetch} = useGetUsersQuery({});
    return (
            <View style={styles.mainContainer}>
                {isLoading ? <Text> ...Loading </Text>: (
                <View>
                    <Text style={styles.mainHeader}>Användare</Text>
                    <FlatList data={data} refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={refetch} />
                    }
                    renderItem={({ item }) => (
                        <ListItem key={item.id} onPress={() => { navigation.navigate('UserInfo', { user: item }) }}>
                            <ListItem.Content>
                                <ListItem.Title> {`${item.firstName} ${item.lastName}`}</ListItem.Title>

                            </ListItem.Content>
                            <Button onPress={() => deleteHandler(item)}>Delete</Button>
                            <Button onPress={() => { navigation.navigate('UpdateForm', { user: item }) }}>Update</Button>
                        </ListItem>
                        )}>
                    </FlatList>
                </View>
            )}
           </View>
    )
}

const styles = StyleSheet.create({
    mainHeader: {
        color: 'black',
        fontSize: 50,
        fontWeight: "400",
        padding: 20
    },
    mainContainer: {
        backgroundColor: 'white',
        paddingBottom: 50
    }

  });

export default UserList
