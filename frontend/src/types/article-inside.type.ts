import { CommentItemType } from "./comment.type";

export type ArticleInsideType = {
  id: string,
  title: string,
  description: string,
  text: string,
  image: string,
  date: string,
  category: string,
  url: string,
  commentsCount: number,
  comments?: CommentItemType[]
}
