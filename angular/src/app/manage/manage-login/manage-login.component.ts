import { Component,} from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'manage-login',
  templateUrl: './manage-login.component.html',
  styleUrls: ['./manage-login.component.css'],
})
export class ManageLoginComponent  {

  public user = {
    family_name: '',
    first_name: '',
    password: '',
    manage: true,
  };
  public status = 0;
  public hideWarnMsg = false;
  public showPassword = false;

  constructor(
    private loginService: LoginService,
    public router: Router,
  ) {}

  public login() {
    this.hideWarnMsg = false;
    this.loginService.login(this.user)
    .then(res => this.router.navigate(['/manageQuestion']))
    .catch(err => {
      // ログイン失敗時
      this.status = err.status;
    });
  }

}
