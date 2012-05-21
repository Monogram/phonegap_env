//
//  AppDelegate.m
//  iPhonePhoneGap
//
//  Created by Siu Ngai Lam on 12年5月11日.
//  Copyright __MyCompanyName__ 2012年. All rights reserved.
//

#import "AppDelegate.h"
#ifdef PHONEGAP_FRAMEWORK
	#import <PhoneGap/PhoneGapViewController.h>
#else
	#import "PhoneGapViewController.h"
#endif

@implementation AppDelegate

@synthesize invokeString;

- (id) init
{	
	/** If you need to do any extra app-specific initialization, you can do it here
	 *  -jm
	 **/
    return [super init];
}

/**
 * This is main kick off after the app inits, the views and Settings are setup here. (preferred - iOS4 and up)
 */
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
	/* Fix problem with ios 5.0.1+ and Webkit databases described at the following urls:
     *   https://issues.apache.org/jira/browse/CB-347
     *   https://issues.apache.org/jira/browse/CB-330
     * My strategy is to move any existing database from default paths
     * to Documents/ and then changing app preferences accordingly
     */
    
    NSString* library = [NSSearchPathForDirectoriesInDomains(NSLibraryDirectory, NSUserDomainMask, YES)objectAtIndex:0];
    NSString* documents = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0];
    
    NSString *localStorageSubdir = (IsAtLeastiOSVersion(@"5.1")) ? @"Caches" : @"WebKit/LocalStorage";
    NSString *localStoragePath = [library stringByAppendingPathComponent:localStorageSubdir];
    NSString *localStorageDb = [localStoragePath stringByAppendingPathComponent:@"file__0.localstorage"];
    
    NSString *WebSQLSubdir = (IsAtLeastiOSVersion(@"5.1")) ? @"Caches" : @"WebKit/Databases";
    NSString *WebSQLPath = [library stringByAppendingPathComponent:WebSQLSubdir];
    NSString *WebSQLIndex = [WebSQLPath stringByAppendingPathComponent:@"Databases.db"];
    NSString *WebSQLDb = [WebSQLPath stringByAppendingPathComponent:@"file__0"];
    
    NSString *ourLocalStoragePath = [documents stringByAppendingPathComponent:@"LocalStorage"];;
    //NSString *ourLocalStorageDb = [documents stringByAppendingPathComponent:@"file__0.localstorage"];
    NSString *ourLocalStorageDb = [ourLocalStoragePath stringByAppendingPathComponent:@"file__0.localstorage"];
    
    NSString *ourWebSQLPath = [documents stringByAppendingPathComponent:@"Databases"];
    NSString *ourWebSQLIndex = [ourWebSQLPath stringByAppendingPathComponent:@"Databases.db"];
    NSString *ourWebSQLDb = [ourWebSQLPath stringByAppendingPathComponent:@"file__0"];
    
    NSFileManager* fileManager = [NSFileManager defaultManager];
    
    BOOL copy;
    NSError *err = nil;
    copy = [fileManager fileExistsAtPath:localStorageDb] && ![fileManager fileExistsAtPath:ourLocalStorageDb];
    if (copy) {
        [fileManager createDirectoryAtPath:ourLocalStoragePath withIntermediateDirectories:YES attributes:nil error:&err];
        [fileManager copyItemAtPath:localStorageDb toPath:ourLocalStorageDb error:&err];
        if (err == nil)
            [fileManager removeItemAtPath:localStorageDb error:&err];
    }
    
    err = nil;
    copy = [fileManager fileExistsAtPath:WebSQLPath] && ![fileManager fileExistsAtPath:ourWebSQLPath];
    if (copy) {
        [fileManager createDirectoryAtPath:ourWebSQLPath withIntermediateDirectories:YES attributes:nil error:&err];
        [fileManager copyItemAtPath:WebSQLIndex toPath:ourWebSQLIndex error:&err];
        [fileManager copyItemAtPath:WebSQLDb toPath:ourWebSQLDb error:&err];
        if (err == nil)
            [fileManager removeItemAtPath:WebSQLPath error:&err];
    }
    
    NSUserDefaults* appPreferences = [NSUserDefaults standardUserDefaults];
    NSBundle* mainBundle = [NSBundle mainBundle];
    
    NSString *bundlePath = [[mainBundle bundlePath] stringByDeletingLastPathComponent];
    NSString *bundleIdentifier = [[mainBundle infoDictionary] objectForKey:@"CFBundleIdentifier"];
    NSString* libraryPreferences = @"Library/Preferences";
    
    NSString* appPlistPath = [[bundlePath stringByAppendingPathComponent:libraryPreferences]    stringByAppendingPathComponent:[NSString stringWithFormat:@"%@.plist", bundleIdentifier]];
    NSMutableDictionary* appPlistDict = [NSMutableDictionary dictionaryWithContentsOfFile:appPlistPath];
    
    BOOL dirty = NO;
    
    NSString *value;
    NSString *key = @"WebKitLocalStorageDatabasePathPreferenceKey";
    value = [appPlistDict objectForKey: key];
    if (![value isEqual:ourLocalStoragePath]) {
        [appPlistDict setValue:ourLocalStoragePath forKey:key];
        dirty = YES;
    }
    
    key = @"WebDatabaseDirectory";
    value = [appPlistDict objectForKey: key];
    if (![value isEqual:ourWebSQLPath]) {
        [appPlistDict setValue:ourWebSQLPath forKey:key];
        dirty = YES;
    }
    
    if (dirty)
    {
        BOOL ok = [appPlistDict writeToFile:appPlistPath atomically:YES];
        NSLog(@"Fix applied for database locations?: %@", ok? @"YES":@"NO");
        [appPreferences synchronize];
    }
    /* END Fix problem with ios 5.0.1+ and Webkit databases */
    
	NSArray *keyArray = [launchOptions allKeys];
	if ([launchOptions objectForKey:[keyArray objectAtIndex:0]]!=nil) 
	{
		NSURL *url = [launchOptions objectForKey:[keyArray objectAtIndex:0]];
		self.invokeString = [url absoluteString];
		NSLog(@"iPhonePhoneGap launchOptions = %@",url);
	}
	
	return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

// this happens while we are running ( in the background, or from within our own app )
// only valid if iPhonePhoneGap.plist specifies a protocol to handle
- (BOOL)application:(UIApplication *)application handleOpenURL:(NSURL *)url 
{
	// Do something with the url here
	NSString* jsString = [NSString stringWithFormat:@"handleOpenURL(\"%@\");", url];
	[self.webView stringByEvaluatingJavaScriptFromString:jsString];
	
	return YES;
}

-(id) getCommandInstance:(NSString*)className
{
	/** You can catch your own commands here, if you wanted to extend the gap: protocol, or add your
	 *  own app specific protocol to it. -jm
	 **/
	return [super getCommandInstance:className];
}

/**
 Called when the webview finishes loading.  This stops the activity view and closes the imageview
 */
- (void)webViewDidFinishLoad:(UIWebView *)theWebView 
{
	// only valid if iPhonePhoneGap.plist specifies a protocol to handle
	if(self.invokeString)
	{
		// this is passed before the deviceready event is fired, so you can access it in js when you receive deviceready
		NSString* jsString = [NSString stringWithFormat:@"var invokeString = \"%@\";", self.invokeString];
		[theWebView stringByEvaluatingJavaScriptFromString:jsString];
	}
	return [ super webViewDidFinishLoad:theWebView ];
}

- (void)webViewDidStartLoad:(UIWebView *)theWebView 
{
	return [ super webViewDidStartLoad:theWebView ];
}

/**
 * Fail Loading With Error
 * Error - If the webpage failed to load display an error with the reason.
 */
- (void)webView:(UIWebView *)theWebView didFailLoadWithError:(NSError *)error 
{
	return [ super webView:theWebView didFailLoadWithError:error ];
}

/**
 * Start Loading Request
 * This is where most of the magic happens... We take the request(s) and process the response.
 * From here we can re direct links and other protocalls to different internal methods.
 */
- (BOOL)webView:(UIWebView *)theWebView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType
{
    NSURL *url = [request URL];
    if ([[url scheme] isEqualToString:@"http"] || [[url scheme] isEqualToString:@"https"]) {
        [[UIApplication sharedApplication] openURL:url]; 
        return NO; 
    }
    else {
        return [ super webView:theWebView shouldStartLoadWithRequest:request navigationType:navigationType ];
    }
}

- (BOOL) execute:(InvokedUrlCommand*)command
{
	return [ super execute:command];
}

- (void)dealloc
{
	[ super dealloc ];
}

@end
