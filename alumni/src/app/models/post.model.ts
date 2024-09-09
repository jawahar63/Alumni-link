export interface User {
  profileImage: string;
  name: string;
  batch?: string;
  domain?: string;
  company?: string;
}

export interface Media {
  type: 'image' | 'video'; // Adjust types based on your needs
  url: string;
}

export interface Comment {
  author: User;
  text: string;
  createdAt?: Date;
}

export interface Post {
  id: string;
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
