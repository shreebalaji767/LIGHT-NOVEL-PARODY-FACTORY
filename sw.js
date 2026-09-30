const CACHE='lnpf-v13';
const APP_SHELL=['./','./index.html','./create.html','./library.html','./reader.html','./css/jekyll.css','./js/storage.js','./js/app.js','./js/library.js','./js/reader.js','./js/pwa.js','./manifest.webmanifest','./icons/icon-192.svg','./icons/icon-512.svg','./offline.html'];
const OFFLINE='./offline.html';
const VERSION='9.0';

self.addEventListener('install',event=>event.waitUntil(
  caches.open(CACHE).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting())
));

self.addEventListener('activate',event=>event.waitUntil(
  caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
    .then(()=>self.clients.claim())
));

self.addEventListener('message',event=>{
  if(event.data&&event.data.type==='SKIP_WAITING') self.skipWaiting();
  if(event.data&&event.data.type==='CLEAR_APP_CACHE') event.waitUntil(caches.delete(CACHE));
  if(event.data&&event.data.type==='GET_VERSION'&&event.ports?.[0]) event.ports[0].postMessage({version:VERSION,cache:CACHE});
});

async function networkFirst(request){
  try{
    const response=await fetch(request);
    if(response&&response.ok){
      const cache=await caches.open(CACHE);
      cache.put(request,response.clone());
    }
    return response;
  }catch{
    return (await caches.match(request))||caches.match(OFFLINE);
  }
}

async function staleWhileRevalidate(request){
  const cached=await caches.match(request);
  const update=fetch(request).then(response=>{
    if(response&&response.ok)caches.open(CACHE).then(cache=>cache.put(request,response.clone()));
    return response;
  }).catch(()=>cached);
  return cached||update;
}

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;
  if(event.request.mode==='navigate'){
    event.respondWith(networkFirst(event.request));
    return;
  }
  event.respondWith(staleWhileRevalidate(event.request));
});