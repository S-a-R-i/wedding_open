import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { OnInit, Component, AfterViewInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { DataService } from '../services/data.service';
import { CommonService } from '../services/common.service';
import { LoginComponent } from '../login/login.component';
import { ContentChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChangePwComponent } from './change-pw/change-pw.component';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit, AfterViewInit {
  public loginUserId = '';
  public loginUserName = '';
  public eventId = '';
  public isAdmin = false;
  private topTitleTl: any;
  private img1Tl: any;
  private img2Tl: any;
  private preScrollTop = 0;
  public isOnlyReport = false;
  public isTest = false;
  public eventData: any;
  public questionData: any;
  public ansWayLists: any = [];
  public userForm = {
    attend_flag: true,
    comment: '',
  }
  public status = '';
  public isAttendData: any;
  public aftSendMessage = '';
  public dispUserMenu = false;
  public closeMenuFlag = false;
  public isWindowNarrow = false;

  public zoom = 16;
  public mapWidth = '';
  public mapHeight = '';
  public options: google.maps.MapOptions = {
    disableDefaultUI: true
  };

  constructor(
    private loginService: LoginService,
    private dataService: DataService,
    private commonService: CommonService,
    public matDialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
  ){
    this.loginUserId = this.loginService.getUserId();
    this.loginUserName = this.loginService.getUserName();
    this.isAdmin = this.loginService.isAdminRole();
    this.eventId = this.loginService.getEventId();
  }

  @ContentChild(LoginComponent)
  loginComponent!: LoginComponent;

  ngOnInit() {
    document.addEventListener('touchmove', this.noScroll, {passive: false});
    document.addEventListener('wheel', this.noScroll, {passive: false});
    this.isWindowNarrow = (window.innerWidth <= 767 || navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('Android') > 0);
    this.closeMenuFlag = this.isWindowNarrow;
    gsap.registerPlugin(ScrollTrigger);

    this.route.queryParams.subscribe((params) => {
      this.isOnlyReport = params['onlyRepo'] ? params['onlyRepo'] : false;
      this.isTest = params['isTest'] ? params['isTest'] : false;
    });

    if (this.isTest && !this.isOnlyReport) {
      // テストイベント参加ユーザーとしてセット(ポートフォリオ確認用)
      this.loginUserId = 'UQvuVU3YUg';
      this.loginUserName = 'テストイベントユーザー';
      this.eventId = 'EXckAc7RpD';
    }

    if (this.loginUserId || this.isOnlyReport) {
      document.removeEventListener('touchmove', this.noScroll);
      document.removeEventListener('wheel', this.noScroll);
      this.initAnimation();
      if (this.loginUserId) {
        this.getDatas();
      }
    }
  }

  noScroll(e: any){
    e.preventDefault();
  }

  ngAfterViewInit(): void {
   this.afterViewInitAnimation();
  }

  postLogin() {
    this.loginUserId = this.loginService.getUserId();
    this.loginUserName = this.loginService.getUserName();
    this.isAdmin = this.loginService.isAdminRole();
    this.eventId = this.loginService.getEventId();

    document.removeEventListener('touchmove', this.noScroll);
    document.removeEventListener('wheel', this.noScroll);
    this.initAnimation();
    this.getDatas();
  }

  private changePxToRem(px: number): number{
    var fontSize = getComputedStyle(document.documentElement).fontSize;
    return px / parseFloat(fontSize);
  }

  private getDatas() {
    this.dataService.getData('m_event/getMainDatas', { event_id: this.eventId, user_id: this.loginUserId }, true)
    .then((res) => {
      this.eventData = res.event;
      this.questionData = res.m_question;
      const ansQuestionData = res.t_question ? res.t_question : null ;
      this.isAttendData = res.attend ? res.attend : null;
      if (this.isAttendData.user_id) {
        this.status = 'clicked';
        this.setAftSendMessage();
        this.userForm.attend_flag = this.isAttendData.attend_flag;
        this.userForm.comment = this.isAttendData.comment
      }

      // ansWay：選択肢のリスト設定
      res.ansWay.forEach((way: any) => {
        this.questionData.forEach((ques: { question_no: number; list: any; answer: string }) => {
          const question_no = ('0' + String(ques.question_no)).slice(-2);
          if (way[0].cls_2 === question_no) {
            ques.list = way;
          }
        });
      });

      // 回答初期値のセット
      this.questionData.forEach((ques: { question_no: number; answer: string; }) => {
        if (ansQuestionData) {
          ansQuestionData.forEach((aQues: { question_no: number; answer: string; }) => {
            if (!ques.answer) {
              if (ques.question_no === aQues.question_no) {
                ques.answer = aQues.answer;
              } else {
                ques.answer = '';
              }
            }
          });
        } else {
          ques.answer = '';
        }
      });

      // event：google mapの設定
      let center: google.maps.LatLngLiteral = {lat: 0,lng: 0};
      this.eventData.forEach((event: any) => {
        center.lat = parseFloat(event.latitude);
        center.lng = parseFloat(event.longitude);
        event.center = center;
      });
    });
  }

  public sendAns() {
    const param = {
      user_id: this.loginUserId,
      attend_flag: this.userForm.attend_flag,
      comment: this.userForm.comment,
      question_data: this.questionData
    }
    this.dataService.postData('t_attend/sendAns', param, true)
    .then((res) => {
      if (res) {
        this.setAftSendMessage();
      }
    })
  }

  public setAftSendMessage() {
    this.aftSendMessage = 'ご回答ありがとうございました。';
  }

  public dispForm() {
    this.aftSendMessage = '';
  }

  public toPageScroll(elem: string) {
    const element = document.querySelector(elem) as HTMLElement;
    element.scrollIntoView({behavior: 'smooth'});
  }

  public onMessageIntersection(target: any) {
    // messageエリアが上がってきたらトップのアニメーションを停止する
    const curScrollTop = document.documentElement.scrollTop;
    if (this.topTitleTl && this.img1Tl && this.img2Tl) {
      if (this.preScrollTop < curScrollTop) {
        // down
        this.topTitleTl.pause();
        this.img1Tl.pause();
        this.img2Tl.pause();
      } else {
        // up
        this.topTitleTl.resume();
        this.img1Tl.resume();
        this.img2Tl.resume();
      }
      this.preScrollTop = curScrollTop;
    }
  }

  // mapのサイズを決定する
  eventDetailIntersection(target: any) {
    if (target.visible && (!this.mapWidth || !this.mapHeight )) {
      const i = document.getElementById('map') as HTMLElement;
      this.mapWidth = this.isWindowNarrow ? String(this.changePxToRem(i.clientWidth)) + 'rem' : '35rem';
      this.mapHeight = this.isWindowNarrow ? String(this.changePxToRem(i.clientWidth * 0.8)) + 'rem' : '25rem';
    }
  }

  public openNewWindow(url: string, winName: string, options: string) {
    this.commonService.openNewWindow(url, winName, options);
  }

  public changePw() {
    const dialog = this.matDialog.open(ChangePwComponent, {
      data : {user_id: this.loginUserId},
      disableClose : false
      });
      dialog.afterClosed().subscribe( (result: any) => {

    });
  }

  public logout() {
    if ( this.isTest && !this.isOnlyReport ) {
      // テストイベントユーザーで表示した場合(ポートフォリオ確認用)
      this.loginUserId = '';
      this.loginUserName = '';
      this.eventId = '';
      this.router.navigate(['']);
    } else {
      this.loginService.logout();
    }
  }

  private initAnimation() {
    gsap.fromTo('.img1', {
      scale: 1.2,
    }, {
      scale: 1,
      duration: 5,
      onComplete: () => this.changeTopImgAnim()
    })

    // トップタイトル出現
    gsap.to('.t_title', {
      opacity: 1,
      scale: 1.5,
      duration: 1.5,
      stagger: 0.2,
    });

    // トップタイトルの色変化
    this.topTitleTl = gsap.timeline({
      repeat: -1,
    })
    .to('.t_title', {
      color: 'white',
      duration: 2,
      stagger: 0.2,
    }).to('.t_title', {
      color: '#b5a792',
      duration: 2,
      stagger: 0.2,
    });

    // ヘッダ
    gsap.to('.option', {
      opacity: 0,
      scrollTrigger: {
        trigger: '.message',
        start: 'top center',
        end: 'top top',
        scrub: true,
      }
    })

    // toTopButton
    gsap.timeline({
      scrollTrigger: {
        trigger: '.message',
        start: 'top center',
        end: 'bottom top',
        scrub: true,
      }
    }).to('.toTopButton', { opacity: 1 });

    // message
    gsap.timeline({
      scrollTrigger: {
        trigger: '.message',
        start: 'top 50%',
        end: 'bottom top',
      },
    }).to('.m_title', {
      y: 800,
      duration: 3,
      opacity: 1,
      stagger: 0.1,
      ease: 'back'
    });

    gsap.timeline({
      scrollTrigger: {
        trigger: '#messageIntersection',
        start: 'top 50%',
        end: 'top top',
        scrub: 3,
      }
    }).from('.text', {
      y: 30,
      duration: 1
    })
    .to('.text', {
      color: 'black',
      duration: 3,
      ease: 'sine.out'
    });

    // プロフィール欄
    gsap.to('.p_title', {
      scrollTrigger: {
        trigger: '.profile',
        start: 'top 80%',
        end: 'bottom top',
      },
      y: 800,
      duration: 1,
      opacity: 1,
      stagger: 0.1,
      ease: 'back'
    })

    gsap.timeline({
      scrollTrigger: {
        trigger: '.profile',
        start: 'top 80%',
        end: 'bottom top',
      },
    })
    .from('.profile1', {
      opacity: 0,
      y: 30,
      duration: 1,
      stagger: 0.2,
    })
    .from('.p_up_1', {
      opacity: 0,
      y: 30,
      duration: 1,
    }, '-=2')
    .to('#li_1', {
      color: 'black',
      duration: 1,
      onComplete: () => this.onConpP1Show()
    });

    gsap.timeline({
      scrollTrigger: {
        trigger: '.profile',
        start: 'center 80%',
        end: 'bottom top',
      }
    })
    .from('.p_up_3', {
      opacity: 0,
      y: 30,
      duration: 1,
      stagger: 0.2,
    })
    .from('.p_up_2', {
      opacity: 0,
      y: 30,
      duration: 1,
    }, '-=2')
    .to('#li_2', {
      color: 'black',
      duration: 1,
      onComplete: () => this.onConpP2Show()
    });

    // 花々のスクラブ
    gsap.timeline({
      scrollTrigger: {
        trigger: '.profile',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      }
    }).to('.rotate1', {
      rotation: 50,
      repeat: -1,
    }).to('.rotate2', {
      rotation: -30,
      repeat: -1,
    }).to('.rotate3', {
      rotation: 60,
      repeat: -1,
    })

    // our_story
    gsap.timeline({
      scrollTrigger: {
        trigger: '.our_story',
        start: 'top 50%',
        end: 'bottom top',
      },
    }).to('.s_title', {
      y: 800,
      duration: 3,
      opacity: 1,
      stagger: 0.1,
      ease: 'back'
    });

    const listWrapperEl = document.querySelector('.side-scroll-list-wrapper');
    const listEl = document.querySelector('.side-scroll-list');

    gsap.timeline({
      scrollTrigger: {
        trigger: '.our_story',
        start: 'top top',
        end: () => `+=${listEl!.clientWidth - listWrapperEl!.clientWidth}`,
        scrub: 1,
        pin: true,
      },
    }).to('.side-scroll-list', {
      x: () => -(listEl!.clientWidth - listWrapperEl!.clientWidth),
      ease: 'power2.out',
    });

    // const itemHeight = this.isWindowNarrow ? 500 : 570;
    const itemHeight = this.isWindowNarrow ? 500 : 570;
    // const itemHeight = listEl!.clientWidth / 6;
    const startHeight = itemHeight / 2;
    gsap.timeline({
      scrollTrigger: {
        trigger: '.pin-spacer',
        start: 'top top+=' + String(startHeight),
        end: '+=' + String(itemHeight),
        scrub: 3,
      },
    }).from('.sText1', {
      x: -50,
    }).to('.sText1', {
      opacity: 1
    }).to('.sText1', {
      x: 50,
      opacity: 0
    });

    gsap.timeline({
      scrollTrigger: {
        trigger: '.pin-spacer',
        start: 'top top',
        end: '+=' + String(itemHeight),
        scrub: 3,
      },
    })
    .from('.sText2', {
      x: -50
    }).to('.sText2', {
      opacity: 1
    }).to('.sText2', {
      x: 50,
      opacity: 0
    });

    gsap.timeline({
      scrollTrigger: {
        trigger: '.pin-spacer',
        start: 'top top-=' + String(startHeight),
        end: '+=' + String(itemHeight),
        scrub: 3,
      },
    })
    .from('.sText3', {
      x: -50
    }).to('.sText3', {
      opacity: 1
    }).to('.sText3', {
      x: 50,
      opacity: 0
    });
    gsap.timeline({
      scrollTrigger: {
        trigger: '.pin-spacer',
        start: 'top top-=' + String(startHeight * 2),
        end: '+=' + String(itemHeight),
        scrub: 3,
      },
    })
    .from('.sText4', {
      x: -50
    }).to('.sText4', {
      opacity: 1
    }).to('.sText4', {
      x: 50,
      opacity: 0
    });

    gsap.timeline({
      scrollTrigger: {
        trigger: '.pin-spacer',
        start: 'top top-=' + String(startHeight * 3),
        end: '+=' + String(itemHeight + 240),
        scrub: 3,
      },
    })
    .from('.sText5', {
      x: -50
    }).to('.sText5', {
      opacity: 1
    }).to('.sText5', {
      x: 50,
      opacity: 0
    });

    gsap.timeline({
      scrollTrigger: {
        trigger: '.pin-spacer',
        start: 'top top-=' + String(startHeight * 4 + 240),
        end: '+=' + String(itemHeight + 360),
        scrub: 3,
      },
    })
    .from('.sText6', {
      x: -50
    }).to('.sText6', {
      opacity: 1
    }).to('.sText6', {
      x: 50,
      opacity: 0
    });

    // event
    gsap.timeline({
      scrollTrigger: {
        trigger: '.event',
        start: 'top 50%',
        end: 'bottom top',
      },
    }).to('.pa_title', {
      y: 800,
      duration: 3,
      opacity: 1,
      stagger: 0.1,
      ease: 'back'
    });
  }

  // トップ画面の画像切替
  private changeTopImgAnim() {
    const img1 = '.img1';
    this.img1Tl = gsap.timeline({repeat: -1})
    .to(img1, {
      opacity: 1,
      scale: 1,
      duration: 10,
    },).to(img1, {
      opacity: 0,
      scale: 1.2,
      duration: 5,
    })
    .to(img1, {
      opacity: 1,
      scale: 1,
      duration: 5,
    }, '+=10');

    const img2 = '.img2';
    this.img2Tl = gsap.timeline({repeat: -1})
    .to(img2, {
      opacity: 0,
      scale: 1.2,
      duration: 10,
    },).to(img2, {
      opacity: 1,
      scale: 1,
      duration: 5,
    }).to(img2, {
      opacity: 0,
      scale: 1.2,
      duration: 5,
    }, '+=10');

  }

  // 表示後のスクラブ設定
  private onConpP1Show() {
    gsap.timeline({
      scrollTrigger: {
        trigger: '.profile',
        start: 'top 20%',
        end: 'bottom top',
        scrub: 0.3,
      },
    }).to('.p_img1', {
      y: -30,
    });
    gsap.utils.toArray('#li_1').forEach((layer: any) => {
      gsap.to(layer, {
        x: 30,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: '.profile',
          start: 'top 20%',
          end: 'bottom top',
          scrub: 0.5,
        }
      });
    });
  }

  private onConpP2Show() {
    gsap.timeline({
      scrollTrigger: {
        trigger: '.profile',
        start: 'center 40%',
        end: 'bottom top',
        scrub: 0.3,
      },
    }).to('.p_img2', {
      y: -30,
    });
    gsap.utils.toArray('#li_2').forEach((layer: any) => {
      gsap.to(layer, {
        x: -30,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: '.profile',
          start: 'center 40%',
          end: 'bottom top',
          scrub: 0.5,
        }
      });
    })
  }

  private afterViewInitAnimation() {
    // event
    gsap.timeline({
      scrollTrigger: {
        trigger: '.event',
        start: 'top 30%',
        end: 'top top',
      },
    })
    .from('.event-content', {
      y: 100,
      duration: 1,
      opacity: 0,
      stagger: 0.5
    })
    .from('.attend-message', {
      opacity: 0,
      duration: 1.2,
      x: 10,
      ease: 'circ.out',
    }, '-=2').to('.attend-message', {
      color: 'black',
    }).from('.attend-button', {
      opacity: 0,
      duration: 1.2,
      stagger: 0.5,
      y: 30,
      ease: 'circ.out',
    },'-=1').from('.aftSend', {
      opacity: 0,
      duration: 1.2,
      stagger: 0.5,
      y: 30,
      ease: 'circ.out',
    },'-=0.5');

    gsap.timeline({
      scrollTrigger: {
        trigger: '.event',
        start: 'top 50%',
        end: 'top top',
        scrub: 3,
      },
    }).from('.endMessage', {
      y: 30,
      duration: 2,
    })
    .to('.endMessage', {
      color: 'black',
      duration: 3,
      ease: 'sine.out'
    });
  }
}
