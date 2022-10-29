import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { OnInit, Component, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, AfterViewInit {

  constructor(
    private loginService: LoginService,
  ){}

  public user = {
    family_name: '',
    first_name: '',
    password: '',
    manage: false,
  };
  public status = 0;
  public hideWarnMsg = false;
  public showPassword = false;
  public isWindowNarrow = false;
  public leftWidth = '';
  public topHeight = '';
  private flowerAnC: any;
  private flowerAn1: any;
  private flowerAn2: any;
  private btmMessageAn: any;
  public loaded = false;

  @Output() postLogin = new EventEmitter();

  ngOnInit() {
    gsap.registerPlugin(ScrollTrigger);
    this.isWindowNarrow = (window.innerWidth <= 767 || navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('Android') > 0);
    const harfFlowerWidth = this.isWindowNarrow ? 350 : 360;
    this.leftWidth = String(document.documentElement.clientWidth / 2 - harfFlowerWidth) + 'px';
    this.topHeight = String(document.documentElement.clientHeight / 2 - harfFlowerWidth) + 'px';
    this.initAnimation();
  }

  ngAfterViewInit(): void {
    this.loaded = true;
  }

  public login() {
    this.loaded = false;
    this.flowerAnC.pause();
    this.flowerAn1.pause();
    this.flowerAn2.pause();
    this.btmMessageAn.pause();
    this.hideWarnMsg = false;
    this.status = 0;
    if (!this.user.family_name || !this.user.first_name || !this.user.password) {
      this.status = 4;
      this.loaded = true;
      return;
    }
    this.loginService.login(this.user)
    .then(res => {
      this.loaded = true;
      this.afterLogin();
    })
    .catch(err => {
      // ログイン失敗時
      this.loaded = true;
      this.status = err.status;
    });
  }

  private onConplete(): any{
    this.postLogin.emit();
  }

  private initAnimation() {
    this.flowerAnC = gsap.to('.lfloat-circle', {
      repeat: -1,
      rotation: 360,
      duration: 150,
      ease: "none"
    });
    this.flowerAn1 = gsap.to('.rotate1', {
      rotation: 360,
      duration: 40,
      repeat: -1,
      ease: "none"
    });
    this.flowerAn2 = gsap.to('.rotate2', {
      rotation: -360,
      duration: 40,
      repeat: -1,
      ease: "none"
    });

    this.btmMessageAn = gsap.to('.btm-message', {
      y: 10,
      duration: 1,
      yoyo: true,
      repeat: -1,
    })
  }

  private afterLogin() {
    // フォームフェードアウト
    gsap.timeline()
    .to('.form', {
      opacity: 0,
      duration: 2,
      scale: 0
    }).to('.lfloat', {
      opacity: 0,
      scale: 1.5,
      duration: 3,
    }, '-=2')
    .to('.content-area', {
      opacity: 0,
      duration: 3,
      zIndex: 50,
      onComplete: () => this.onConplete()
    },'-=2').to('.lfloatSf1', {
      y: window.innerHeight,
      duration: 6,
      stagger: 0.1,
    }, '-=5')
    .to('.lfloatSf1', {
      x: 10
    }, '-=4').to('.lfloatSf1', {
      x: -10,
    }, '-=2');
  }

}
