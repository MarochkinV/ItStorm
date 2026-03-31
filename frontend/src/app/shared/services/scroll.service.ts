import {Inject, Injectable} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {DOCUMENT} from '@angular/common';
import {filter} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((): void => {
        const fragment: string | null = this.router.parseUrl(this.router.url).fragment;
        if (fragment) {
          setTimeout((): void => {
            const element: HTMLElement | null = this.document.getElementById(fragment);
            if (element) {
              element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }
          }, 100);
        }
      });
  }
}
