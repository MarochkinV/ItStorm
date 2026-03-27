import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticleRoutingModule } from './article-routing.module';
import { BlogComponent } from './blog/blog.component';
import { ReadingComponent } from './reading/reading.component';
import {SharedModule} from "../../shared/shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    BlogComponent,
    ReadingComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ArticleRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ArticleModule { }
