import {Component, OnInit} from '@angular/core';
import {filter} from "rxjs/operators";
import {NavigationEnd, Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  activeFragment: string = '';
  private subscription: Subscription = new Subscription();

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.subscription.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        this.updateActiveFragment();
      })
    );

    this.updateActiveFragment();
  }

  updateActiveFragment(): void {
    const fragment = this.router.parseUrl(this.router.url).fragment;
    this.activeFragment = fragment || '';
  }

  isActive(fragment: string): boolean {
    return this.activeFragment === fragment;
  }
}
