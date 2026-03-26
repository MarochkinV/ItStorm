import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";
import {ArticleService} from "../../../shared/services/article.service";
import {ActivatedRoute} from "@angular/router";
import {ArticleInsideType} from "../../../../types/article-inside.type";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-reading',
  templateUrl: './reading.component.html',
  styleUrls: ['./reading.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class ReadingComponent implements OnInit {

  articles: ArticleType[] = [];
  article!: ArticleInsideType;
  serverStaticPath = environment.serverStaticPath;


  constructor(private articleServices: ArticleService,
              private activatedRoute: ActivatedRoute,) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {

      const url = params['url'];

      this.articleServices.getArticle(url)
        .subscribe((data: ArticleInsideType) => {
          this.article = data;
        });

      this.articleServices.getRelatedArticles(url)
        .subscribe((data: ArticleType[]) => {
          this.articles = data;
        });

    });

  }

}
