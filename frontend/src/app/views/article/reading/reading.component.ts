import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";
import {ArticleService} from "../../../shared/services/article.service";
import {ActivatedRoute} from "@angular/router";
import {ArticleInsideType,} from "../../../../types/article-inside.type";
import {environment} from "../../../../environments/environment";
import {CommentActionType, CommentType} from "../../../../types/comment.type";
import {CommentService} from "../../../shared/services/comment.service";
import {delay, Subscription} from "rxjs";
import {AuthService} from "../../../core/auth/auth.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-reading',
  templateUrl: './reading.component.html',
  styleUrls: ['./reading.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class ReadingComponent implements OnInit, OnDestroy {

  articles: ArticleType[] = [];
  article!: ArticleInsideType;
  serverStaticPath: string = environment.serverStaticPath;
  allCount: number = 0;
  isLogged: boolean = false;
  userActions: CommentActionType[] = [];
  commentText: string = '';
  readonly initialCommentsCount: number = 3;
  isCommentsLoading: boolean = false;
  private authSubscription: Subscription | null = null;

  constructor(private articleServices: ArticleService,
              private activatedRoute: ActivatedRoute,
              private commentService: CommentService,
              private authService: AuthService,
              private _snackBar: MatSnackBar) {
    this.isLogged = this.authService.getIsLoggedIn();
  }


  ngOnInit(): void {
    this.authSubscription = this.authService.isLogged$
      .subscribe((isLogged: boolean): void => {
        this.isLogged = isLogged;
      });

    this.activatedRoute.params
      .subscribe(params => {
        const url = params['url'];

        this.articleServices.getArticle(url)
          .subscribe((data: ArticleInsideType): void => {
            this.article = data;
            this.commentService.getComments(this.article.id)
              .subscribe((commentData: CommentType): void => {
                this.allCount = commentData.allCount;

                if (commentData.comments) {
                  this.article.comments = commentData.comments
                    .slice(0, this.initialCommentsCount);
                }

                if (this.isLogged) {
                  this.commentService.getArticleCommentActions(this.article.id)
                    .subscribe((actions: CommentActionType[]): void => {
                      if (actions && actions.length > 0) {
                        this.userActions = actions;
                      }
                    });
                }
              });
          });

        this.articleServices.getRelatedArticles(url)
          .subscribe((data: ArticleType[]): void => {
            this.articles = data;
          });
      });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  getUserAction(commentId: string): string | undefined {
    const actionObject = this.userActions.find(item => item.comment === commentId);
    return actionObject ? actionObject.action : undefined;
  }

  postComment(): void {
    if (this.commentText.trim()) {
      this.commentService.addComment(this.commentText, this.article.id)
        .subscribe((data: DefaultResponseType): void => {
          if (!data.error) {
            this.commentText = '';
            this.loadComments();
          }
        });
    }
  }


  addReaction(commentId: string, action: string): void {
    if (!this.isLogged || !this.article?.comments) return;

    if (action === 'violate') {
      this.sendViolation(commentId);
      return;
    }

    this.commentService.applyAction(commentId, action)
      .subscribe({
        next: (data: DefaultResponseType): void => {
          if (!data.error) {
            const comment = this.article.comments!.find(c => c.id === commentId);
            if (comment) {
              const existingActionIndex: number = this.userActions.findIndex(a => a.comment === commentId);
              const previousAction = existingActionIndex > -1 ? this.userActions[existingActionIndex].action : null;


              if (previousAction === 'like' && action === 'dislike') {
                comment.likesCount--;
                comment.dislikesCount++;
              } else if (previousAction === 'dislike' && action === 'like') {
                comment.dislikesCount--;
                comment.likesCount++;
              } else if (!previousAction) {
                if (action === 'like') comment.likesCount++;
                if (action === 'dislike') comment.dislikesCount++;
              }


              if (existingActionIndex > -1) {
                this.userActions[existingActionIndex].action = action as any;
              } else {
                this.userActions.push({comment: commentId, action: action as any});
              }
            }

            this._snackBar.open('Ваш голос учтен', undefined, {duration: 3000});
          }
        }
      });
  }

  loadMoreComments(): void {
    if (this.article && this.article.comments && this.article.comments.length < this.allCount) {
      this.isCommentsLoading = true;

      const offset: number = this.article.comments.length;

      this.commentService.getComments(this.article.id, offset)
        .pipe(
          delay(2000) //задержка для тестирования лоадера
        )
        .subscribe({
          next: (commentData: CommentType): void => {
            const existingComments = this.article.comments || [];
            this.article.comments = [...existingComments, ...commentData.comments];
            this.allCount = commentData.allCount;
            this.isCommentsLoading = false;
          },
          error: (): void => {
            this.isCommentsLoading = false;
          }
        });
    }
  }

  sendViolation(commentId: string): void {
    this.commentService.applyAction(commentId, 'violate')
      .subscribe({
        next: (data: DefaultResponseType): void => {
          if (data && !data.error) {
            this._snackBar.open('Жалоба отправлена', undefined, {duration: 3000});
          }
        },
        error: (errorResponse: any): void => {
          if (errorResponse.status === 400) {
            this._snackBar.open('Жалоба уже отправлена', undefined, {duration: 3000});
          } else {
            this._snackBar.open('Ошибка при отправке жалобы', undefined, {duration: 3000});
          }
        }
      });
  }

  private loadComments(): void {
    this.commentService.getComments(this.article.id)
      .subscribe((commentData: CommentType): void => {
        if (commentData.comments) {
          this.article.comments = commentData.comments.slice(0, this.initialCommentsCount);
        }
        this.allCount = commentData.allCount;
      });
  }

}
