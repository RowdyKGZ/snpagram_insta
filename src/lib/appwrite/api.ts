import { ID } from "appwrite";

import { INewPost, INewUser } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";

type UserType = {
  accountId: string;
  name: string;
  email: string;
  imageUrl: URL;
  username?: string;
};

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw new Error();

    const avatarUrl = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      imageUrl: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function saveUserToDB(user: UserType) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );

    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password);

    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function createPost(post: INewPost) {
  try {
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw Error;

    const fileUrl = getPreview(uploadedFile.$id);

    if (!fileUrl) {
      deleteFile(uploadedFile.$id);
      throw Error;
    }

    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags,
      }
    );

    if (!newPost) {
      deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error);
  }
}

export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

export async function getPreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100
    );

    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { statas: "Ok" };
  } catch (error) {
    console.log(error);
  }
}
