import { View, Text, FlatList, Image, RefreshControl, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getAllPosts } from '../../lib/appwrite';
import VideoCard from '../../components/VideoCard';
import { useGlobalContext } from '../../context/GlobalProvider';
import EmptyState from '../../components/EmptyState';
import useAppwrite from '../../lib/useAppwrite';

const Bookmark = () => {
  const { user } = useGlobalContext();
  const { data: allPosts, refetch } = useAppwrite(getAllPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // In a real app, you would fetch only saved/bookmarked videos
  // This is a simplified version that simulates bookmarked videos
  useEffect(() => {
    if (allPosts) {
      // Simulate bookmarked videos (in a real app, you'd have a proper bookmark system)
      const bookmarked = allPosts.filter((_, index) => index % 2 === 0); // Just for demo
      setFilteredVideos(bookmarked);
    }
  }, [allPosts]);

  // Handle search filtering
  useEffect(() => {
    if (!allPosts) return;
    
    // Simulate bookmarked videos
    const bookmarked = allPosts.filter((_, index) => index % 2 === 0);
    
    if (searchQuery.trim() === '') {
      setFilteredVideos(bookmarked);
    } else {
      const filtered = bookmarked.filter(video => 
        video.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredVideos(filtered);
    }
  }, [searchQuery, allPosts]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }

  return (
    <SafeAreaView className="bg-primary flex-1">
      <View className="px-4 pt-2 pb-4">
        <Text className="text-2xl text-white font-psemibold">
          Saved Videos
        </Text>
        
        <View className="mt-4 bg-black-100 rounded-full flex-row items-center px-4 py-2">
          <TextInput
            className="flex-1 text-white text-base pl-2"
            placeholder="Search your saved videos"
            placeholderTextColor="#6B7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Ionicons name="search" size={20} color="#6B7280" />
        </View>
      </View>

      <FlatList 
        data={filteredVideos}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => ( 
          <VideoCard video={item} />
        )}
        ListEmptyComponent={() => (
          <EmptyState 
            title="No Saved Videos"
            subtitle="You haven't saved any videos yet"
          />
        )}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
          />
        }
        contentContainerStyle={filteredVideos?.length === 0 ? { flex: 1 } : {}}
      />
    </SafeAreaView>
  )
}

export default Bookmark