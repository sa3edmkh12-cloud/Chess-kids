const C='chess-kids-v1';
const CORE=['./','index.html','manifest.webmanifest','icon.svg','icon-192.png','icon-512.png'];
const CDN=['https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js','https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(C).then(c=>Promise.all([
    c.addAll(CORE),
    ...CDN.map(u=>fetch(u).then(r=>r.ok&&c.put(u,r)).catch(()=>{}))
  ])).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(hit=>{
    const net=fetch(e.request).then(r=>{
      if(r&&(r.ok||r.type==='opaque')){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp))}
      return r;
    }).catch(()=>hit);
    return hit||net;
  }));
});
