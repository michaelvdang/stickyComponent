/**
 * Testing the scrollY.interpolate function
 */

import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

type SlidingButtonProps = {
  style: StyleSheet.NamedStyles<any>,
  yOffset: number,
}

const SlidingButton = ({
  style,
  yOffset,
} : SlidingButtonProps) => {

  console.log('yOffset: ', yOffset)
  
  
  return (
    <View
      style={style}
    >
      <Text>SlidingButton</Text>
    </View>
  )
}

export default SlidingButton