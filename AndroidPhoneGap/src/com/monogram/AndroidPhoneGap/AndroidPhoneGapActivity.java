package com.monogram.AndroidPhoneGap;

import android.app.Dialog;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ImageView;
import android.widget.ImageView.ScaleType;

import org.apache.cordova.*;

public class AndroidPhoneGapActivity extends DroidGap {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
    	super.onCreate(savedInstanceState);
    	
    	ImageView image = new ImageView(this);
		image.setImageResource(R.drawable.splash);
		image.setScaleType(ScaleType.CENTER_CROP);
		
		final Dialog mainDialog = new Dialog(this, android.R.style.Theme_Translucent_NoTitleBar_Fullscreen);
		mainDialog.setContentView(image);
    	
		super.setIntegerProperty("loadUrlTimeoutValue",60000);
        super.loadUrl("file:///android_asset/www/index.html");
        
        final WebViewClient gapClient = super.webViewClient;
		
		super.setWebViewClient(super.appView, new WebViewClient(){
			private WebViewClient client = gapClient;
			public void onPageFinished(WebView view, String url){
				mainDialog.dismiss();
				client.onPageFinished(view, url);
			}
			
			public boolean shouldOverrideUrlLoading(WebView view, String url)
			{
				return client.shouldOverrideUrlLoading(view, url);
			}
			});
		
		mainDialog.show();
    }
}