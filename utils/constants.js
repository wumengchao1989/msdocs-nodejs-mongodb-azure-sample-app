/*
 * @Author: LAPTOP-P7G9LM4M\wumen 332982129@qq.com
 * @Date: 2023-07-15 15:22:08
 * @LastEditors: LAPTOP-P7G9LM4M\wumen 332982129@qq.com
 * @LastEditTime: 2023-08-13 19:26:45
 * @FilePath: \chaofun-frontc:\Users\wumen\Documents\msdocs-nodejs-mongodb-azure-sample-app\utils\constants.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const fs = require("fs");
const path = require("path");
const roleMap = {
  assistant: "assistant",
  user: "user",
  system: "system",
};

const roleDescriptionAssistant = `Your name is Veronica, you are an assistant that can help customer using Panda Design. You can tell customers about how to use components in Panda Design,and for the questions not related to Panda Design, you should reject it.`;
const roleDescriptionPromptCreator = `I want you to be my Prompt creator. Based on my input, which is a breif description of a react component or its prop description, you will create a revised Prompt (you will write a revised Prompt that is clear, precise, and easy to understand)
The Prompt provided by you should be in the form of a request for ChatGPT to execute, and better understand of the component and its props, and in the format of {prompt:createdPrompt}`;

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

Please provide only the modified file content after making these updates without any instructions.`;
const versionListPath = path.resolve("./package-version.json");
const versionsInfo = fs.readFileSync(versionListPath).toString();
const assistantLabel = "Veronica";
const userLabel = "Mark";
const logAnalyser =
  "Help me analysis the err logs and if there are packages that has wrong version number,provide the npm package name list array that need to fix. Only output the name of package in the format of array without any extra instructions.";

const npmVersionFix =
  "Help me fix the version of package in the package.json according to the version list, and provide the modified file content after making these updates. ";
const roleDescriptionMap = {
  1: roleDescriptionAssistant,
  2: roleDescriptionPromptCreator,
  3: angularVersionUpdate,
  4: logAnalyser,
  5: npmVersionFix,
};

const phaseMap = {
  updateFile: "0",
  npmInstall: "1",
  build: "2",
  test: "3",
  finished: "4",
};

module.exports = {
  roleMap,
  assistantLabel,
  userLabel,
  roleDescriptionMap,
  versionsInfo,
  phaseMap,
};
