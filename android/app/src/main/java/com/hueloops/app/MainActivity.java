package com.hueloops.app;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Retrieve the native Android WebView and customize permissions
        WebView webView = this.getBridge().getWebView();
        WebSettings webSettings = webView.getSettings();
        
        // Force-enable autoplay for custom audio elements and blobs
        webSettings.setMediaPlaybackRequiresUserGesture(false);
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);
    }
}
