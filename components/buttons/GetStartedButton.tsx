// GetStartedButton.js
import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { styled } from "nativewind";

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);

const GetStartedButton = () => {
	return (
		<StyledTouchableOpacity className="bg-[#007AFF] rounded-full py-4 px-8 shadow-md mt-8">
			<StyledText className="text-white text-center font-bold text-lg">
				Get Started
			</StyledText>
		</StyledTouchableOpacity>
	);
};

export default GetStartedButton;
