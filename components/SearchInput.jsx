import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useState } from 'react';

import { icons } from '../constants';
import { router, usePathname } from 'expo-router';

const SearchInput = ({ initialQuery }) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || '');
  const [isFocused, setIsFocused] = useState(false); // Track input focus state

  return (
      <View
        className={`border-2 ${
          isFocused ? 'border-secondary' : 'border-gray-700'
        } w-full h-16 px-4 bg-gray-900 rounded-2xl flex-row items-center space-x-4`}
      >
        <TextInput
          className="text-base mt-0.5 text-white flex-1 font-pregular"
          value={query}
          placeholder="Search for a video topic"
          placeholderTextColor="#CDCDE0"
          onChangeText={(e) => setQuery(e)}
          onFocus={() => setIsFocused(true)} // Set focus state
          onBlur={() => setIsFocused(false)} // Reset focus state
        />

        <TouchableOpacity
          onPress={() => {
            if(!query) {
              return Alert.alert('Missing query', "Please Input something to search results across database");
            }

            if(pathname.startsWith('/search')) router.setParams({ query })
            else router.push(`/search/${query}`)
          }}
        >
            <Image 
                source={icons.search}
                className="w-5 h-5"
                resizeMode='contain'
            />
        </TouchableOpacity>
      </View>
  );
};

export default SearchInput;
