import { ListItem, Button, CheckBox } from "@rneui/base";
import React, { useState } from "react";

const UserItem = ({ item, navigation, onDelete }) => {
  const [isSelected, setSelection] = useState(false);

  return (
    <ListItem
      onPress={() => {
        navigation.navigate("UserInfo", { user: item });
      }}
    >
      <ListItem.Content>
        <ListItem.Title>{`${item.firstName} ${item.lastName}`}</ListItem.Title>
      </ListItem.Content>
      <CheckBox
        checked={isSelected}
        onPress={() => setSelection(!isSelected)}
      />
      <Button onPress={() => onDelete(item)}>Delete</Button>
      <Button
        onPress={() => {
          navigation.navigate("UpdateForm", { user: item });
        }}
      >
        Update
      </Button>
    </ListItem>
  );
};

export default UserItem;
