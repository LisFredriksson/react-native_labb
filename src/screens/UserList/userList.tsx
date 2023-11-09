import {FlatList, SafeAreaView, Text, View, RefreshControl} from 'react-native'
import { ListItem } from '@rneui/base';
import { useGetUsersQuery } from '../../stores/api/usersApi'

const UserList = ({navigation}) => {
    const  {data, isLoading, refetch} = useGetUsersQuery({});
    return (
            <SafeAreaView>
                {isLoading ? <Text> ...Loading </Text>: (
                    <View>
                <Text>Användare:</Text>
                <FlatList data={data} refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={refetch} />
                 }
                  renderItem={({ item }) => (
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
