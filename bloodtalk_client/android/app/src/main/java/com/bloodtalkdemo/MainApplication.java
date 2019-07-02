package com.bloodtalkdemo;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.brentvatne.react.ReactVideoPackage; //video
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.react.SmsPackage;
import com.imagepicker.ImagePickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import org.pgsqlite.SQLitePluginPackage; //sqlite 

import io.invertase.firebase.RNFirebasePackage; //firebase
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;  //firebase                     
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage; //firebase

import java.util.Arrays;
import java.util.List;


public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new ReactVideoPackage(),
          new RNDeviceInfo(),
          new ReactNativeContacts(),
          new SmsPackage(),
          new ImagePickerPackage(),
          new VectorIconsPackage(),
          new AsyncStoragePackage(),
          new RNGestureHandlerPackage(),
          new RNFirebasePackage(),   
          new RNFirebaseMessagingPackage(), 
          new RNFirebaseNotificationsPackage(), 
          new SQLitePluginPackage()  
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
