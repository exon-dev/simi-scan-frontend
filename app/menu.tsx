import {
	StyleSheet,
	Text,
	View,
	SafeAreaView,
	ScrollView,
	FlatList,
} from "react-native";
import React from "react";

import AntDesign from "@expo/vector-icons/AntDesign";

const MenuView = () => {
	return (
		<SafeAreaView className='bg-white flex-1'>
			<View className='px-8'>
				<View className='w-full'>
					<AntDesign
						name='user'
						size={24}
					/>
					<Text className='font-semibold text-3xl font-PoppinsMedium'>
						Francis Tin-ao
					</Text>
				</View>
			</View>
		</SafeAreaView>
	);
};

export default MenuView;
