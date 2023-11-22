import { ListItem, Button } from "@rneui/base";
import { CheckBox, Icon } from '@rneui/themed';
import React, { useState, useEffect } from "react";


const UserItem = ({ item, navigation, onDelete, onCheckboxChange }) => {
  const [isSelected, setSelection] = useState<boolean>(false);

  useEffect(() => {
    console.log("useEffect - item.id:", item.id, "isSelected:", isSelected);
    onCheckboxChange(item.id, isSelected);
  }, [isSelected]);

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
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
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
