const roleMap = {
  assistant: "assistant",
  user: "user",
  system: "system",
};

const roleDescriptionAssistant = `Your name is Veronica, you are an assistant that can help customer using Panda Design. You can tell customers about how to use components in Panda Design`;
const roleDescriptionPromptCreator = `I want you to be my Prompt creator. Based on my input, which is a breif description of a react component or its prop description, you will create a revised Prompt (you will write a revised Prompt that is clear, precise, and easy to understand)
The Prompt provided by you should be in the form of a request for ChatGPT to execute, and better understand of the component and its props, and in the format of {prompt:createdPrompt}`;
const angularVersionUpdate = `I want you to help me to update my code to adapt anuglar16 and only output the modified file content in the format of {filecontent:modifiedContent}.
The following message is upgrade instruction:Make sure that you are using a supported version of node.
js before you upgrade your application. Angular v16 supports node.js versions:v16 and v18.
Make sure that you are using a supported version of TypeScript before you upgrade your application. 
Angular v16 supports TypeScript version 4.9.3 or later.
Make sure that you are using a supported version of Zone.js before you upgrade your application. 
Angular v16 supports Zone.js version 0.13.x or later.The Event union no longer contains RouterEvent, 
which means that if you're using the Event type you may have to change the type definition from 
(e: Event) to (e: Event|RouterEvent) In addition to NavigationEnd the routerEvent property now also 
accepts type NavigationSkippedPass only flat arrays to RendererType2.styles because it no longer 
accepts nested arraysYou may have to update tests that use BrowserPlatformLocation because 
MockPlatformLocation is now provided by default in tests. Read further.
Due to the removal of the Angular Compatibility Compiler (ngcc) in v16, 
projects on v16 and later no longer support View Engine libraries.
After bug fixes in Router.createUrlTree you may have to readjust tests which mock ActiveRoute. 
Read furtherChange imports of ApplicationConfig to be from @angular/core.
Revise your code to use renderModule instead of renderModuleFactory because 
it has been deleted.Revise your code to use XhrFactory from @angular/common 
instead of XhrFactory export from @angular/common/http.If you're running multiple 
Angular apps on the same page and you're using BrowserModule.
withServerTransition({ appId: 'serverApp' }) make sure you set the APP_ID instead since 
withServerTransition is now deprecated. Read furtherChange EnvironmentInjector.
runInContext to runInInjectionContext and pass the environment injector as the first parameter.
Update your code to use ViewContainerRef.createComponent without the factory resolver. 
ComponentFactoryResolver has been removed from Router APIs.If you bootstrap multiple apps on 
the same page, make sure you set unique APP_IDs.Update your code to revise renderApplication 
method as it no longer accepts a root component as first argument, but instead a callback that 
should bootstrap your app. Read furtherUpdate your code to remove any reference to PlatformConfig.
baseUrl and PlatformConfig.useAbsoluteUrl platform-server config options as it has been deprecated.
Update your code to remove any reference to @Directive/@Component moduleId property as it 
does not have any effect and will be removed in v17.Update imports from import {makeStateKey, 
  StateKey, TransferState} from '@angular/platform-browser' to import {makeStateKey, StateKey, 
    TransferState} from '@angular/core'If you rely on ComponentRef.setInput to set the component 
    input even if it's the same based on Object.is equality check, make sure you copy its value.
    Update your code to remove any reference to ANALYZE_FOR_ENTRY_COMPONENTS injection token as 
    it has been deleted.entryComponents is no longer available and any reference to it can be removed
     from the @NgModule and @Component public APIs.ngTemplateOutletContext has stricter type 
     checking which requires you to declare all the properties in the corresponding object. 
     Read further.Angular packages no longer include FESM2015 and the distributed ECMScript has
      been updated from 2020 to 2022.The deprecated EventManager method addGlobalEventListener 
      has been removed as it is not used by Ivy.BrowserTransferStateModule is no longer available
       and any reference to it can be removed from your applications.Update your code to use Injector.
       create rather than ReflectiveInjector since ReflectiveInjector is removed.QueryList.filter now 
       supports type guard functions. Since the type will be narrowed, you may have to update your 
       application code that relies on the old behavior.`;
const assistantLabel = "Veronica";
const userLabel = "Mark";

roleDescriptionMap = {
  1: roleDescriptionAssistant,
  2: roleDescriptionPromptCreator,
  3: angularVersionUpdate,
};
module.exports = {
  roleMap,
  assistantLabel,
  userLabel,
  roleDescriptionMap,
};
