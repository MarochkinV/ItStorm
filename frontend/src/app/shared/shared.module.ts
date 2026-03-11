import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { ArticleCardComponent } from './components/article-card/article-card.component';


@NgModule({
  declarations: [
    ArticleCardComponent
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    RouterModule,
    FormsModule,
  ],
  exports: [
    ArticleCardComponent
  ]
})
export class SharedModule {
}
