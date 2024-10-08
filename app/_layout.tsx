import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import React from "react";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
		Poppins: require("../assets/fonts/Poppins-Regular.ttf"),
		PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
		PoppinsMedium: require("../assets/fonts/Poppins-Medium.ttf"),
		PoppinsLarge: require("../assets/fonts/Poppins-SemiBold.ttf"),
	});

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return (
		<ThemeProvider value={colorScheme === "light" ? DarkTheme : DefaultTheme}>
			<Stack>
				<Stack.Screen
					name='menu'
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name='analyze/[id]'
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name='info'
					options={{ headerShown: false }}
				/>

				<Stack.Screen
					name='index'
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name='(auth)'
					options={{ headerShown: false }}
				/>
				<Stack.Screen name='+not-found' />
			</Stack>
		</ThemeProvider>
	);
}
