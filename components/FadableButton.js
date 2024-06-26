import { View, Text, Pressable, StyleSheet } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, interpolate, Extrapolation } from 'react-native-reanimated';
import { useEffect, useState } from "react";
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

export default FadableButton = ({
	menuItems, 
	menuButtonStyle,
	buttonSize = 50,
	buttonGap = 10,
	yOffset, 
	contentHeight, 
	viewportHeight,
	scrollMomentum,
	scrollDragging,
	minimumTranslation = 0,
	defaultTranslation = 0,
	maximumTranslation = 50,
	snapToThreshold = 30,
	bottomOffset = 50,
}) => {
	const [prevYOffset, setPrevYOffset] = useState(0);
	const translationY = useSharedValue(defaultTranslation);
	const opacity = useSharedValue(1);
	const maxYOffset = Math.max(contentHeight - viewportHeight, 0);
	const [menuOpen, setMenuOpen] = useState(false);

	const OPEN_CLOSE_MENU_ANIMATION_TIMING = 125;
	const SHOW_MENU_OPENER_TRANSLATE_Y = defaultTranslation;
	const HIDE_MENU_OPENER_TRANSLATE_Y = maximumTranslation;
	// const HIDE_MENU_OPENER_TRANSLATE_Y = 50;
	const SNAP_ACTION_THRESHOLD = snapToThreshold;

	function clamp(val, min, max) {
		return Math.min(Math.max(val, min), max);
	}
	
	useEffect(() => {
		// console.log('prevYOffset, yOffset: ', prevYOffset, yOffset);
		let currentTranslationY = translationY.value;
		// clamp menu button translation to 0 and bottomOffset
		// if (yOffset > 0 && yOffset < maxYOffset) {
			currentTranslationY += (yOffset - prevYOffset) / 8;
			// currentTranslationY = clamp(currentTranslationY, minimumTranslation, maximumTranslation);
			translationY.value = currentTranslationY;
			// opacity.value = interpolate(
			// 	translationY.value,
			// 	[minimumTranslation, maximumTranslation],
			// 	[1, 0],
			// 	Extrapolation.CLAMP
			// )
			// opacity.value = 1 - (currentTranslationY / maximumTranslation);
			// console.log('opacity: ', (maximumTranslation - currentTranslationY) / maximumTranslation)
			// close menu when scrolling
			closeMenu();
		// }
		if (yOffset === 0) {
		// else if (yOffset === 0) {		// move menu to default position at top
			// console.log('show 0')
			showMenuOpener();
			closeMenu();
		}
		else if (yOffset > maxYOffset - 10) {	// hide menu at bottom
			hideMenuOpener();
			closeMenu();
		}
		
		setPrevYOffset(yOffset);
	}, [yOffset])

	useEffect(() => {
		// console.log('scrollDragging: ', scrollDragging);
		if (!scrollDragging) {
			if (translationY.value < SNAP_ACTION_THRESHOLD) {
				// console.log('show 1');
				showMenuOpener();
			}
			else {
				hideMenuOpener();
			}
		}
	}, [scrollDragging])

	useEffect(() => {
		// console.log('scrollMomentum: ', scrollMomentum);
		// console.log('translationY: ', translationY.value);
		if (!scrollMomentum) {	// scroll momentum animation has stopped (user has stopped scrolling)
			if (yOffset >= maxYOffset && maxYOffset > 10) {	// close menu if at bottom
				// console.log('hide 1');
				hideMenuOpener();
			}
			else {
				// open menu if almost half way up
				if (translationY.value < SNAP_ACTION_THRESHOLD || yOffset === 0) {
					// console.log('show 2');
					showMenuOpener();
				}
				else { // close otherwise
					// console.log('hide 2');
					hideMenuOpener();
				}
			}
		}
	}, [scrollMomentum])

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ 
				translateY: interpolate(
					translationY.value,
					[defaultTranslation, maximumTranslation],
					[defaultTranslation, maximumTranslation],
					Extrapolation.EXTEND,
				)
				// translateY: translationY.value
			 }],
			 opacity: interpolate(
				translationY.value,
				[-20, defaultTranslation, maximumTranslation],
				[0.5, 1, 0],
				Extrapolation.CLAMP
			 )
			// opacity: opacity.value
		}
	})

	const scaleMenuItem = useSharedValue(0);
	const aMenuItemstyle = useAnimatedStyle(() => {
		return {
			transform: [{ 
				scale: scaleMenuItem.value,
			}],
		}
	})

	const scaleMenuOpener = useSharedValue(1);
	const aMenuOpenerStyle = useAnimatedStyle(() => {
		return {
			transform: [{ 
				scale: scaleMenuOpener.value,
			}],
		}
	})

	// slide menu opener up
	const showMenuOpener = () => {
		translationY.value = withSpring(SHOW_MENU_OPENER_TRANSLATE_Y, { duration: 1000 });
		// opacity.value = 1;
		opacity.value = withSpring(1, { duration: 500 });
	}

	// slide menu opener down
	const hideMenuOpener = () => {
		translationY.value = withSpring(HIDE_MENU_OPENER_TRANSLATE_Y, { duration: 1000 });
		// opacity.value = 0;
		opacity.value = withSpring(0, { duration: 500 });
	}
	
	const timingConfig = { duration: OPEN_CLOSE_MENU_ANIMATION_TIMING };
	const openMenu = () => {
		scaleMenuOpener.value = withTiming(0, timingConfig);
		setTimeout(() => {
			scaleMenuItem.value = withTiming(1, timingConfig);
		}, OPEN_CLOSE_MENU_ANIMATION_TIMING);
		setMenuOpen(true);
	}
	
	const closeMenu = () => {
		scaleMenuItem.value = withTiming(0, timingConfig);
		setTimeout(() => {
			scaleMenuOpener.value = withTiming(1, timingConfig);
		}, OPEN_CLOSE_MENU_ANIMATION_TIMING);
		setMenuOpen(false);
	}

	return (
		<Animated.View style={[
			styles.container({buttonSize, bottomOffset}),
			animatedStyle
		]}>
			{menuItems && menuItems.map((item, index) => {
				return (
					<Animated.View
						key={index}
						style={[
							styles.menuItemContainer,
							{
								bottom: (buttonSize + buttonGap) * (menuItems.length - index),
							},
							aMenuItemstyle,
						]}
					>
						<Pressable
							onPress={() => {
								item.callback();
								closeMenu();
							}}
							style={[
								{
									height: buttonSize,
									width: buttonSize,
								},
								styles.btn,
								menuButtonStyle,
							]}
						>
							{item.component}
						</Pressable>
					</Animated.View>
				)
			})}
			
			<Animated.View
				style={[
					styles.menuItemContainer,
					{
						bottom: (buttonSize + buttonGap) * 0,
					},
					aMenuItemstyle,
				]}
			>
				<Pressable
					onPress={() => {
						console.log('Closing menu');
						closeMenu();
					}}
					style={[
						{
							height: buttonSize,
							width: buttonSize,
							borderRadius: buttonSize,
						},
						styles.btn,
						menuButtonStyle,
					]}
				>
					<AntDesign name="close" size={24} color="white" />
				</Pressable>
			</Animated.View>

			{(menuItems && menuItems.length === 1) ? (
				<Animated.View
					style={[
						styles.menuItemContainer,
						aMenuOpenerStyle,
					]}
				>
					<Pressable
						onPress={() => {
							if (scrollMomentum || scrollDragging) {	// disable opening menu if scrolling
								return;
							}
							menuItems[0].callback();
						}}
						style={[
							{
								height: buttonSize,
								width: buttonSize,
							},
							styles.btn,
							menuButtonStyle,
						]}
					>
						{menuItems[0].component}
					</Pressable>
				</Animated.View>
			) : (
				<Animated.View
					style={[
						styles.menuItemContainer,
						aMenuOpenerStyle,
					]}
				>
					<Pressable
						onPress={() => {
							console.log('menuOpen: ', menuOpen);
							if (scrollMomentum || scrollDragging) {	// disable opening menu if scrolling
								return;
							}
							openMenu();
							// default action or open menu for other actions
							// if (menuItems && menuItems.length === 1) {
							// 	menuItems[0].callback();
							// }
							// else {
							// 	openMenu();
							// }
						}}
						style={[
							{
								height: buttonSize,
								width: buttonSize,
							},
							styles.btn,
							menuButtonStyle,
						]}
					>
						<Entypo name="menu" size={24} color="white" />
					</Pressable>
				</Animated.View>
			)}
			
		</Animated.View>
	)
}

const styles = StyleSheet.create({
	container: ({buttonSize, bottomOffset}) => ({
		position: 'absolute',
		bottom: bottomOffset,
		height: buttonSize,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		// backgroundColor: 'lightblue',
	}),
	menuItemContainer: {
		position: 'absolute',
		// borderRadius: 100,
	},
	btn: ({
		borderRadius: 50,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#456456',
	}),
})