import {FlatList, SafeAreaView, Text, View} from 'react-native'
import { ListItem } from '@rneui/base';
import { useGetUsersQuery } from '../../stores/api/usersApi'

const UserList = ({navigation}) => {
    const  {data, isLoading} = useGetUsersQuery({});
    return (
            <SafeAreaView>
                {isLoading ? <Text> ...Loading </Text>: (
                    <View>
                <Text>Användare:</Text>
                <FlatList data={data} renderItem={({ item }) => (
                    <ListItem key={item.id} onPress={() => { navigation.navigate('UserInfo', { user: item }) }}>
                        <ListItem.Content>
                            <ListItem.Title> {`${item.firstName} ${item.lastName}`}</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                    )}>
                </FlatList>
                </View>
            )}
           </SafeAreaView>
    )
}

export default UserList



