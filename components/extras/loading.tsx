import React, { useState } from "react";
import { View, StyleSheet, Animated } from "react-native";

const LoadingDots = () => {
	const [dot1Opacity] = useState(new Animated.Value(1));
	const [dot2Opacity] = useState(new Animated.Value(1));
	const [dot3Opacity] = useState(new Animated.Value(1));

	React.useEffect(() => {
		const animateDots = () => {
			Animated.sequence([
				Animated.timing(dot1Opacity, {
					toValue: 0.3,
					duration: 100,
					useNativeDriver: true,
				}),
				Animated.timing(dot1Opacity, {
					toValue: 1,
					duration: 100,
					useNativeDriver: true,
				}),
				Animated.timing(dot2Opacity, {
					toValue: 0.3,
					duration: 100,
					useNativeDriver: true,
				}),
				Animated.timing(dot2Opacity, {
					toValue: 1,
					duration: 100,
					useNativeDriver: true,
				}),
				Animated.timing(dot3Opacity, {
					toValue: 0.3,
					duration: 100,
					useNativeDriver: true,
				}),
				Animated.timing(dot3Opacity, {
					toValue: 1,
					duration: 100,
					useNativeDriver: true,
				}),
			]).start(() => animateDots());
		};

		animateDots();
	}, [dot1Opacity, dot2Opacity, dot3Opacity]);

	return (
		<View style={styles.loadingContainer}>
			<Animated.View style={[styles.dot, { opacity: dot1Opacity }]} />
			<Animated.View style={[styles.dot, { opacity: dot2Opacity }]} />
			<Animated.View style={[styles.dot, { opacity: dot3Opacity }]} />
		</View>
	);
};

const styles = StyleSheet.create({
	dot: {
		width: 4,
		height: 4,
		backgroundColor: "white",
		borderRadius: 5,
		marginHorizontal: 2,
	},
	loadingContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
});

export default LoadingDots;
