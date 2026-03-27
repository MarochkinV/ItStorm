import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";
import {ArticleService} from "../../../shared/services/article.service";
import {ActivatedRoute} from "@angular/router";
import {ArticleInsideType,} from "../../../../types/article-inside.type";
import {environment} from "../../../../environments/environment";
import {CommentActionType, CommentType} from "../../../../types/comment.type";
import {CommentService} from "../../../shared/services/comment.service";
import {Subscription} from "rxjs";
import {AuthService} from "../../../core/auth/auth.service";
import {DefaultResponseType} from "../../../../types/default-response.type";

@Component({
  selector: 'app-reading',
  templateUrl: './reading.component.html',
  styleUrls: ['./reading.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class ReadingComponent implements OnInit, OnDestroy {

  articles: ArticleType[] = [];
  article!: ArticleInsideType;
  serverStaticPath = environment.serverStaticPath;
  allCount: number = 0;
  isLogged: boolean = false;
  userActions: CommentActionType[] = [];
  private authSubscription: Subscription | null = null;
  commentText: string = '';
  showAllComments: boolean = false;
  readonly initialCommentsCount: number = 3;



  constructor(private articleServices: ArticleService,
              private activatedRoute: ActivatedRoute,
              private commentService: CommentService,
              private authService: AuthService,) {
    this.isLogged = this.authService.getIsLoggedIn();
  }


  ngOnInit(): void {



    this.authSubscription = this.authService.isLogged$.subscribe((isLogged: boolean) => {
      this.isLogged = isLogged;
    });

    this.activatedRoute.params.subscribe(params => {
      const url = params['url'];

      this.articleServices.getArticle(url).subscribe((data: ArticleInsideType) => {
        this.article = data;
        this.commentService.getComments(this.article.id).subscribe((commentData: CommentType) => {
          this.article.comments = commentData.comments;
          this.allCount = commentData.allCount;
          if (this.isLogged) {
            this.commentService.getArticleCommentActions(this.article.id).subscribe((actions: CommentActionType[]) => {
              if (actions && actions.length > 0) {
                this.userActions = actions;
              }
            });
          }
        });
      });

      this.articleServices.getRelatedArticles(url).subscribe((data: ArticleType[]) => {
        this.articles = data;
      });
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  getUserAction(commentId: string): string | undefined {
    const actionObject = this.userActions.find(item => item.comment === commentId);
    console.log(`Проверка ID: ${commentId}, Найдено:`, actionObject?.action);
    return actionObject ? actionObject.action : undefined;
  }

  postComment(): void {
    if (this.commentText.trim()) {
      this.commentService.addComment(this.commentText, this.article.id)
        .subscribe((data: DefaultResponseType) => {
          if (!data.error) {
            this.commentText = '';
            this.loadComments();
          }
        });
    }
  }


  addReaction(commentId: string, action: string): void {
    if (!this.isLogged || !this.article?.comments) return;

    this.commentService.applyAction(commentId, action).subscribe({
      next: (data: DefaultResponseType) => {
        if (!data.error) {
          const comment = this.article.comments!.find(c => c.id === commentId);
          if (comment) {
            const existingActionIndex = this.userActions.findIndex(a => a.comment === commentId);
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
              this.userActions.push({ comment: commentId, action: action as any });
            }
          }
        }
      }
    });
  }

  private loadComments(): void {
    this.commentService.getComments(this.article.id).subscribe((commentData: CommentType) => {
      this.article.comments = commentData.comments;
      this.allCount = commentData.allCount;
    });
  }

  toggleComments(): void {
    this.showAllComments = !this.showAllComments;
  }

}
