export type CommentType = {
  allCount: number,
  comments: CommentItemType[]
}

export type CommentItemType = {
  id: string,
  text: string,
  date: string,
  likesCount: number,
  dislikesCount: number,
  user: {
    id: string,
    name: string,
  }
}

export type CommentActionType = {
  comment: string;
  action: 'like' | 'dislike' | 'violation';
}


