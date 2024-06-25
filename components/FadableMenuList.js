/**
 * Wraps a FlatList and provide a menu button that slides with the FlatList scroll position
 * requires at minimum: data, renderItem, menuItems
 * data and renderItem are the same as required by FlatList
 * menuItems is a list of objects with fields: component, callback
 */


import { View, Text, ScrollView, FlatList } from 'react-native'
import React, { forwardRef, useState } from 'react'
import AnimatedSlideButton from './AnimatedSlideButton';

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
  const [yOffset, setYOffset] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [scrollMomentum, setScrollMomentum] = useState(false);
  const [scrollDragging, setScrollDragging] = useState(false);

  // console.log('props: ', props)

  // verify either children or data is present

  return (
    <>
    {children ? (
      <ScrollView
        ref={ref}
        // keyExtractor={(item, index) => index.toString()}
        onScroll={({nativeEvent: e}) => {
          setYOffset(e.contentOffset.y);
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
      <FlatList
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
    
    <AnimatedSlideButton
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

// export default FadableMenuList // with forwardRef, must export during declaration, not after