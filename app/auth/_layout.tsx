import { Stack } from "expo-router";
import React from "react";

const AuthLayout = () => {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="signin" />
			<Stack.Screen name="signup" />
			<Stack.Screen name="verification" />
		</Stack>
	);
};

export default AuthLayout;
