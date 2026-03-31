import {Component, ElementRef, HostListener, OnInit} from "@angular/core";
import {CategoryType} from "../../../../types/category.type";
import {CategoryService} from "../../../shared/services/category.service";
import {ArticleService} from "../../../shared/services/article.service";
import {ArticleType} from "../../../../types/article.type";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  articles: ArticleType[] = [];
  categories: CategoryType[] = [];
  selectedCategories: CategoryType[] = [];
  isSortingOpen: boolean = false;
  pages: number[] = [];
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(
    private articleService: ArticleService,
    private categoryService: CategoryService,
    private el: ElementRef
  ) {
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    const clickedInside = this.el.nativeElement.querySelector('.blog-sorting').contains(event.target);
    if (!clickedInside && this.isSortingOpen) {
      this.isSortingOpen = false;
    }
  }

  ngOnInit(): void {
    this.categoryService.getCategories()
      .subscribe((categories: CategoryType[]): void => {
        this.categories = categories;
      });
    this.loadArticles();
  }

  loadArticles(): void {
    const categoryUrls = this.selectedCategories.map(cat => cat.url);
    this.articleService.getArticles(this.currentPage, categoryUrls)
      .subscribe({
        next: (data): void => {
          this.pages = [];
          this.totalPages = data.pages;
          for (let i = 1; i <= data.pages; i++) {
            this.pages.push(i);
          }
          this.articles = data.items;
        }
      });
  }

  toggleSorting() {
    this.isSortingOpen = !this.isSortingOpen;
  }

  toggleCategory(category: CategoryType): void {
    const index: number = this.selectedCategories.findIndex(c => c.id === category.id);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(category);
    }
    this.currentPage = 1;
    this.loadArticles();
  }

  removeCategory(category: CategoryType): void {
    this.selectedCategories = this.selectedCategories.filter(c => c.id !== category.id);
    this.currentPage = 1;
    this.loadArticles();
  }

  isCategorySelected(category: CategoryType): boolean {
    return this.selectedCategories.some(c => c.id === category.id);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadArticles();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadArticles();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadArticles();
    }
  }
}
