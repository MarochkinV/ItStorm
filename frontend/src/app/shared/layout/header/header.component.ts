import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isLogged: boolean = false;
  userName: string = '';

  constructor(private authService: AuthService,
              private snackBar: MatSnackBar,
              private userService: UserService,
              private router: Router,) {

    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {

    this.authService.isLogged$.subscribe(isLoggedIn => {
      this.isLogged = isLoggedIn;

      if (isLoggedIn) {
        this.getUserInfo();
      }
    });

    if (this.isLogged) {
      this.getUserInfo();
    }
  }

  getUserInfo(): void {
    this.userService.getUserInfo()
      .subscribe({
        next: (data) => {
          this.userName = data.name;
        },
        error: () => {
          this.snackBar.open('Ошибка получения данных пользователя');
        }
      });
  }

  logout(): void {

    this.authService.logout()
      .subscribe({
        next: () => {
          this.doLogout()
        },

        error: (errorResponse: HttpErrorResponse) => {
          this.doLogout()
        }

      })
  };

  doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this.snackBar.open('Вы вышли из системы');
    this.router.navigate(['/']);
  }
}
