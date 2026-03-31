import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NavigationEnd, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {filter} from "rxjs/operators";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLogged: boolean = false;
  userName: string = '';
  activeFragment: string = '';
  private subscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private router: Router
  ) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {
    this.authService.isLogged$
      .subscribe(isLoggedIn => {
        this.isLogged = isLoggedIn;
        if (isLoggedIn) {
          this.getUserInfo();
        }
      });

    if (this.isLogged) {
      this.getUserInfo();
    }

    this.subscription.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      )
        .subscribe((): void => {
          this.updateActiveFragment();
        })
    );
    this.updateActiveFragment();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  updateActiveFragment(): void {
    const fragment = this.router.parseUrl(this.router.url).fragment;
    this.activeFragment = fragment || '';
  }

  getUserInfo(): void {
    this.userService.getUserInfo()
      .subscribe({
        next: (data): void => {
          this.userName = data.name;
        },
        error: (): void => {
          this.snackBar.open('Ошибка получения данных пользователя');
        }
      });
  }

  logout(): void {
    this.authService.logout()
      .subscribe({
        next: (): void => {
          this.doLogout()
        },
        error: (errorResponse: HttpErrorResponse): void => {
          this.doLogout()
        }
      });
  }

  doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this.snackBar.open('Вы вышли из системы');
    this.router.navigate(['/']);
  }

  isActive(fragment: string): boolean {
    return this.activeFragment === fragment;
  }
}
