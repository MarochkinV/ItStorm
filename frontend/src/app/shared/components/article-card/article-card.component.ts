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
    const desc = this.article?.description;
    if (!desc) return '';

    if (this.isDescriptionExpanded || desc.length <= this.descriptionLimit) {
      return desc;
    }
    return desc.substring(0, this.descriptionLimit);
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
