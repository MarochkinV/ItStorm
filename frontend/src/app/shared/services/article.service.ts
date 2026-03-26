import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {ArticleType} from "../../../types/article.type";
import {ArticleInsideType} from "../../../types/article-inside.type";

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) {
  }

  getPopArticles(): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/top');
  }

  getRelatedArticles(url:string): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/related/' + url);
  }

  getArticles(page: number = 1, categories?: string[]): Observable<{
    count: number,
    pages: number,
    items: ArticleType[]
  }> {
    let params = new HttpParams().set('page', page.toString());

    if (categories && categories.length > 0) {
      categories.forEach(category => {
        params = params.append('categories[]', category);
      });
    }

    return this.http.get<{ count: number, pages: number, items: ArticleType[] }>(
      environment.api + 'articles',
      {params}
    );
  }

  getArticle(url:string): Observable<ArticleInsideType> {
    return this.http.get<ArticleInsideType>(environment.api + 'articles/' + url);
  }
}
