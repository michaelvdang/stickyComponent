/**
 * Wraps a FlatList and provide a menu button that slides with the FlatList scroll position
 * requires at minimum: data, renderItem, menuItems
 * data and renderItem are the same as required by FlatList
 * menuItems is a list of objects with fields: component, callback
 */


import { Animated, View, Text, ScrollView, FlatList, StyleSheet } from 'react-native'
import React, { forwardRef, useState } from 'react'
import { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import FadableButton from './FadableButton';
import SlidingButton from './SlidingButton';

export default FadableMenuList = forwardRef((
  {
    children,     // will render as ScrollView
    // data,         // will render as FlatList
    // renderItem,   // will render as FlatList
    // keyboardShouldPersistTaps,
    // ItemSeparatorComponent,
    // stickyHeaderIndices,
    menuItems,
    menuButtonStyle,
    buttonSize,
    buttonGap,
    minimumTranslation,
    defaultTranslation,
    maximumTranslation,
    snapToThreshold,
    bottomOffset,
    disableSliding = false,
    ...props
  }, 
    ref
  ) => {
  // const yOffset = useSharedValue(0);
  const [yOffset, setYOffset] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [scrollMomentum, setScrollMomentum] = useState(false);
  const [scrollDragging, setScrollDragging] = useState(false);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    console.log('event: ', event);
    yOffset.value = event.contentOffset.y;
    setContentHeight(event.contentSize.height);
    setViewportHeight(event.layoutMeasurement.height);
  })

  // console.log('props: ', props)

  // verify either children or data is present

  return (
    <>
    {children ? (
      <ScrollView
        ref={ref}
        // keyExtractor={(item, index) => index.toString()}
        onScroll={({nativeEvent: e}) => {
          yOffset.value = e.contentOffset.y;
          // setYOffset(e.contentOffset.y);
          setContentHeight(e.contentSize.height);
          setViewportHeight(e.layoutMeasurement.height);
        }}
        onMomentumScrollBegin={() => {setScrollMomentum(true);}}
        onMomentumScrollEnd={() => {setScrollMomentum(false);}}
        onScrollBeginDrag={() => {setScrollDragging(true);}}
        onScrollEndDrag={() => {setScrollDragging(false);}}
      >
        {children}
      </ScrollView>
    ) : (
      <Animated.FlatList
        ref={ref}
        {...props}
        // stickyHeaderIndices={stickyHeaderIndices}
        // renderItem={renderItem} 
        // data={data}
        // keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        // ItemSeparatorComponent={ItemSeparatorComponent}
        // keyExtractor={(item, index) => index.toString()}
        onScroll={({nativeEvent: e}) => {
          if (disableSliding) 
            return;
          setYOffset(e.contentOffset.y);
          setContentHeight(e.contentSize.height);
          setViewportHeight(e.layoutMeasurement.height);
        }}
        onMomentumScrollBegin={() => {setScrollMomentum(true);}}
        onMomentumScrollEnd={() => {setScrollMomentum(false);}}
        onScrollBeginDrag={() => {setScrollDragging(true);}}
        onScrollEndDrag={() => {setScrollDragging(false);}}
      />
    )}

    <SlidingButton
      // style={styles.container}
      yOffset={yOffset}
    />
    
    <FadableButton
      menuItems={menuItems}
      menuButtonStyle={menuButtonStyle}
      buttonSize={buttonSize}
      buttonGap={buttonGap}
      yOffset={yOffset} 
      contentHeight={contentHeight} 
      viewportHeight={viewportHeight} 
      scrollMomentum={scrollMomentum}
      scrollDragging={scrollDragging}
      minimumTranslation={minimumTranslation}
      defaultTranslation={defaultTranslation}
      maximumTranslation={maximumTranslation}
      snapToThreshold={snapToThreshold}
      bottomOffset={bottomOffset}
    />
    </>
  )
})

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 0,
    width: '100%',
    height: 50,
    backgroundColor: 'red',
  }
})
// export default FadableMenuList // with forwardRef, must export during declaration, not after