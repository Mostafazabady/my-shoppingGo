import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForgetPasswordService {

  constructor(private _HttpClient:HttpClient) { }


  basUrl = `https://ecommerce.routemisr.com/api/v1/auth/`


  forgetPassword(userEmail:object):Observable<any>{
    return this._HttpClient.post(this.basUrl + `forgotPasswords`, userEmail)
  }
  resetCode(newCode:object):Observable<any>{
    return this._HttpClient.post(this.basUrl + `verifyResetCode`, newCode)
  }
  newPassword(userPasswordForm:object):Observable<any>{
    return this._HttpClient.put(this.basUrl + `resetPassword`, userPasswordForm)
  }
}
