/*
 * @Author: LAPTOP-P7G9LM4M\wumen 332982129@qq.com
 * @Date: 2023-07-15 15:22:08
 * @LastEditors: LAPTOP-P7G9LM4M\wumen 332982129@qq.com
 * @LastEditTime: 2023-08-13 19:26:45
 * @FilePath: \chaofun-frontc:\Users\wumen\Documents\msdocs-nodejs-mongodb-azure-sample-app\utils\constants.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const roleMap = {
  assistant: "assistant",
  user: "user",
  system: "system",
};

const roleDescriptionAssistant = `Your name is Veronica, you are an assistant that can help customer using Panda Design. You can tell customers about how to use components in Panda Design,and for the questions not related to Panda Design, you should reject it.`;
const roleDescriptionPromptCreator = `I want you to be my Prompt creator. Based on my input, which is a breif description of a react component or its prop description, you will create a revised Prompt (you will write a revised Prompt that is clear, precise, and easy to understand)
The Prompt provided by you should be in the form of a request for ChatGPT to execute, and better understand of the component and its props, and in the format of {prompt:createdPrompt}`;
// const angularVersionUpdate = `You are a develop that help to update code to adapt anuglar16 and only output the modified file content.
// The following message is upgrade instruction:Make sure that you are using a supported version of node.
// nacessary changes according to the instructions below. Angular v16 supports node.js versions:v16 and v18.
// Make sure that you are using a supported version of TypeScript before you upgrade your application.
// Angular v16 supports TypeScript version 4.9.3 or later.
// Make sure that you are using a supported version of Zone.js before you upgrade your application.
// Angular v16 supports Zone.js version 0.13.x or later.The Event union no longer contains RouterEvent,
// which means that if you're using the Event type you may have to change the type definition from
// (e: Event) to (e: Event|RouterEvent) In addition to NavigationEnd the routerEvent property now also
// accepts type NavigationSkippedPass only flat arrays to RendererType2.styles because it no longer
// accepts nested arraysYou may have to update tests that use BrowserPlatformLocation because
// MockPlatformLocation is now provided by default in tests. Read further.
// Due to the removal of the Angular Compatibility Compiler (ngcc) in v16,
// projects on v16 and later no longer support View Engine libraries.
// After bug fixes in Router.createUrlTree you may have to readjust tests which mock ActiveRoute.
// Read furtherChange imports of ApplicationConfig to be from @angular/core.
// Revise your code to use renderModule instead of renderModuleFactory because
// it has been deleted.Revise your code to use XhrFactory from @angular/common
// instead of XhrFactory export from @angular/common/http.If you're running multiple
// Angular apps on the same page and you're using BrowserModule.
// withServerTransition({ appId: 'serverApp' }) make sure you set the APP_ID instead since
// withServerTransition is now deprecated. Read furtherChange EnvironmentInjector.
// runInContext to runInInjectionContext and pass the environment injector as the first parameter.
// Update your code to use ViewContainerRef.createComponent without the factory resolver.
// ComponentFactoryResolver has been removed from Router APIs.If you bootstrap multiple apps on
// the same page, make sure you set unique APP_IDs.Update your code to revise renderApplication
// method as it no longer accepts a root component as first argument, but instead a callback that
// should bootstrap your app. Read furtherUpdate your code to remove any reference to PlatformConfig.
// baseUrl and PlatformConfig.useAbsoluteUrl platform-server config options as it has been deprecated.
// Update your code to remove any reference to @Directive/@Component moduleId property as it
// does not have any effect and will be removed in v17.Update imports from import {makeStateKey,
//   StateKey, TransferState} from '@angular/platform-browser' to import {makeStateKey, StateKey,
//     TransferState} from '@angular/core'If you rely on ComponentRef.setInput to set the component
//     input even if it's the same based on Object.is equality check, make sure you copy its value.
//     Update your code to remove any reference to ANALYZE_FOR_ENTRY_COMPONENTS injection token as
//     it has been deleted.entryComponents is no longer available and any reference to it can be removed
//      from the @NgModule and @Component public APIs.ngTemplateOutletContext has stricter type
//      checking which requires you to declare all the properties in the corresponding object.
//      Read further.Angular packages no longer include FESM2015 and the distributed ECMScript has
//       been updated from 2020 to 2022.The deprecated EventManager method addGlobalEventListener
//       has been removed as it is not used by Ivy.BrowserTransferStateModule is no longer available
//        and any reference to it can be removed from your applications.Update your code to use Injector.
//        create rather than ReflectiveInjector since ReflectiveInjector is removed.QueryList.filter now
//        supports type guard functions. Since the type will be narrowed, you may have to update your
//        application code that relies on the old behavior.`;
const angularVersionUpdate = `Update the code to adapt to Angular 16 and output the modified file content. Follow the upgrade instructions provided below and only do necessary modification according to the upgrade instruction provided below:

1. Ensure you're using a supported version of node (v16 or v18).
2. Update TypeScript to version 4.9.3 or later.
3. Update Zone.js to version 0.13.x or later.
4. Adjust type definitions: Change (e: Event) to (e: Event|RouterEvent).
5. Modify RouterEvent usage: Use NavigationSkippedPass in addition to NavigationEnd.
6. Change RendererType2.styles to accept only flat arrays, no longer nested arrays.
7. Update tests using BrowserPlatformLocation, as MockPlatformLocation is now provided by default.
8. Remove references to View Engine libraries due to the removal of Angular Compatibility Compiler (ngcc).
9. Adjust tests that mock ActiveRoute due to bug fixes in Router.createUrlTree.
10. Change imports of ApplicationConfig to be from @angular/core.
11. Use renderModule instead of renderModuleFactory.
12. Use XhrFactory from @angular/common instead of XhrFactory export from @angular/common/http.
13. Update BrowserModule usage withServerTransition({ appId: 'serverApp' }) to set APP_ID explicitly.
14. Replace EnvironmentInjector.runInContext with runInInjectionContext, passing environment injector as first parameter.
15. Update ViewContainerRef.createComponent to not use ComponentFactoryResolver, which has been removed from Router APIs.
16. Set unique APP_IDs when bootstrapping multiple apps on the same page.
17. Update renderApplication method to use a callback instead of a root component as its first argument.
18. Remove references to PlatformConfig.baseUrl and PlatformConfig.useAbsoluteUrl as they are deprecated.
19. Remove @Directive/@Component moduleId property references.
20. Update imports from '@angular/platform-browser' to '@angular/core' for makeStateKey, StateKey, and TransferState.
21. Copy the value when using ComponentRef.setInput for component inputs based on Object.is equality check.
22. Remove any reference to ANALYZE_FOR_ENTRY_COMPONENTS injection token.
23. Adjust ngTemplateOutletContext properties to adhere to stricter type checking.
24. Update Angular packages due to changes in FESM2015 and ES modules.
25. Remove deprecated EventManager method addGlobalEventListener.
26. Replace BrowserTransferStateModule references.
27. Use Injector instead of deprecated methods.

Please provide the modified file content after making these updates.`;
const assistantLabel = "Veronica";
const userLabel = "Mark";
const logAnalyser =
  "Help me analysis the err logs and if there are packages that has wrong version number,provide the npm package name list array that need to fix. Output in the format of array without any extra instructions.";
roleDescriptionMap = {
  1: roleDescriptionAssistant,
  2: roleDescriptionPromptCreator,
  3: angularVersionUpdate,
  4: logAnalyser,
};
module.exports = {
  roleMap,
  assistantLabel,
  userLabel,
  roleDescriptionMap,
};
