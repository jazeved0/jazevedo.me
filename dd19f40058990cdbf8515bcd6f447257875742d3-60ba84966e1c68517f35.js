"use strict";(self.webpackChunkjazevedo_me=self.webpackChunkjazevedo_me||[]).push([[428],{1193:function(e,a,t){t.d(a,{Z:function(){return k}});var l,c=t(4316),n=t(7294),i=t(3723),d=t(4967),r=t(917),o=t(674),s=t(29);const f=Object.fromEntries(Object.entries(o.ZW).map((e=>{let[a,t]=e;return[a,t.map((e=>(0,d.Oq)(e)))]}))),b={HeroLayout:(0,c.Z)("div",{target:"etg72xq1"})("display:grid;height:min(100%, 100vh);width:100%;z-index:-1;user-select:none;.dark-fallback,.light-fallback{max-height:100vh;}",(0,o.xJ)(o.UX.Light),"{.dark-fallback{display:none;}}",(0,o.xJ)(o.UX.Dark),"{.light-fallback{display:none;}}@media (forced-colors: active){.dark-fallback,.light-fallback{display:none;}}"),makeWaveCanvasClassName:e=>{return e(l||(a=["\n    opacity: 0;\n    transition: opacity 1s linear;\n    grid-area: 1/1;\n    height: 100%;\n    width: 100%;\n    z-index: 1;\n    max-height: 100vh;\n    &.wave-canvas-loaded {\n      opacity: 1;\n    }\n\n    /* When forced-colors or prefers-reduced-motion are enabled, hide the\n    canvas. This is also done in script, but duplicate it here. */\n    @media (forced-colors: active) {\n      display: none;\n    }\n    @media (prefers-reduced-motion: reduce) {\n      display: none;\n    }\n  "],t||(t=a.slice(0)),a.raw=t,l=a));var a,t},HeroMask:(0,c.Z)("div",{target:"etg72xq0"})("height:100%;",(g=o.UX,Object.keys(g).filter((e=>Number.isNaN(+e)))).map((e=>"\n          "+(0,o.xJ)(o.UX[e])+" {\n            background-color:\n              "+(0,d.m4)((0,o.pz)("bg",o.UX[e]),.3)+";\n            background-image: linear-gradient(\n                "+(0,d.m4)((0,o.pz)("bg",o.UX[e]),0)+",\n                "+(0,d.m4)((0,o.pz)("bg",o.UX[e]),0)+" 30%,\n                "+(0,d.m4)((0,o.pz)("bg",o.UX[e]),1)+" 95%,\n                "+(0,d.m4)((0,o.pz)("bg",o.UX[e]),1)+"\n              ),\n              radial-gradient(\n                circle 40vw at right 20% bottom 0%,\n                "+(0,d.m4)((0,o.pz)("bg",o.UX[e]),.8)+",\n                "+(0,d.m4)((0,o.pz)("bg",o.UX[e]),0)+"\n              ),\n              radial-gradient(\n                circle 40vw at right 20% bottom 30%,\n                "+(0,d.m4)((0,o.pz)("bg",o.UX[e]),.8)+",\n                "+(0,d.m4)((0,o.pz)("bg",o.UX[e]),0)+"\n              ),\n              radial-gradient(\n                circle 40vw at right 20% bottom 40%,\n                "+(0,d.m4)((0,o.pz)("bg",o.UX[e]),.8)+",\n                "+(0,d.m4)((0,o.pz)("bg",o.UX[e]),0)+"\n              ),\n              radial-gradient(\n                circle 35vw at left -5% bottom 0%,\n                "+(0,d.m4)((0,o.pz)("bg",o.UX[e]),.8)+",\n                "+(0,d.m4)((0,o.pz)("bg",o.UX[e]),0)+"\n              ),\n              radial-gradient(\n                circle 35vw at left -5% bottom 5%,\n                "+(0,d.m4)((0,o.pz)("bg",o.UX[e]),.8)+",\n                "+(0,d.m4)((0,o.pz)("bg",o.UX[e]),0)+"\n              ),\n              radial-gradient(\n                circle 35vw at left 50% bottom 0%,\n                "+(0,d.m4)((0,o.pz)("bg",o.UX[e]),.5)+",\n                "+(0,d.m4)((0,o.pz)("bg",o.UX[e]),0)+"\n              );\n          }")).join("\n"),"@media (forced-colors: active){display:none;}")};var g;function k(e){let{className:a,style:l}=e;const c=(0,s.RJ)(),n=(0,s.ac)("(prefers-reduced-motion: reduce)"),d=(0,s.ac)("(forced-colors: active)"),o=!c&&!d&&!n;return(0,r.tZ)(b.HeroLayout,{className:a,style:l},(0,r.tZ)(i.S,{className:"dark-fallback",style:{gridArea:"1/1",zIndex:0,userSelect:"none"},layout:"fullWidth",alt:"",src:"../images/hero/fallback.dark.png",placeholder:"blurred",formats:["auto","webp","avif"],quality:60,draggable:!1,__imageData:t(1424)}),(0,r.tZ)(i.S,{className:"light-fallback",style:{gridArea:"1/1",zIndex:0,userSelect:"none"},layout:"fullWidth",alt:"",src:"../images/hero/fallback.light.png",placeholder:"blurred",formats:["auto","webp","avif"],quality:60,draggable:!1,__imageData:t(2404)}),o&&(0,r.tZ)(p,null),(0,r.tZ)(b.HeroMask,{style:{gridArea:"1/1",zIndex:2}}))}const m=n.lazy((async()=>{await async function(){return"requestIdleCallback"in window?new Promise((e=>{window.requestIdleCallback((()=>e()),{timeout:2e3})})):new Promise((e=>{setTimeout((()=>e()),500)}))}();return await Promise.all([t.e(737),t.e(498)]).then(t.bind(t,192))}));function p(){const e=(0,s.If)(),{0:a,1:t}=(0,n.useState)(!1),l=(0,n.useCallback)((()=>{t(!0)}),[]),c=(0,n.useRef)(null);(0,s.ek)({takeHeroBackgroundFallbacks:()=>{var e;window.console.log("[HeroBackground] Taking screenshots...");const a=null===(e=c.current)||void 0===e?void 0:e.rendererRef.current;null!=a?(Object.values(o.UX).forEach((e=>{var t;a.seekToTime(0),a.setFallbackColor(f[e][0]),a.setColors(f[e]);const l=null!==(t=a.exportImage("image/png"))&&void 0!==t?t:"";if(""===l)return void window.console.error("[HeroBackground] Failed to take screenshot");const c=document.createElement("a");c.download="fallback."+e+".png",c.href=l,c.click(),window.console.log("[HeroBackground] Took screenshot for "+e)})),window.console.log("[HeroBackground] Success")):window.console.error("[HeroBackground] Failed to make fallback images: no renderer ref")}},[]);const i=[1.5,.5],d=[2.5,1],g=[.001,.2,.4,.6,.8,1],{0:k,1:p}=(0,n.useState)(0),u=e=>32/g[e],h=e=>3*g[e],w=e=>i.map((a=>a*g[e])),v=e=>3*g[e],z=e=>d.map((a=>a*g[e]));return(0,n.useEffect)((()=>{if(a&&k<g.length-1){const e=setTimeout((()=>{var e;const a=null===(e=c.current)||void 0===e?void 0:e.rendererRef.current;if(null!=a){const e=k+1,t=g[k],l=g[e],c=a.getTime()*t/l;a.seekToTime(c),a.setTimeOffset(u(e)),a.setDeformNoiseSpeed(h(e)),a.setDeformNoiseScrollSpeed(w(e)),a.setLightNoiseSpeed(v(e)),a.setLightNoiseScrollSpeed(z(e)),p(e)}}),1e3);return()=>clearTimeout(e)}}),[k,a]),(0,r.tZ)(r.ms,null,(t=>{let{css:i,cx:d}=t;return(0,r.tZ)(n.Suspense,{fallback:null},(0,r.tZ)(m,{ref:c,colors:f[e],fallbackColor:f[e][0],className:d(b.makeWaveCanvasClassName(i),{"wave-canvas-loaded":a}),onLoad:l,timeOffset:u(k),deformNoiseSpeed:h(k),deformNoiseScrollSpeed:w(k),lightNoiseSpeed:v(k),lightNoiseScrollSpeed:z(k),subdivision:72,deformNoiseFrequency:[2,1.5],deformNoiseStrength:5,deformNoiseClampLow:0,deformNoiseClampHigh:1,lightNoiseFrequency:1.25,lightNoiseClampLow:-.3,lightNoiseClampHigh:1,lightBlendStrength:1,perLightNoiseOffset:.2}))}))}},1424:function(e){e.exports=JSON.parse('{"layout":"fullWidth","placeholder":{"fallback":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEGUlEQVR42k2UV3PbVhBGQZESRfVKNaJ3sNlSbE8mD5lJHpJIYkUnRKo4/v8/4WTupez4YQe4GOBg99tvV2l6JdvegqZbsuUUbDs5p16JEVSEYUUYLLDdjI4150wb0+rcs9F5oKaP2bFijr2Cdlhx012hd1co236FiDUwp2XntL0SO6gYRE/cRU/0gxLXTemYU47VR7Y797S0MYdWzKlXcBFWdLorrN4zyk64/AHctHN27JxLr8QJFkTBgg9hxefuEwO/wHESro0JJ9qYE3PGmZNy7hdchU8YvRW9wSvKcf+V1vcM7Zw9O+faK2WpvldgOimRX/BZZOoX2HaCasdcOSltN+fSL1GjJ/z+C/2P/6K0h185i1Y0nYKGlXHsFPSiJz53lzK70C/QnQTHzRgEJYGXo7opFxKYcRWUGN0l+vCN9sdvKBcfv6EN3tCiJTf+Yg3rrbjrLhlGT7Jsy8u5tGJOjCkn+oQjY8KhOePYTmj7BWdhxW60Yrf3itLuvUgNrv0F2nuoP0XHK6UEF27BkZ2yrU9pqCMZW/qETWNGzZhTtzOa3gLlwE5omTF1I6ZhpbLszffYEi/ZGTt2xr6Tc+gUUuMtM0bRJiidEcrNA0rnUZ5rVoyyZczZ0OfUzeQdmP4AN+z/z00rY9fO2LMzWlZCQ59S1ybUtTEb6qP0prgqNW26zs5MaZjJGvwO3xRhZ7L7TSdn18klcMdMaJpztqyYhjFlQx1Ru3mgdv0PSv2njyXQiNkQmhixhIvncoK8BXt+xb5b0rJT6nayLtGYoWhjlM4Dys09SsvJZRaiRAEQAtf0mQwhRc2MZektO2HbnLNpTNcAfbKGiRD36nit6ZmTcermnLg5B05OUwo+RVEn8rpjxrTNGSfqI63rv9m4+gtFlKauG6HoUzZ+6DlBOdRGXBhTNDvG9XLCoMTzSyyvIPBLbsMFAz/HdRJUc8Zu534NfO+s0PDInHNgzGgJ4Kk24sqYYNkxkZdxFy74rbvkj/4zfw5e+L3/zK/dJXdRxSBYcGlOadzcy47WtDFHVozrl3SclCMhx4U+kX/2nYShX3AXlHwKF3yJKr6IqYkqbsOKocg0quTkHOpjaWxh8iis+NR7JggXXNkpSsecYVpzIjfjNij5EJT0/ILQy/HcFMdJsZwEzU7QnRQ3KDH9Qm4bKyj5bfjGl8ELfbEP/RLFFNq9Zyf0CsRC9Qo0J+PKijk3ZhzrE/bUEbvqiH1jyrmbyQ3jDd/oDr9yO3il11vJsVW6Xk7fz/klXOAElVwQ137JhVdw6qTsm3O2xTR891nnkZoxpenmHEYrzvuvXPdfULvPqNESRXNzuZYMN+NYbBRzzpE548CcsSc6Z0zZFL4TNhGdVUdruxhz6c89f8F5tETrPeP2X/gPNaJsB/QW1voAAAAASUVORK5CYII="},"images":{"fallback":{"src":"/static/9f75f8d3e88d2699a659cd0e83525ed4/6e0af/fallback.dark.png","srcSet":"/static/9f75f8d3e88d2699a659cd0e83525ed4/4375a/fallback.dark.png 750w,\\n/static/9f75f8d3e88d2699a659cd0e83525ed4/3631c/fallback.dark.png 1080w,\\n/static/9f75f8d3e88d2699a659cd0e83525ed4/b94c8/fallback.dark.png 1366w,\\n/static/9f75f8d3e88d2699a659cd0e83525ed4/6e0af/fallback.dark.png 1920w","sizes":"100vw"},"sources":[{"srcSet":"/static/9f75f8d3e88d2699a659cd0e83525ed4/016c7/fallback.dark.avif 750w,\\n/static/9f75f8d3e88d2699a659cd0e83525ed4/c3583/fallback.dark.avif 1080w,\\n/static/9f75f8d3e88d2699a659cd0e83525ed4/97e57/fallback.dark.avif 1366w,\\n/static/9f75f8d3e88d2699a659cd0e83525ed4/b6f35/fallback.dark.avif 1920w","type":"image/avif","sizes":"100vw"},{"srcSet":"/static/9f75f8d3e88d2699a659cd0e83525ed4/27d30/fallback.dark.webp 750w,\\n/static/9f75f8d3e88d2699a659cd0e83525ed4/d83ef/fallback.dark.webp 1080w,\\n/static/9f75f8d3e88d2699a659cd0e83525ed4/9ea32/fallback.dark.webp 1366w,\\n/static/9f75f8d3e88d2699a659cd0e83525ed4/ca27b/fallback.dark.webp 1920w","type":"image/webp","sizes":"100vw"}]},"width":1,"height":1}')},2404:function(e){e.exports=JSON.parse('{"layout":"fullWidth","placeholder":{"fallback":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEpklEQVR42k2TaW8TZxRG599WbVFblVaFUlBCEatKBA1LINCkJB473ma8O97t8R7HWUgoEv0D4Jl3Ni/Z3lMltFI/HD3fzl10rzLYgf4ubA8lu9uS/R7sNU4ZFKY0Ui5ZzUaNCp6GLW6FLH6ICL5KCS6VbOYrDkt1j2DLJ932KTfGKJ19SXdPMhjC3kDytgv71VO2chMamkMxYqGFLVZDFguqyfWgxfdRi59SggebDi9qLmtNj0jLRas7KPXDU86lg6FkfyA5aEv2Kyf0MmMqcYdCRLAZMokETV6qJvdVk/mwxV1dsHgurDqsGg7Bho1etFByf81o70u2h/C2LzlsSXZLxxi6Ry7mEI05xMOCrDoipI5YCposRiyepmyeFmyeV2xe12zUioXesFCSf02obx+xsw3v+nDQOKOX8KhtWBfdaVHBnzGbNxFBJGSyHjZZTggWszaPCzZPyoIXVYs3WzaxD2MU/cOY4taYTmPKsHxEL+nRigiMqKAWsylpDmndJZjwWNJc7sUEN3XBfFpwa1Nwt2LxrO2gvTui8PcJSmTHJ2dMMCoztoozhoUZO8WjC3b/ZVg8ZlA6plk6IVo4YjE74U7W507B41l1wkbzBL1/SnLnBCVYnlCsnjJow7ve57Ev8l8Ou3DY5mK3h03JQRM6BmRqknD5jPXiKUulI57UZjzvzFC06gkNA7Y7kr3u+dlIDnuSdz3JYf9/dCUHLcnbpqRdl+QrZ6wVj3lYGPNrzudaxuXnnItSqEv6bdjtSIYdyaD9Oc/F/0n3t7jgoA17BnTOu6sdcbvhcaPicjXvcjnl8K1mo+ycV+595lzUbUnaTUmvJRm2JYOupLUtae5KuttndLqnhJszrnVcfug4/GS4XKl4XNn0uJLxUD504X0P3vdhrwutFlQNqDYkNQPyHclG75jnjTG/VXzmyy5fl20u1R2uGC5zhs/d+oTfKlMeFaco6eKUVvWYfv2ErcYpjcYZ+bokWZdEG2f8WZ6yEBP8opp8o1p8ERZ8mbL5ruRyrebxoD5hqTLjdWnGSvEI5XrE4n7E4knEYjVqEY0JkppDQnfR4jZxdYS6PuKVavIoaHF1Q/BNwubypstcxedxecJKzud1ZszLzATlbkjwULV4oZqsB0y0wIjN9U/U1j5irH2kHvhEQR2RDI2Ihk0ehgU/ajZXcy63Sz7LeZ+wLnijOywlPJSFkGBRtVgNmMQCJsnAiExgRP5crI7IqyPSIRMtbBKPmQRjJnfiNnMZl4W8j64LCnGTVMImlvJRnoUEL1ULNWCSCIxIBy2SIUE8JIhsCEIhwdqGYDkqeBG3WNFNXiUsHqUc1Iygqo+o6ibVtE0rP0FZDQreqBbRgEkhaNFJ+NSTY/IJn6jusxL3eBxzuB1zmNdsfk3ZLGwKXlcFmmFTqNvUsoJWzr14V0ULWRej5lSTZnZMszwlXxoTLfmsFDx+z3vcyXjcSHtczXpcL/jcq49Z7k/Q9qcU386oDqYYnSkdY4qipzxSIYsNzWE56/E47XA/bXM7Y3Mra3Mz7zCXd7m+6TFXGnOvMuFRbcrz5ow/+jPUwZRIf4zWcknVHP4Byvs9aCg6zBYAAAAASUVORK5CYII="},"images":{"fallback":{"src":"/static/d7714df0f460851a909c750abbeb13fa/6e0af/fallback.light.png","srcSet":"/static/d7714df0f460851a909c750abbeb13fa/4375a/fallback.light.png 750w,\\n/static/d7714df0f460851a909c750abbeb13fa/3631c/fallback.light.png 1080w,\\n/static/d7714df0f460851a909c750abbeb13fa/b94c8/fallback.light.png 1366w,\\n/static/d7714df0f460851a909c750abbeb13fa/6e0af/fallback.light.png 1920w","sizes":"100vw"},"sources":[{"srcSet":"/static/d7714df0f460851a909c750abbeb13fa/016c7/fallback.light.avif 750w,\\n/static/d7714df0f460851a909c750abbeb13fa/c3583/fallback.light.avif 1080w,\\n/static/d7714df0f460851a909c750abbeb13fa/97e57/fallback.light.avif 1366w,\\n/static/d7714df0f460851a909c750abbeb13fa/b6f35/fallback.light.avif 1920w","type":"image/avif","sizes":"100vw"},{"srcSet":"/static/d7714df0f460851a909c750abbeb13fa/27d30/fallback.light.webp 750w,\\n/static/d7714df0f460851a909c750abbeb13fa/d83ef/fallback.light.webp 1080w,\\n/static/d7714df0f460851a909c750abbeb13fa/9ea32/fallback.light.webp 1366w,\\n/static/d7714df0f460851a909c750abbeb13fa/ca27b/fallback.light.webp 1920w","type":"image/webp","sizes":"100vw"}]},"width":1,"height":1}')}}]);
//# sourceMappingURL=dd19f40058990cdbf8515bcd6f447257875742d3-60ba84966e1c68517f35.js.map