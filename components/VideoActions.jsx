import { View, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { 
  bookmarkVideo, 
  removeBookmark, 
  likeVideo, 
  unlikeVideo, 
  isVideoBookmarked, 
  isVideoLiked 
} from '../lib/appwrite'
import { useGlobalContext } from '../context/GlobalProvider'

const VideoActions = ({ videoId, onBookmarkChange }) => {
  const { user } = useGlobalContext();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  useEffect(() => {
    if (user && videoId) {
      checkBookmarkStatus();
      checkLikeStatus();
    }
  }, [user, videoId]);
  
  const checkBookmarkStatus = async () => {
    if (!user || !videoId) return;
    
    try {
      const bookmarkStatus = await isVideoBookmarked(user.$id, videoId);
      setIsBookmarked(bookmarkStatus);
    } catch (error) {
      console.error("Error checking bookmark status:", error);
    }
  };
  
  const checkLikeStatus = async () => {
    if (!user || !videoId) return;
    
    try {
      const likeStatus = await isVideoLiked(user.$id, videoId);
      setIsLiked(likeStatus);
    } catch (error) {
      console.error("Error checking like status:", error);
    }
  };
  
  const handleBookmark = async () => {
    if (!user) {
      Alert.alert("Sign in required", "Please sign in to bookmark videos");
      return;
    }
    
    try {
      if (isBookmarked) {
        await removeBookmark(user.$id, videoId);
        setIsBookmarked(false);
        if (onBookmarkChange) onBookmarkChange(false);
        Alert.alert("Success", "Video removed from bookmarks");
      } else {
        await bookmarkVideo(user.$id, videoId);
        setIsBookmarked(true);
        if (onBookmarkChange) onBookmarkChange(true);
        Alert.alert("Success", "Video bookmarked");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };
  
  const handleLike = async () => {
    if (!user) {
      Alert.alert("Sign in required", "Please sign in to like videos");
      return;
    }
    
    try {
      if (isLiked) {
        await unlikeVideo(user.$id, videoId);
        setIsLiked(false);
      } else {
        await likeVideo(user.$id, videoId);
        setIsLiked(true);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View className="flex-row items-center space-x-4">
      <TouchableOpacity 
        onPress={handleLike}
        className="items-center"
      >
        <Ionicons 
          name={isLiked ? "heart" : "heart-outline"} 
          size={22} 
          color={isLiked ? "#FF4C4C" : "#CCCCCC"} 
        />
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={handleBookmark}
        className="items-center"
      >
        <Ionicons 
          name={isBookmarked ? "bookmark" : "bookmark-outline"} 
          size={22} 
          color={isBookmarked ? "#FFAA00" : "#CCCCCC"} 
        />
      </TouchableOpacity>
    </View>
  )
}

export default VideoActions