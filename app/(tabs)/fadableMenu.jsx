import { View, Text } from "react-native";
import React from "react";
import FadableMenuList from "../../components/FadableMenuList";
import { AntDesign } from "@expo/vector-icons";

const data = Array(23)
  .fill(1)
  .map((_, index) => (index + 1).toString());

const fadableMenu = () => {
  const groupSize = 10;

  const renderItem = ({ item, index }) => {
    // if (false) {
    if (index % (groupSize + 1) === 0) {
      return (
        <View
          style={{
            height: 30,
            backgroundColor: "pink",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <Text>{item}</Text>
        </View>
      );
    } else {
      return (
        <View
          style={{
            height: 100,
            backgroundColor: "white",
            // backgroundColor: 'lightblue',
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text>{item}</Text>
        </View>
      );
    }
  };

  /** add numbered headers to list */
  const dataWithHeaders = data.flatMap((x, index) => {
    if (index % groupSize === 0) {
      const start = (index + 1).toString();
      const end = (index + groupSize).toString();
      const header = `${start}-${end}`;
      return [header, x];
    } else {
      return x;
    }
  });
  console.log("dataWithHeaders: ", dataWithHeaders);

  const listHeader = () => (
    <View
      style={{
        backgroundColor: "yellow",
        height: 100,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>List Header</Text>
    </View>
  );

  return (
    <FadableMenuList
      ItemSeparatorComponent={
        <View style={{ 
          height: 1, 
          backgroundColor: "black",

        }} />
      }
      data={dataWithHeaders}
      renderItem={renderItem}
      // ListHeaderComponent={listHeader}
      menuItems={[
        {
          component: () => <Text>Menu 1</Text>,
          callback: () => {
            console.log("menu 1");
          },
        },
      ]}
      stickyHeaderIndices={data.map((x, index) =>
        index % (groupSize + 1) === 0 ? index : null
      )}
      // stickyHeaderHiddenOnScroll={true}
    />
  );
};

export default fadableMenu;
