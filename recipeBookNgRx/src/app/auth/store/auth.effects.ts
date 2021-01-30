import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { API } from 'src/environments/api.service';

import * as AuthActions from './auth.actions';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuthentication = (
  email: string,
  userId: string,
  token: string,
  expiresIn: number
) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);

  return new AuthActions.AuthenticateSuccess({
    email,
    userId,
    token,
    expirationDate,
  });
};

const handleError = (errorRes: any) => {
  console.log('errorRes', errorRes);

  let errorMessage = 'An unknown error occurred!';

  if (!errorRes.error || !errorRes.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }

  switch (errorRes.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email already exists';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'This email does not exist';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'Incorrect password';
      break;
  }

  return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {
  apiKey = this.api.apikey;

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) => {
      console.log('signupAction', signupAction);
      return this.http
        .post<AuthResponseData>(
          `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`,
          {
            email: signupAction.payload.email,
            password: signupAction.payload.password,
            returnSecureToken: true,
          }
        )
        .pipe(
          map((resData) => {
            console.log(resData);

            return handleAuthentication(
              resData.email,
              resData.localId,
              resData.idToken,
              +resData.expiresIn
            );
          }),
          catchError((errorRes) => {
            console.log(errorRes);

            return handleError(errorRes);
          })
        );
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      console.log(authData);

      return this.http
        .post<AuthResponseData>(
          `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`,
          {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true,
          }
        )
        .pipe(
          map((resData) => {
            console.log(resData);

            console.log(resData);

            return handleAuthentication(
              resData.email,
              resData.localId,
              resData.idToken,
              +resData.expiresIn
            );
          }),
          catchError((errorRes) => {
            console.log(errorRes);

            return handleError(errorRes);
          })
        );
    })
  );

  @Effect({ dispatch: false })
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS, AuthActions.LOGOUT),
    tap(() => {
      console.log('authRedirect');
      this.router.navigate(['/']);
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private api: API,
    private router: Router
  ) {}
}
