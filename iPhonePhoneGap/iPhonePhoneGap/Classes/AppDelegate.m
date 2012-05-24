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

/*
 *
 * PERSISTENT LOCALSTORAGE NATIVE SOLUTION for phonegap (tested on 1.3)
 * iOS 5.1 puts LocalStorage in a vulnerable location (Libary/Caches). This will copy it to
 * the documents folder as "appdata.db" so that it will be appropriately backed-up and not
 * overwritten. If "appdata.db" doesn't exist, localStorage will not be overwritten.
 * Also, upon application suspend (resignActive) or termination, localStorage is saved, so
 * there should not be any chance that changes to localStorage won't be persisted. [[ short of a power-cycle ]]
 *
 * The following should be placed in AppDelegate.m. Note that it //partially// replaces
 * webViewDidStartLoad:. The remainder of webViewDidStartLoad: (as in phonegap 1.3) is below,
 * replace/remove as appropriate
 *
 * @Author: Kerri Shotts (2012)
 * @License: MIT License
 *
 * Notes: USES ARC. IF USING MRC, apply the appropriate releases.
 *
 * Based partially on http://gauravstomar.blogspot.com/2011/08/prepopulate-sqlite-in-phonegap.html
 *
 */
- (BOOL)fileExists: (NSString*) theFile
{
    NSFileManager *fileManager = [NSFileManager defaultManager];
    return [fileManager fileExistsAtPath:theFile];
    // MRC: make sure to release
}

- (void)copyFile:(NSString*) sourceFile to:(NSString*) targetPath withName:(NSString*) targetFile
{
    NSFileManager *fileManager = [NSFileManager defaultManager];
    [fileManager createDirectoryAtPath:targetPath withIntermediateDirectories:YES attributes:nil error:NULL];
    NSString *fullTargetFile = [targetPath stringByAppendingPathComponent:targetFile];
    
    NSLog(@"Source File for Copy: %@", sourceFile);
    NSLog(@"Target File for Copy: %@", fullTargetFile);
    
    if ( [self fileExists:fullTargetFile] )
    {
        // remove the file first. (Ick! I wish there was a better way...
        if ( [fileManager removeItemAtPath:fullTargetFile error:nil] == YES )
        {
            NSLog (@"Target successfully removed.");
        }
        else
        {
            NSLog (@"Target could not be removed prior to copy. No copy will occur.");
            return;
        }
    }
    
    if ( [fileManager copyItemAtPath:sourceFile toPath:fullTargetFile error:nil] == YES)
    {
        NSLog(@"Copy successful.");
    }
    else
    {
        NSLog(@"Copy unsuccessful.");
    }
    // MRC: don't forget to release fileManager where necessary!
}


- (BOOL)isIOS5_1OrHigher
{
    // based on: http://stackoverflow.com/a/9320041
    NSArray *versionCompatibility = [[UIDevice currentDevice].systemVersion componentsSeparatedByString:@"."];
    
    if ( [[versionCompatibility objectAtIndex:0] intValue] > 5 )
    {
        return YES; // iOS 6+
    }
    
    if ( [[versionCompatibility objectAtIndex:0] intValue] < 5 )
    {
        return NO;  // iOS 4.x or lower
    }
    
    if ( [[versionCompatibility objectAtIndex:1] intValue] >= 1 )
    {
        return YES; // ios 5.<<1>> or higher
    }
    
    return NO;  // ios 5.<<0.x>> or lower
    
}

- (void)copyPersistentStorageToLocalStorage
{
    // build localStorage path: ~/Library/WebKit/LocalStorage/file__0.localstorage (for iOS < 5.1)
    //                          ~/Library/Caches/file__0.localstorage (for iOS >= 5.1 )
    NSString *localStoragePath;
    if ( [self isIOS5_1OrHigher] ) 
    {
        // for IOS >= 5.1
        localStoragePath = 
        [
         [NSSearchPathForDirectoriesInDomains(NSLibraryDirectory, NSUserDomainMask, YES) objectAtIndex:0] 
         stringByAppendingPathComponent:@"Caches"
         ];
    }
    else
    {
        // for IOS < 5.1;
        localStoragePath = 
        [
         [NSSearchPathForDirectoriesInDomains(NSLibraryDirectory, NSUserDomainMask, YES) objectAtIndex:0] 
         stringByAppendingPathComponent:@"WebKit/LocalStorage"
         ];
    }
    
    // build persistentStorage path: ~/Documents/appdata.db
    NSString *persistentStoragePath = 
    [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0]; 
    NSString *persistentStorageFile = [persistentStoragePath stringByAppendingPathComponent:@"appdata.db"];
    
    // does the persistent store exist?
    if ([self fileExists:persistentStorageFile ])
    {
        // it does, copy it over localStorage
        NSLog(@"Copying persistent storage to local storage.");
        [self copyFile:persistentStorageFile to:localStoragePath withName: @"file__0.localstorage"];
    }
    else
    {
        NSLog(@"No persistent storage to copy. Using local storage only.");
    }
}

- (void)copyLocalStorageToPersistentStorage
{
    // build localStorage path: ~/Library/WebKit/LocalStorage/file__0.localstorage (for iOS < 5.1)
    //                          ~/Library/Caches/file__0.localstorage (for iOS >= 5.1 )
    NSString *localStoragePath;
    if ( [self isIOS5_1OrHigher] ) 
    {
        // for IOS >= 5.1
        localStoragePath = 
        [
         [NSSearchPathForDirectoriesInDomains(NSLibraryDirectory, NSUserDomainMask, YES) objectAtIndex:0] 
         stringByAppendingPathComponent:@"Caches"
         ];
    }
    else
    {
        // for IOS < 5.1;
        localStoragePath = 
        [
         [NSSearchPathForDirectoriesInDomains(NSLibraryDirectory, NSUserDomainMask, YES) objectAtIndex:0] 
         stringByAppendingPathComponent:@"WebKit/LocalStorage"
         ];
    }
    
    NSString *localStorageFile = [localStoragePath stringByAppendingPathComponent:@"file__0.localstorage"];
    
    // build persistentStorage path: ~/Documents/appdata.db
    NSString *persistentStoragePath = 
    [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0]; 
    
    // does the local store exist? (it almost always will)
    if ([self fileExists:localStorageFile ])
    {
        // it does, copy it over persistent Storage
        NSLog(@"Copying local storage to persistent storage.");
        [self copyFile:localStorageFile to:persistentStoragePath withName:@"appdata.db"];
    }
    else
    {
        NSLog(@"No local storage to copy. Using local storage only.");
    }
    
}

- (void)applicationWillResignActive:(UIApplication *)application
{   
    // move the local storage data to persistent storage
    // while we're resigning so that we know our data is safe...
    [self copyLocalStorageToPersistentStorage];
    return;
}

- (void)applicationWillTerminate:(UIApplication *)application
{
    // move the local storage data to persistent storage
    // while we're terminating so that we know our data is safe...
    [self copyLocalStorageToPersistentStorage];
    return;
}

- (void)webViewDidStartLoad:(UIWebView *)theWebView 
{
    [self copyPersistentStorageToLocalStorage];
    //
    // END Persistent LocalStorage solution. Remainder of webViewDidStartLoad: should be used.
    //
	return [ super webViewDidStartLoad:theWebView ];
}
@end
