import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from "../../../environments/environment";
import {CommentActionType, CommentType} from "../../../types/comment.type";
import {DefaultResponseType} from "../../../types/default-response.type";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) {
  }

  getComments(articleId: string, offset: number = 0): Observable<CommentType> {
    const limit = offset === 0 ? 3 : 10;
    const params = new HttpParams()
      .set('offset', offset.toString())
      .set('limit', limit.toString())
      .set('article', articleId);
    return this.http.get<CommentType>(environment.api + 'comments', {params});
  }

  getArticleCommentActions(articleId: string): Observable<CommentActionType[]> {
    const params = new HttpParams().set('articleId', articleId);
    return this.http.get<CommentActionType[]>(`${environment.api}comments/article-comment-actions`, {params});
  }

  addComment(text: string, articleId: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + "comments", {
      text,
      article: articleId
    });
  }

  applyAction(commentId: string, action: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(
      `${environment.api}comments/${commentId}/apply-action`,
      { action }
    );
  }
}

