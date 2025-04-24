import {
    Account,
    Avatars,
    Client,
    Databases,
    ID,
    Query,
    Storage,
  } from "react-native-appwrite";
  
    export const appwriteConfig = {
        endpoint: 'https://cloud.appwrite.io/v1',
        platform: 'com.app.aora',
        projectId: '6799400b0007c7c243f2',
        databaseId: '6799424f0021bd8b7747',
        userCollectionId: '6799429a00068f732339',
        videoCollectionId: '679942e0001f31dac431',
        storageId: '679945210025268f00aa', 
        bookmarksCollectionId: '6803f8aa0035773b2282', // You'll need to create this collection
        likesCollectionId: '6803f8cc003d97862acb', 
    }
  
  const client = new Client();
  
  client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform);
  
  const account = new Account(client);
  const avatars = new Avatars(client);
  const databases = new Databases(client);
  const storage = new Storage(client);
  
  // Register user
  export async function createUser(email, password, username) {
    try {
      const newAccount = await account.create(
        ID.unique(),
        email,
        password,
        username
      );
  
      if (!newAccount) throw Error;
  
      const avatarUrl = avatars.getInitials(username);
  
      await signIn(email, password);
  
      const newUser = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        ID.unique(),
        {
          accountId: newAccount.$id,
          email: email,
          username: username,
          avatar: avatarUrl,
        }
      );
  
      return newUser;
    } catch (error) {
      throw new Error(error);
    }
  }
  
  // Sign In
  export async function signIn(email, password) {
    try {
      const session = await account.createEmailPasswordSession(email, password);
  
      return session;
    } catch (error) {
      throw new Error(error);
    }
  }
  
  // Get Account
  export async function getAccount() {
    try {
      const currentAccount = await account.get();
  
      return currentAccount;
    } catch (error) {
      throw new Error(error);
    }
  }
  
  // Get Current User
  export async function getCurrentUser() {
    try {
      const currentAccount = await getAccount();
      if (!currentAccount) throw Error;
  
      const currentUser = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal("accountId", currentAccount.$id)]
      );
  
      if (!currentUser) throw Error;
  
      return currentUser.documents[0];
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  export const getAllPosts = async () => {
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        [Query.orderDesc('$createdAt')]
      )

      return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
  }

  export const getLatestPosts = async () => {
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        [Query.orderDesc('$createdAt',Query.limit(7))]
      )

      return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
  }

  export const searchPosts = async (query) => {
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        [Query.search('title',query)]
      )

      return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
  }

  export const getUserPosts = async (userId) => {
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        [Query.equal('users',userId)],
        [Query.orderDesc('$createdAt')]
      )

      return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
  }

  export const signOut = async () => {
    try {
      const session = await account.deleteSession('current');

      return session;
    } catch (error) {
      throw new Error(error);
    }
  }

  export const getFilePreview = async (fileId, type) => {
    let fileUrl;

    try {
      if(type === 'video') {
        fileUrl = storage.getFileView(appwriteConfig.storageId, fileId)
      } else if(type === 'image') {
        fileUrl = storage.getFilePreview(appwriteConfig.storageId, fileId, 2000, 2000, 'top', 100);
      } else {
        throw new Error('Invalid file type')
      }

      if(!fileUrl) throw Error;

      return fileUrl;
    } catch (error) {
      throw new Error(error);
    }
  }

  export const uploadFile = async (file, type) => {
    if(!file) return;

    const { mimeType, ...rest } = file;
    const asset = { 
      name: file.fileName,
      type: file.mimeType,
      size: file.fileSize,
      uri: file.uri
    }

    try {
      const uploadedFile = await storage.createFile(
        appwriteConfig.storageId,
        ID.unique(),
        asset
      );

      const fileUrl = await getFilePreview(uploadedFile.$id, type);

      return fileUrl;
    } catch (error) {
      throw new Error(error);
    }
  }

  export const createVideo = async (form) => {
    try {
      const [thumbnailUrl, videoUrl] = await Promise.all([
        uploadFile(form.thumbnail, 'image'),
        uploadFile(form.video, 'video')
      ])
      const newPost = await databases.createDocument(
          appwriteConfig.databaseId, appwriteConfig.videoCollectionId, ID.unique(), {
          title: form.title,
          thumbnail: thumbnailUrl,
          video: videoUrl,
          prompt: form.prompt,
          users: form.userId
        }
      )

      return newPost;
    } catch (error) {
      throw new Error(error);
    }
  }

  export async function bookmarkVideo(userId, videoId) {
  try {
    // Check if already bookmarked
    const exists = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.bookmarksCollectionId,
      [
        Query.equal('userId', userId),
        Query.equal('videoId', videoId)
      ]
    );
    
    if (exists.documents.length > 0) {
      // Already bookmarked, so return existing document
      return exists.documents[0];
    }
    
    // Create new bookmark
    const bookmark = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.bookmarksCollectionId,
      ID.unique(),
      {
        userId: userId,
        videoId: videoId,
        createdAt: new Date().toISOString()
      }
    );
    
    return bookmark;
  } catch (error) {
    throw new Error(error);
  }
}

// Function to remove bookmark
export async function removeBookmark(userId, videoId) {
  try {
    const bookmarks = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.bookmarksCollectionId,
      [
        Query.equal('userId', userId),
        Query.equal('videoId', videoId)
      ]
    );
    
    if (bookmarks.documents.length === 0) {
      return { success: false, message: 'Bookmark not found' };
    }
    
    const bookmarkId = bookmarks.documents[0].$id;
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.bookmarksCollectionId,
      bookmarkId
    );
    
    return { success: true };
  } catch (error) {
    throw new Error(error);
  }
}

// Function to like a video
export async function likeVideo(userId, videoId) {
  try {
    // Check if already liked
    const exists = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.likesCollectionId,
      [
        Query.equal('userId', userId),
        Query.equal('videoId', videoId)
      ]
    );
    
    if (exists.documents.length > 0) {
      // Already liked, so return existing document
      return exists.documents[0];
    }
    
    // Create new like
    const like = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.likesCollectionId,
      ID.unique(),
      {
        userId: userId,
        videoId: videoId,
        createdAt: new Date().toISOString()
      }
    );
    
    return like;
  } catch (error) {
    throw new Error(error);
  }
}

// Function to unlike a video
export async function unlikeVideo(userId, videoId) {
  try {
    const likes = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.likesCollectionId,
      [
        Query.equal('userId', userId),
        Query.equal('videoId', videoId)
      ]
    );
    
    if (likes.documents.length === 0) {
      return { success: false, message: 'Like not found' };
    }
    
    const likeId = likes.documents[0].$id;
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.likesCollectionId, 
      likeId
    );
    
    return { success: true };
  } catch (error) {
    throw new Error(error);
  }
}

// Function to check if user has bookmarked a video
export async function isVideoBookmarked(userId, videoId) {
  try {
    const bookmarks = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.bookmarksCollectionId,
      [
        Query.equal('userId', userId),
        Query.equal('videoId', videoId)
      ]
    );
    
    return bookmarks.documents.length > 0;
  } catch (error) {
    console.error("Error checking bookmark status:", error);
    return false;
  }
}

// Function to check if user has liked a video
export async function isVideoLiked(userId, videoId) {
  try {
    const likes = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.likesCollectionId,
      [
        Query.equal('userId', userId),
        Query.equal('videoId', videoId)
      ]
    );
    
    return likes.documents.length > 0;
  } catch (error) {
    console.error("Error checking like status:", error);
    return false;
  }
}

// Function to get all bookmarked videos for a user
export async function getBookmarkedVideos(userId) {
  try {
    const bookmarks = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.bookmarksCollectionId,
      [Query.equal('userId', userId)]
    );
    
    if (bookmarks.documents.length === 0) {
      return [];
    }
    
    // Extract video IDs from bookmarks
    const videoIds = bookmarks.documents.map(bookmark => bookmark.videoId);
    
    // Get video details for all bookmarked videos
    const videos = [];
    for (const videoId of videoIds) {
      try {
        const video = await databases.getDocument(
          appwriteConfig.databaseId,
          appwriteConfig.videoCollectionId,
          videoId
        );
        videos.push(video);
      } catch (error) {
        console.error(`Error fetching video ${videoId}:`, error);
      }
    }
    
    return videos;
  } catch (error) {
    throw new Error(error);
  }
}