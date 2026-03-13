import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticleRoutingModule } from './article-routing.module';
import { BlogComponent } from './blog/blog.component';
import { ReadingComponent } from './reading/reading.component';
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
    BlogComponent,
    ReadingComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ArticleRoutingModule
  ]
})
export class ArticleModule { }
