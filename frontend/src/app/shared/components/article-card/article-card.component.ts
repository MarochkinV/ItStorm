import {Component, Input, OnInit} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent implements OnInit {
  @Input() article!: ArticleType;
  isDescriptionExpanded = false;
  descriptionLimit = 220;

  serverStaticPath = environment.serverStaticPath;

  constructor() { }

  ngOnInit(): void {
  }

  get truncatedDescription(): string {
    if (!this.article?.description) return '';
    if (this.isDescriptionExpanded) {
      return this.article.description;
    }
    if (this.article.description.length > this.descriptionLimit) {
      return this.article.description.substring(0, this.descriptionLimit);
    }
    return this.article.description;
  }

  shouldShowToggle(): boolean {
    return this.article?.description?.length > this.descriptionLimit;
  }

  toggleDescription(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }

    if (this.shouldShowToggle()) {
      this.isDescriptionExpanded = !this.isDescriptionExpanded;
    }
  }
}
