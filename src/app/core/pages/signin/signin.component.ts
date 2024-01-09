import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { checkStrongPassword } from '../../../shared/directives/checkStrongPassword.directive';
import {
  UserAuthLoginResponse,
  UserSigninData,
  UserAuthErrorResponse,
} from '../../../shared/models/userAuth.model';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
})
export class SigninComponent implements OnInit {
  isLogged = false;
  isButtonDisabled = false;
  responseMessage = '';
  lastSubmitedEmail = '';
  lastSubmitedPassword = '';
  emailVal = '';
  passwordVal = '';
  isDisabled$ = new BehaviorSubject(false);

  signinForm = new FormGroup({
    email: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(
        /^[a-zA-Z0-9.!#$%&’*+/=?^_{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      ),
    ]),
    password: new FormControl<string>('', [
      Validators.required,
      checkStrongPassword(8),
    ]),
  });

  constructor(
    public authService: AuthService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public location: Location
  ) {
    this.isLogged = authService.isLoggedIn;
  }

  ngOnInit(): void {
    this.logEmailChange();
    this.logPasswordChange();
  }

  logEmailChange() {
    const emailControl = this.signinForm.get('email');
    emailControl?.valueChanges.forEach((value) => {
      this.emailVal = String(value);
      console.log('this.emailVal', this.emailVal);
      if (this.lastSubmitedEmail !== this.emailVal) {
        this.isButtonDisabled = false;
      }
    });
  }

  logPasswordChange() {
    const passwordControl = this.signinForm.get('password');
    passwordControl?.valueChanges.forEach((value) => {
      this.passwordVal = String(value);
      console.log('this.emailVal', this.passwordVal);
      if (this.lastSubmitedPassword !== this.passwordVal) {
        this.isButtonDisabled = false;
      }
    });
  }

  formSubmit() {
    if (
      this.signinForm.value.email !== null &&
      this.signinForm.value.password !== null
    ) {
      if (this.signinForm.value.email === this.lastSubmitedEmail) {
        this.isButtonDisabled = true;
        this.responseMessage = 'Email still the same';
        return;
      }
      this.isButtonDisabled = true;
      this.authService
        .signin(this.signinForm.value as UserSigninData)
        .subscribe((resp) => {
          console.log('resp', resp);
          if (!(resp as UserAuthLoginResponse)?.token) {
            const error: UserAuthErrorResponse = (resp as HttpErrorResponse)
              .error;
            this.responseMessage =
              error?.message || (resp as UserAuthErrorResponse)?.message;
            this.isButtonDisabled = false;
            if (error?.type === 'NotFoundException') {
              this.isButtonDisabled = true;
            }
            return;
          }
          if (resp && (resp as UserAuthLoginResponse).token) {
            this.authService.signinAction(resp as UserSigninData);
            localStorage.setItem('response', JSON.stringify(resp));
            localStorage.setItem(
              'userEmail',
              JSON.stringify(this.signinForm.value.email)
            );
            let lsData: boolean;
            const storageData = new Promise((resolve, reject) => {
              let timerId: typeof setTimeout | number | undefined;

              const repeat = () => {
                lsData = !!(
                  localStorage.getItem('response') &&
                  localStorage.getItem('userEmail')
                );
                if (lsData) {
                  resolve(true);
                } else {
                  clearTimeout(timerId as number);
                  timerId = window.setTimeout(() => {
                    repeat();
                  }, 500);
                }
              };
              repeat();
            });
            this.responseMessage = 'Successfull';
            storageData.then((data) => {
              console.log('data', data);
              if (data) {
                window.setTimeout(() => {
                  this.router.navigate(['/']);
                }, 1200);
              }
            });
          }
        });
    }
  }

  logout() {
    this.authService.logout();
    this.isLogged = false;
  }
  toSignUpPage() {
    this.router.navigateByUrl('/signup');
  }

  isTrue$ = this.isDisabled$.subscribe({
    next: (val) => {
      return (
        this.isButtonDisabled === true &&
        (this.signinForm.value.email === this.lastSubmitedEmail ||
          this.signinForm.value.password === this.lastSubmitedPassword)
      );
    },
  });
}
