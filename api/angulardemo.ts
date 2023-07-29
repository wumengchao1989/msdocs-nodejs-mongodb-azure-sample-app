import { Direction, Directionality } from '@angular/cdk/bidi';
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import {  AfterViewInit,  
    ChangeDetectionStrategy,  ChangeDetectorRef,  Component,  ElementRef,
      EventEmitter,  Inject,  
      Input,  NgZone,  OnChanges,  
      OnDestroy,  OnInit,  Optional,  
      Output,  Renderer2,  SimpleChanges,  ViewChild,  ViewEncapsulation} from '@angular/core';
      import { fromEvent, merge, ReplaySubject, Subject, Subscription } from 'rxjs';
      import { map, takeUntil, throttleTime } from 'rxjs/operators';
      import { NzResizeObserver } from 'ng-zorro-antd/cdk/resize-observer';
      import { NzConfigService, WithConfig } from 'ng-zorro-antd/core/config';
      import { NzScrollService } from 'ng-zorro-antd/core/services';
      import { NgStyleInterface, NumberInput, NzSafeAny } from 'ng-zorro-antd/core/types';
      import { getStyleAsText, InputNumber, shallowEqual } from 'ng-zorro-antd/core/util';
      import { AffixRespondEvents } from './respond-events';
      import { getTargetRect, SimpleRect } from './utils';
      const NZ_CONFIG_MODULE_NAME = 'affix';
      export const NZ_AFFIX_CLS_PREFIX = 'ant-affix';
      const NZ_AFFIX_DEFAULT_SCROLL_TIME = 20;
      @Component({  selector: 'nz-affix',  
      exportAs: 'nzAffix',  
      template: `<div #fixedEl>      
      <ng-content><ng-content>   
      </div>  `,
        changeDetection: ChangeDetectionStrategy.OnPush,  encapsulation: ViewEncapsulation.None})
        export class NzAffixComponent implements AfterViewInit, OnChanges, OnDestroy, OnInit {
            readonly _nzModuleName = NZ_CONFIG_MODULE_NAME;
              static ngAcceptInputType_nzOffsetTop: NumberInput;
                static ngAcceptInputType_nzOffsetBottom: NumberInput;
                  @ViewChild('fixedEl', { static: true }) private fixedEl!: ElementRef<HTMLDivElement>;
                    @Input() nzTarget?: string | Element | Window;
                      @Input()  @WithConfig<number | null>()
                        @InputNumber(undefined)  nzOffsetTop?: null | number;  
                        @Input()
                          @WithConfig<number | null>()  
                          @InputNumber(undefined)  nzOffsetBottom?: null | number;
                    @Output() readonly nzChange = new EventEmitter<boolean>();
                      dir: Direction = 'ltr';
                        private readonly placeholderNode: HTMLElement;
                          private affixStyle?: NgStyleInterface;
                            private placeholderStyle?: NgStyleInterface;\n  private positionChangeSubscription: Subscription = Subscription.EMPTY;\n  private offsetChanged$ = new ReplaySubject<{}>(1);
                          private destroy$ = new Subject<void>();
                            private timeout?: number;
                              private document: Document;
                                private get target(): Element | Window {
                                      const el = this.nzTarget;
                                          return (typeof el === 'string' ? this.document.querySelector(el) : el) || window;\n  }
                                            constructor(
                                                el: ElementRef,
                                                @Inject(DOCUMENT) doc: NzSafeAny,
                                                   public nzConfigService: NzConfigService,
                                                       private scrollSrv: NzScrollService,
                                                       private ngZone: NgZone,
                                              private platform: Platform,
                                                  private renderer: Renderer2,
                                                      private nzResizeObserver: NzResizeObserver,
                                                          private cdr: ChangeDetectorRef,
                                                              @Optional() private directionality: Directionality
                                                                ) {
                                                            // The wrapper would stay at the original position as a placeholder.
                                                            this.placeholderNode = el.nativeElement;
                                                                this.document = doc;
                                                                  }
                                                                    ngOnInit(): void {
                                                                        this.directionality.change?.pipe(takeUntil(this.destroy$)).subscribe((direction: Direction) => {
                                                                                this.dir = direction;
                                                                                      this.registerListeners();
                                                                                            this.updatePosition({} as Event);
                                                                                                  this.cdr.detectChanges();    });    this.dir = this.directionality.value;  }  ngOnChanges(changes: SimpleChanges): void {
                                                                                                       const { nzOffsetBottom, nzOffsetTop, nzTarget } = changes;
                                                                                                           if (nzOffsetBottom || nzOffsetTop) {     this.offsetChanged$.next();    }    if (nzTarget) {
                                                                                                              this.registerListeners();
                                                                                                                }
                                                                                                                }
                                                                                                                  ngAfterViewInit(): void {
                                                                                                                       this.registerListeners();  }
                                                                                                                         ngOnDestroy(): void {
                                                                                                                              this.removeListeners();  }  private registerListeners(): void {    if (!this.platform.isBrowser) {     return;    }   this.removeListeners();    const el = this.target === window ? this.document.body : (this.target as Element);    this.positionChangeSubscription = this.ngZone.runOutsideAngular(() =>      merge(        ...Object.keys(AffixRespondEvents).map(evName => fromEvent(this.target, evName)),\n        this.offsetChanged$.pipe(map(() => ({}))),        this.nzResizeObserver.observe(el)
                                                                                                                             )
                                                                                                                                    .pipe(throttleTime(NZ_AFFIX_DEFAULT_SCROLL_TIME, undefined, { trailing: true }), takeUntil(this.destroy$))       .subscribe(e => this.updatePosition(e as Event))    );    this.timeout = setTimeout(() => this.updatePosition({} as Event)); }  private removeListeners(): void {    clearTimeout(this.timeout);\n    this.positionChangeSubscription.unsubscribe();
                                                                                                                                          this.destroy$.next();
                                                                                                                                            this.destroy$.complete();  }
                                                                                                                                              getOffset(element: Element, target: Element | Window | undefined): SimpleRect {    const elemRect = element.getBoundingClientRect();\n    const targetRect = getTargetRect(target!);
                                                                                                                                                    const scrollTop = this.scrollSrv.getScroll(target, true);\n    const scrollLeft = this.scrollSrv.getScroll(target, false);\n\n    const docElem = this.document.body;\n    const clientTop = docElem.clientTop || 0;
                                                                                                                                                        const clientLeft = docElem.clientLeft || 0;\n\n    return {\n      top: elemRect.top - targetRect.top + scrollTop - clientTop,\n      left: elemRect.left - targetRect.left + scrollLeft - clientLeft,\n      width: elemRect.width,\n      height: elemRect.height\n    };\n  }\n\n  private setAffixStyle(e: Event, affixStyle?: NgStyleInterface): void {\n    const originalAffixStyle = this.affixStyle;\n    const isWindow = this.target === window;\n    if (e.type === 'scroll' && originalAffixStyle && affixStyle && isWindow) {\n      return;\n    }\n    if (shallowEqual(originalAffixStyle, affixStyle)) {\n      return;\n    }\n\n    const fixed = !!affixStyle;\n    const wrapEl = this.fixedEl.nativeElement;\n    this.renderer.setStyle(wrapEl, 'cssText', getStyleAsText(affixStyle));\n    this.affixStyle = affixStyle;\n    if (fixed) {\n      wrapEl.classList.add(NZ_AFFIX_CLS_PREFIX);\n    } else {\n      wrapEl.classList.remove(NZ_AFFIX_CLS_PREFIX);\n    }\n    this.updateRtlClass();\n    if ((affixStyle && !originalAffixStyle) || (!affixStyle && originalAffixStyle)) {\n      this.nzChange.emit(fixed);\n    }\n  }\n\n  private setPlaceholderStyle(placeholderStyle?: NgStyleInterface): void {\n    const originalPlaceholderStyle = this.placeholderStyle;\n    if (shallowEqual(placeholderStyle, originalPlaceholderStyle)) {\n      return;\n    }\n    this.renderer.setStyle(this.placeholderNode, 'cssText', getStyleAsText(placeholderStyle));\n    this.placeholderStyle = placeholderStyle;\n  }\n\n  private syncPlaceholderStyle(e: Event): void {\n    if (!this.affixStyle) {\n      return;\n    }\n    this.renderer.setStyle(this.placeholderNode, 'cssText', '');\n    this.placeholderStyle = undefined;\n    const styleObj = {\n      width: this.placeholderNode.offsetWidth,\n      height: this.fixedEl.nativeElement.offsetHeight\n    };\n    this.setAffixStyle(e, {\n      ...this.affixStyle,\n      ...styleObj\n    });\n    this.setPlaceholderStyle(styleObj);\n  }\n\n  updatePosition(e: Event): void {\n    if (!this.platform.isBrowser) {\n      return;\n    }\n\n    const targetNode = this.target;\n    let offsetTop = this.nzOffsetTop;\n    const scrollTop = this.scrollSrv.getScroll(targetNode, true);\n    const elemOffset = this.getOffset(this.placeholderNode, targetNode!);\n    const fixedNode = this.fixedEl.nativeElement;\n    const elemSize = {\n      width: fixedNode.offsetWidth,\n      height: fixedNode.offsetHeight\n    };\n    const offsetMode = {\n      top: false,\n      bottom: false\n    };\n    // Default to `offsetTop=0`.\n    if (typeof offsetTop !== 'number' && typeof this.nzOffsetBottom !== 'number') {\n      offsetMode.top = true;\n      offsetTop = 0;\n    } else {\n      offsetMode.top = typeof offsetTop === 'number';\n      offsetMode.bottom = typeof this.nzOffsetBottom === 'number';\n    }\n    const targetRect = getTargetRect(targetNode as Window);\n    const targetInnerHeight = (targetNode as Window).innerHeight || (targetNode as HTMLElement).clientHeight;\n    if (scrollTop >= elemOffset.top - (offsetTop as number) && offsetMode.top) {\n      const width = elemOffset.width;\n      const top = targetRect.top + (offsetTop as number);\n      this.setAffixStyle(e, {\n        position: 'fixed',\n        top,\n        left: targetRect.left + elemOffset.left,\n        width\n      });\n      this.setPlaceholderStyle({\n        width,\n        height: elemSize.height\n      });\n    } else if (\n      scrollTop <= elemOffset.top + elemSize.height + (this.nzOffsetBottom as number) - targetInnerHeight &&\n      offsetMode.bottom\n    ) {\n      const targetBottomOffset = targetNode === window ? 0 : window.innerHeight - targetRect.bottom!;\n      const width = elemOffset.width;\n      this.setAffixStyle(e, {\n        position: 'fixed',\n        bottom: targetBottomOffset + (this.nzOffsetBottom as number),\n        left: targetRect.left + elemOffset.left,\n        width\n      });\n      this.setPlaceholderStyle({\n        width,\n        height: elemOffset.height\n      });\n    } else {\n      if (\n        e.type === AffixRespondEvents.resize &&\n        this.affixStyle &&\n        this.affixStyle.position === 'fixed' &&\n        this.placeholderNode.offsetWidth\n      ) {\n        this.setAffixStyle(e, {\n          ...this.affixStyle,\n          width: this.placeholderNode.offsetWidth\n        });\n      } else {\n        this.setAffixStyle(e);\n      }\n      this.setPlaceholderStyle();\n    }\n\n    if (e.type === 'resize') {\n      this.syncPlaceholderStyle(e);\n    }\n  }\n\n  private updateRtlClass(): void {\n    const wrapEl = this.fixedEl.nativeElement;\n    if (this.dir === 'rtl') {\n      if (wrapEl.classList.contains(NZ_AFFIX_CLS_PREFIX)) {\n        wrapEl.classList.add(`${NZ_AFFIX_CLS_PREFIX}-rtl`);\n      } else {\n        wrapEl.classList.remove(`${NZ_AFFIX_CLS_PREFIX}-rtl`);\n      }\n    } else {\n      wrapEl.classList.remove(`${NZ_AFFIX_CLS_PREFIX}-rtl`);\n    }\n  }\n}