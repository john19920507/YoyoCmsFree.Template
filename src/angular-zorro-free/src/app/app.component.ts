import { Component, OnInit } from '@angular/core';
import { SignalRAspNetCoreHelper } from '@shared/helpers/SignalRAspNetCoreHelper';
import { AppComponentBase } from '@shared/app-component-base';
import { Injector } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { SettingsService, TitleService } from '@delon/theme';
import { Router } from '@angular/router';
import { NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HostBinding } from '@angular/core';

@Component({
  selector: 'app-app',
  templateUrl: './app.component.html'
})
export class AppComponent extends AppComponentBase
  implements OnInit, AfterViewInit {
  @HostBinding('class.layout-fixed')
  get isFixed() {
    return this.settings.layout.fixed;
  }
  @HostBinding('class.layout-boxed')
  get isBoxed() {
    return this.settings.layout.boxed;
  }
  @HostBinding('class.aside-collapsed')
  get isCollapsed() {
    return this.settings.layout.collapsed;
  }

  constructor(
    injector: Injector,
    private settings: SettingsService,
    private router: Router,
    private titleSrv: TitleService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter(evt => evt instanceof NavigationEnd))
      .subscribe(() => this.titleSrv.setTitle());

    // 注册通知信息
    SignalRAspNetCoreHelper.initSignalR();
    // 触发通知事件
    abp.event.on('abp.notifications.received', userNotification => {
      abp.notifications.showUiNotifyForUserNotification(userNotification);

      // Desktop notification
      Push.create('AbpZeroTemplate', {
        body: userNotification.notification.data.message,
        icon: abp.appPath + 'assets/app-logo-small.png',
        timeout: 6000,
        onClick: function () {
          window.focus();
          this.close();
        },
      });
    });
  }

  ngAfterViewInit(): void {
    // ($ as any).AdminBSB.activateAll();
    // ($ as any).AdminBSB.activateDemo();
  }
}
