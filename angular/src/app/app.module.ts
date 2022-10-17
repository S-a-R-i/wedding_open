import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InViewportModule } from 'ng-in-viewport';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { JPDateAdapter } from './lib/jp-date-adapter';
import { registerLocaleData } from '@angular/common';
import { GoogleMapsModule } from "@angular/google-maps";
import { MatMenuModule } from '@angular/material/menu';

import { MessageComponent } from './message/message.component';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { CommonService } from './services/common.service';
import { DataService } from './services/data.service';
import { ManageLoginComponent } from './manage/manage-login/manage-login.component';
import { ManageEventComponent } from './manage/manage-common/manage-event.component';
import { ManageUserComponent } from './manage/manage-common/manage-user.component';
import { ManageQuestionComponent } from './manage/manage-common/manage-question.component';
import { ManageAnswerComponent } from './manage/manage-common/manage-answer.component';
import { ManageSystemComponent } from './manage/manage-common/manage-system.component';
import { ChangePwComponent } from './main/change-pw/change-pw.component';
import { LoginService } from './services/login.service';
import { AuthGuard } from './auth.guard';

import { MultiPipe } from './pipes/multi.pipe';
import { DatePipe } from '@angular/common';
import { RolePipe } from './pipes/role.pipe';
import { EventPipe } from './pipes/event.pipe';
import { DressPipe } from './pipes/dress.pipe';
import { AnsWeyPipe } from './pipes/answay.pipe';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import localeJa from '@angular/common/locales/ja';
registerLocaleData(localeJa);

@NgModule({
    declarations: [
        AppComponent,
        MainComponent,
        LoginComponent,
        MessageComponent,
        ManageLoginComponent,
        ManageEventComponent,
        ManageQuestionComponent,
        ManageUserComponent,
        ManageSystemComponent,
        ManageAnswerComponent,
        ChangePwComponent,
        MultiPipe,
        RolePipe,
        EventPipe,
        DressPipe,
        AnsWeyPipe,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        InViewportModule,
        HttpClientModule,
        MatDialogModule,
        FormsModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatSidenavModule,
        MatToolbarModule,
        MatIconModule,
        MatListModule,
        MatTableModule,
        MatSortModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatInputModule,
        GoogleMapsModule,
        MatMenuModule,
        RouterModule.forRoot([
          { path: '', redirectTo: '/main', pathMatch: 'full' },
          { path: 'login', component: LoginComponent },
          { path: 'main', component: MainComponent},
          { path: 'manageLogin', component: ManageLoginComponent },
          { path: 'manageEvent', component: ManageEventComponent },
          { path: 'manageQuestion', component: ManageQuestionComponent },
          // { path: 'manageUser', component: ManageUserComponent },
          { path: 'manageSystem', component: ManageSystemComponent },
          { path: 'manageAnswer', component: ManageAnswerComponent },
          // { path: 'manageEvent', component: ManageEventComponent, canActivate: [AuthGuard] },
          // { path: 'manageQuestion', component: ManageQuestionComponent, canActivate: [AuthGuard] },
          { path: 'manageUser', component: ManageUserComponent, canActivate: [AuthGuard] },
          // { path: 'manageSystem', component: ManageSystemComponent, canActivate: [AuthGuard] },
          // { path: 'manageAnswer', component: ManageAnswerComponent, canActivate: [AuthGuard] },
        ]),
    ],
    providers: [
        DataService,
        CommonService,
        LoginService,
        MultiPipe,
        DatePipe,
        RolePipe,
        EventPipe,
        DressPipe,
        AnsWeyPipe,
        {provide : LocationStrategy , useClass: HashLocationStrategy},
        { provide: MAT_DATE_LOCALE, useValue: 'ja-JP' },
        { provide: LOCALE_ID, useValue: 'ja-JP' },
        { provide: DateAdapter, useClass: JPDateAdapter },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
