import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { TestBed, async } from "@angular/core/testing";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppComponent } from "./app.component";
import { AppConfigService } from "./core/services/auth-config.service";

describe("AppComponent", () => {
  let statusBarSpy,
    splashScreenSpy,
    platformReadySpy,
    platformSpy,
    appConfigServiceSpy;

  beforeEach(async(() => {
    statusBarSpy = jasmine.createSpyObj("StatusBar", [
      "styleDefault",
      "styleLightContent",
    ]);
    splashScreenSpy = jasmine.createSpyObj("SplashScreen", ["hide"]);
    platformReadySpy = Promise.resolve();
    platformSpy = jasmine.createSpyObj("Platform", { ready: platformReadySpy });
    appConfigServiceSpy = jasmine.createSpyObj("AppConfigService", [
      "loadAppConfig",
      "configureImplicitFlowAuthentication",
    ]);

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: StatusBar, useValue: statusBarSpy },
        { provide: SplashScreen, useValue: splashScreenSpy },
        { provide: Platform, useValue: platformSpy },
        { provide: AppConfigService, useValue: appConfigServiceSpy },
      ],
    }).compileComponents();
  }));

  it("should create the app", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it("should initialize the app", async () => {
    TestBed.createComponent(AppComponent);
    expect(platformSpy.ready).toHaveBeenCalled();
    await platformReadySpy;
    expect(statusBarSpy.styleLightContent).toHaveBeenCalled();
    expect(splashScreenSpy.hide).toHaveBeenCalled();
  });

  // TODO: add more tests!
});
