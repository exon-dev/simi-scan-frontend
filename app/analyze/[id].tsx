import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link, useLocalSearchParams } from "expo-router";
import LoadingDots from "@/components/extras/loading";
import { SafeAreaView } from "react-native-safe-area-context";

const RootLayout = () => {
	const { id } = useLocalSearchParams();
	const [isAnalyzing, setIsAnalyzing] = useState(false);

	const handlePress = () => {
		setIsAnalyzing(true);
	};

	return (
		<SafeAreaView className='bg-white flex-1 flex-col justify-start items-start py-10 px-8'>
			<View className='my-2'>
				<Link href='/info'>
					<MaterialIcons
						name='arrow-back-ios'
						size={30}
						color='black'
					/>
				</Link>
			</View>
			<Text className='text-3xl font-poppins-semibold py-5'>
				President Signature
			</Text>
			<View className='flex-row justify-between mb-5 gap-4'>
				<Image
					source={{ uri: "https://via.placeholder.com/150" }}
					className='w-42 h-42 rounded-lg border-4 border-gray-300 shadow-md'
				/>
				<Image
					source={{ uri: "https://via.placeholder.com/150" }}
					className='w-42 h-42 rounded-lg border-4 border-gray-300 shadow-md'
				/>
			</View>
			<TouchableOpacity
				className={`bg-blue-600 rounded-lg py-4 px-5 w-full flex-row justify-center items-center gap-2 shadow-md ${
					isAnalyzing ? "bg-blue-400" : ""
				}`}
				onPress={handlePress}
				disabled={isAnalyzing}>
				<Text className='text-white text-lg text-center'>
					{isAnalyzing ? "Analyzing" : "Analyze"}
				</Text>
				{isAnalyzing && <LoadingDots />}
			</TouchableOpacity>
		</SafeAreaView>
	);
};

export default RootLayout;
