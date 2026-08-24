# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguard-files setting in build.gradle.

# Keep the Capacitor plugin classes
-keep public class com.getcapacitor.** { *; }
-keep public class com.getcapacitor.plugin.** { *; }

# Keep the Supabase client classes
-keep class io.github.jan.** { *; }
-keep class com.auth0.android.** { *; }

# Keep the AndroidX classes
-keep class androidx.** { *; }

# Keep the Google services
-keep class com.google.** { *; }

# Keep the Capacitor BridgeActivity
-keep public class * extends com.getcapacitor.BridgeActivity