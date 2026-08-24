# Proguard rules for Capacitor & Chuplingo

# Keep Capacitor classes
-keep class com.getcapacitor.** { *; }
-keep interface com.getcapacitor.** { *; }

# Keep Cordova plugins if any
-keep class org.apache.cordova.** { *; }

# JavaScript Interface protection
-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep WebKit and WebView
-keepclassmembers class fqcn.of.javascript.interface.for.webview {
   public *;
}
-dontwarn android.webkit.**

# Native library keep
-keepclasseswithmembernames class * {
    native <methods>;
}