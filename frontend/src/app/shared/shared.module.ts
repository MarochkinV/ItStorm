import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { ArticleCardComponent } from './components/article-card/article-card.component';
import { UiModalComponent } from './components/ui-modal/ui-modal.component';
import { LoaderComponent } from './components/loader/loader.component';


@NgModule({
  declarations: [
    ArticleCardComponent,
    UiModalComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    RouterModule,
    FormsModule,
  ],
  exports: [
    ArticleCardComponent,
    UiModalComponent,
    LoaderComponent
  ]
})
export class SharedModule {
}
