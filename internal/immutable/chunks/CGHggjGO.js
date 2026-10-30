import"./DsnmJJEf.js";import{p as L,c as P,f as m,n as A,b as p,a as x,g as v,R as y,q as Q,P as T,Q as Z,m as c,o as l,j as R,X as k}from"./y9Sl5bMM.js";import{s as N,d as ee,a as C}from"./CePLiJTx.js";import{s as B,r as $,p as w,i as ae}from"./B7aqIt7k.js";import{I as M,a as O}from"./D4E3Eq-t.js";import{r as se}from"./lKpxaWlD.js";function te(e,a){L(a,!0);let s=$(a,["$$slots","$$events","$$legacy"]);const t=[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"}]];M(e,B({name:"copy"},()=>s,{get iconNode(){return t},children:(r,n)=>{var i=P(),o=m(i);N(o,()=>a.children??A),p(r,i)},$$slots:{default:!0}})),x()}function re(e,a){L(a,!0);let s=$(a,["$$slots","$$events","$$legacy"]);const t=[["path",{d:"M20 6 9 17l-5-5"}]];M(e,B({name:"check"},()=>s,{get iconNode(){return t},children:(r,n)=>{var i=P(),o=m(i);N(o,()=>a.children??A),p(r,i)},$$slots:{default:!0}})),x()}var ne=v("<!> Copied",1),oe=v("<!> Copy",1),ie=v('<figure><figcaption class="code-block-head"><span class="legend truncate text-[0.8125rem]! tracking-[0.04em]! normal-case!"> </span> <button type="button" class="key key-sm min-h-8! px-2.5!"><span aria-hidden="true"></span> <!></button></figcaption> <pre class="lcd"><code> </code></pre></figure>');function be(e,a){let s=w(a,"title",3,""),t=w(a,"class",3,""),r=Z(!1),n;async function i(){try{await navigator.clipboard.writeText(a.code),T(r,!0),clearTimeout(n),n=setTimeout(()=>T(r,!1),1600)}catch{}}var o=ie(),g=c(o),_=c(g),F=c(_,!0);l(_);var f=y(_,2);f.__click=i;var E=c(f),K=y(E,2);{var V=d=>{var u=ne(),h=m(u);re(h,{class:"size-3.5","aria-hidden":"true"}),k(),p(d,u)},J=d=>{var u=oe(),h=m(u);te(h,{class:"size-3.5","aria-hidden":"true"}),k(),p(d,u)};ae(K,d=>{R(r)?d(V):d(J,!1)})}l(f),l(g);var b=y(g,2),D=c(b),X=c(D,!0);l(D),l(b),l(o),Q(()=>{O(o,1,`code-block ${t()??""}`),C(F,s()),O(E,1,`led ${R(r)?"ok":""}`),C(X,a.code)}),p(e,o)}ee(["click"]);const De=[{id:"stable",label:"Stable"},{id:"dev",label:"Dev"}];function Te(e){return e.searchParams.get("channel")==="dev"?"dev":"stable"}function Re(e){const a=new URL(window.location.href);e==="dev"?a.searchParams.set("channel","dev"):a.searchParams.delete("channel"),a.href!==window.location.href&&se(a,{})}const de="ghcr.io/dertyp7214/synara",U=!1;function q(e){return e==="stable"&&U?"latest":"latest-dev"}function ke(e){return`${de}:${q(e)}`}function Ce(e){return e==="stable"&&!U}const ce=`services:
  synara:
    image: ghcr.io/dertyp7214/synara:latest-dev
    ports:
      - "8080:8080"
    environment:
      CLIENT_ID: admin                          # initial admin user (first run)
      CLIENT_SECRET: change-me                  # initial admin password
      JWT_SECRET: change-me-to-a-long-random-string
      DB_URL: jdbc:sqlite:/data/synara.db           # SQLite database file inside the data volume
      # CREDENTIALS_ENCRYPTION_KEY: ""          # openssl rand -base64 32
    volumes:
      - synara_data:/data
      - synara_config:/home/appuser/.config
      - synara_tiddl:/home/appuser/.tiddl
      - synara_backups:/backups
    restart: unless-stopped

volumes:
  synara_data:
  synara_config:
  synara_tiddl:
  synara_backups:
`,le=`services:
  synara:
    image: ghcr.io/dertyp7214/synara:latest-dev
    ports:
      - "8080:8080"
    environment:
      CLIENT_ID: admin                          # initial admin user (first run)
      CLIENT_SECRET: change-me                  # initial admin password
      JWT_SECRET: change-me-to-a-long-random-string
      DB_DRIVER: org.postgresql.Driver
      DB_URL: jdbc:postgresql://db:5432/synara
      DB_USER: postgres
      DB_PASSWORD: change-me-db-password
      # CREDENTIALS_ENCRYPTION_KEY: ""          # openssl rand -base64 32
    volumes:
      - synara_data:/data
      - synara_config:/home/appuser/.config
      - synara_tiddl:/home/appuser/.tiddl
      - synara_backups:/backups
    depends_on:
      db: { condition: service_healthy }
    restart: unless-stopped

  db:
    image: postgres:15
    command: -N 1000                            # Synara opens many connections
    environment:
      POSTGRES_DB: synara
      POSTGRES_PASSWORD: change-me-db-password
    volumes:
      - postgres:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 30s
      start_period: 15s
    restart: unless-stopped

volumes:
  synara_data:
  synara_config:
  synara_tiddl:
  synara_backups:
  postgres:
`,ue=`services:
  synara:
    image: ghcr.io/dertyp7214/synara:latest-dev
    ports: ["8080:8080"]
    environment:
      CLIENT_ID: admin
      CLIENT_SECRET: change-me
      JWT_SECRET: change-me-to-a-long-random-string
      # CREDENTIALS_ENCRYPTION_KEY: ""
      # SERVER_SSL_SUPPORTED: "true"            # if your HTTPS proxy sends no X-Forwarded-Proto
      DB_DRIVER: org.postgresql.Driver
      DB_URL: jdbc:postgresql://db:5432/synara
      DB_USER: postgres
      DB_PASSWORD: change-me-db-password
      REDIS_HOST: redis-cluster
      REDIS_PORT: "7000"
      AUDIO_EMBED_URL: http://audio-embed:8200
      RECSYS_DATA_DIR: /recsys
    volumes:
      - synara_data:/data
      - synara_config:/home/appuser/.config
      - synara_tiddl:/home/appuser/.tiddl
      - synara_backups:/backups
      - recsys_data:/recsys
    depends_on:
      db: { condition: service_healthy }
      redis-cluster: { condition: service_healthy }
    restart: unless-stopped

  db:
    image: postgres:15
    command: -N 1000                            # Synara opens many connections
    environment:
      POSTGRES_DB: synara
      POSTGRES_PASSWORD: change-me-db-password
    volumes: ["postgres:/var/lib/postgresql/data"]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 30s
      start_period: 15s
    restart: unless-stopped

  redis-cluster:
    image: ghcr.io/dertyp7214/synara-redis-cluster:latest-dev
    environment:
      NODES: "3"
      REPLICAS: "0"
      PORT_START: "7000"
      HOST: redis-cluster
      MAXMEMORY: 1gb
      MAXMEMORY_POLICY: allkeys-lfu
    volumes: ["redis_data:/data"]
    healthcheck:
      test: ["CMD-SHELL", "redis-cli -p 7000 cluster info | grep -q cluster_state:ok"]
      interval: 10s
      start_period: 15s
    restart: unless-stopped

  audio-embed:
    image: ghcr.io/dertyp7214/synara-audio-embed:latest-dev
    volumes: ["synara_data:/data:ro"]
    restart: unless-stopped

  recsys:
    image: ghcr.io/dertyp7214/synara-recsys:latest-dev
    volumes: ["recsys_data:/data"]
    restart: unless-stopped

volumes:
  synara_data:
  synara_config:
  synara_tiddl:
  synara_backups:
  recsys_data:
  postgres:
  redis_data:
`;function S(e,a){const s=q(a);return s==="latest-dev"?e:e.replaceAll(/(ghcr\.io\/dertyp7214\/[a-z-]+):latest-dev/g,`$1:${s}`)}const we=e=>S(ce,e),Oe=e=>S(le,e),Ie=e=>S(ue,e),G="DerTyp7214/Synara",H={stable:"latest-android",dev:"latest-dev-android"},Le=e=>`https://github.com/${G}/releases/download/${H[e]}/Synara.apk`,Y="DerTyp7214/SynaraDesktop",pe=`https://github.com/${Y}/releases/download/latest-dev`,W=[{kind:"deb",os:"linux",suffix:"linux-x64.deb",label:"Linux",format:"Debian / Ubuntu",ext:".deb"},{kind:"tar",os:"linux",suffix:"linux-x64.tar.gz",label:"Linux",format:"Portable archive",ext:".tar.gz"},{kind:"msi",os:"windows",suffix:"windows-x64.msi",label:"Windows",format:"Installer",ext:".msi"},{kind:"dmg",os:"macos",suffix:"macos-arm64.dmg",label:"macOS (Apple Silicon)",format:"Disk image",ext:".dmg"}];function Pe(e){return W.find(a=>a.os===e)?.kind??null}const I=null;function Ae(e){return e==="stable"&&!0}function z(e){return e==="stable"&&I?I:pe}function xe(e,a){const s=z(e),t={};for(const r of W)t[r.kind]=`${s}/${a}-${r.suffix}`;return t}function Ne(e){return`[synara]
SigLevel = Optional TrustAll
Server = ${z(e)}`}const me=600*1e3;async function j(e,a){const s=`synara-gh:${e}`;try{const n=JSON.parse(sessionStorage.getItem(s)??"null");if(n&&Date.now()-n.at<me)return n.data}catch{}const t=await fetch(`https://api.github.com/repos/${e}`,{headers:{Accept:"application/vnd.github+json"},signal:a});if(!t.ok)throw new Error(`GitHub API ${t.status}`);const r=await t.json();try{sessionStorage.setItem(s,JSON.stringify({at:Date.now(),data:r}))}catch{}return r}const ge=(e,a)=>j(`${e}/releases?per_page=20`,a),_e=(e,a,s)=>j(`${e}/releases/tags/${a}`,s);async function Be(e){return(await _e(Y,"latest-dev",e)).assets.filter(t=>t.name.startsWith("Synara-")).map(t=>t.updated_at).sort().at(-1)??null}async function $e(e){const a=await ge(G,e),s={};for(const t of["stable","dev"]){const r=a.find(n=>n.tag_name===H[t])?.assets.find(n=>n.name==="Synara.apk");r&&(s[t]={updated:r.updated_at,size:r.size})}return s}function Me(e){const a=new Date(e);return Number.isNaN(a.getTime())?"":a.toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}function Ue(e){return`${Math.round(e/1024/1024)} MB`}function qe(){if(typeof navigator>"u")return null;const a=(navigator.userAgentData?.platform??"").toLowerCase(),s=navigator.userAgent.toLowerCase();return a==="android"||s.includes("android")?"android":/iphone|ipad|ipod/.test(s)||s.includes("macintosh")&&navigator.maxTouchPoints>1?"ios":a==="windows"||s.includes("windows")?"windows":a==="macos"||s.includes("mac os")?"macos":a==="linux"||a==="chrome os"||s.includes("linux")||s.includes("x11")?"linux":null}export{De as C,W as D,be as a,xe as b,Te as c,Ae as d,Le as e,Me as f,Ue as g,ke as h,Ce as i,qe as j,Be as k,$e as l,Ie as m,Oe as n,we as o,Ne as p,re as q,Pe as r,q as s,Re as w};
