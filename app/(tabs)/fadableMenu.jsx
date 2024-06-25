import { View, Text } from 'react-native'
import React from 'react'
import FadableMenuList from '../../components/FadableMenuList';

const data = Array(10).fill(1);

const fadableMenu = () => {
  return (
    <FadableMenuList
      ItemSeparatorComponent={() => <View style={{height: 10, width: '100%'}} />}
      data={data}
      renderItem={() => <View style={{height: 100, width: 100, backgroundColor: 'red'}} />}
      menuItems={[
        {
          component: () => (<Text>Menu 1</Text>),
          callback: () => {
            console.log('menu 1');
          },
        },
      ]}
      
    />
  )
}

export default fadableMenu