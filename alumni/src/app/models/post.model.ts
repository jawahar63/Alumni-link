export interface User {
  profileImage?: string;
  username?: string;
  batch?: string;
  domain?: string;
  company?: string;
  _id?:string;
}

export interface Media {
  type: 'image' | 'video'; // Adjust types based on your needs
  url: string;
}

export interface Comment {
  commenter: {
    _id:string;
    username: string;
    profileImage: string;
  };
  _id:string
  text: string;
  createdAt?: Date;
  isCommentEditable?:boolean;
  isCommentDeleteable?:boolean;
  showMenu?:boolean;
  isEditing?:boolean;
  editedText:string;
}
export interface like {
  liker: {
    _id:string;
    username: string;
    profileImage: string;
  };
  likedAt?: Date;
}

export interface Post {
  _id: string;
  author: User;
  caption: string;
  tags: string[];
  location?: string;
  media: Media[];
  comments: Comment[];
  likes: like[]; // Array of user IDs who liked the post
  createdAt: Date;
  updatedAt: Date;
  showComments?: boolean;
  showLikes?:boolean;
  showMenu?:boolean;
  showShare?:boolean;
  isLiked?:boolean; 
  showCommentMenu?:boolean;
}
