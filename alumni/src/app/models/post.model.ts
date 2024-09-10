export interface User {
  profileImage?: string;
  username?: string;
  batch?: string;
  domain?: string;
  company?: string;
  user?:string;
}

export interface Media {
  type: 'image' | 'video'; // Adjust types based on your needs
  url: string;
}

export interface Comment {
  commenter: {
    username: string;
    profileImage: string;
  };
  text: string;
  createdAt?: Date;
}

export interface Post {
  _id: string;
  author: User;
  caption: string;
  tags: string[];
  location?: string;
  media: Media[];
  comments: Comment[];
  likes: string[]; // Array of user IDs who liked the post
  createdAt: Date;
  updatedAt: Date;
  showComments?: boolean; // Optional field to control the display of comments
}
