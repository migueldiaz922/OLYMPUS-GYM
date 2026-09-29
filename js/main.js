(function(){
"use strict";
var $=function(s,c){return (c||document).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var CFG={wa:'573104363537',tz:'America/Bogota'};
function wa(m){return 'https://wa.me/'+CFG.wa+'?text='+encodeURIComponent(m)}
var fmt=function(n){return new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(n)};

/* WhatsApp links */
$$('[data-wa]').forEach(function(a){a.href=wa(a.getAttribute('data-wa'));a.target='_blank';a.rel='noopener'});

/* Ripple feedback */
document.addEventListener('pointerdown',function(e){var b=e.target.closest&&e.target.closest('.btn');if(!b||reduce)return;var r=b.getBoundingClientRect(),d=Math.max(r.width,r.height)*1.6,s=document.createElement('span');s.className='ripple';s.style.cssText='width:'+d+'px;height:'+d+'px;left:'+(e.clientX-r.left-d/2)+'px;top:'+(e.clientY-r.top-d/2)+'px';b.appendChild(s);s.addEventListener('animationend',function(){s.remove()})});

/* Header + menu */
var hdr=$('#hdr'),mb=$('#menuBtn');
function setMenu(o){hdr.classList.toggle('open',o);mb.setAttribute('aria-expanded',o);mb.setAttribute('aria-label',o?'Cerrar menú':'Abrir menú');mb.innerHTML='<svg class="ic" aria-hidden="true"><use href="#'+(o?'i-x':'i-menu')+'"/></svg>';document.body.classList.toggle('noscroll',o)}
mb.addEventListener('click',function(){setMenu(!hdr.classList.contains('open'))});
$$('#nav a').forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});
document.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false)});

/* Scroll loop: header, hero parallax, route progress */
var layers=$$('[data-depth]'),spd={r1:.34,r2:.2,r3:.06},mxs={r1:6,r2:12,r3:22},mx=0,ticking=false;
var route=$('#route'),fill=$('#routeFill'),steps=$$('#route li');
function frame(){
  ticking=false;var y=window.scrollY||0;
  hdr.classList.toggle('solid',y>40);
  if(!reduce&&y<window.innerHeight*1.2){layers.forEach(function(s){var k=s.getAttribute('data-depth');s.style.transform='translate3d('+(mx*mxs[k]).toFixed(1)+'px,'+(y*spd[k]).toFixed(1)+'px,0)'})}
  if(route){var r=route.getBoundingClientRect(),vh=window.innerHeight,p=Math.min(1,Math.max(0,(vh*.65-r.top)/r.height));fill.style.transform='scaleY('+p.toFixed(3)+')';steps.forEach(function(li){li.classList.toggle('on',li.getBoundingClientRect().top<vh*.65)})}
}
function req(){if(!ticking){ticking=true;requestAnimationFrame(frame)}}
window.addEventListener('scroll',req,{passive:true});window.addEventListener('resize',req);
if(!reduce&&matchMedia('(pointer:fine)').matches){window.addEventListener('pointermove',function(e){mx=(e.clientX/window.innerWidth-.5)*2;req()},{passive:true})}
frame();

/* Reveal + counters + section tracking */
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
$$('[data-reveal]').forEach(function(el){io.observe(el)});
function count(el){var to=+el.dataset.count,suf=el.dataset.suf||'',t0=performance.now(),d=1500;if(reduce){el.textContent=to.toLocaleString('es-CO')+suf;return}(function f(t){var k=Math.min(1,(t-t0)/d),e=1-Math.pow(1-k,3);el.textContent=Math.round(to*e).toLocaleString('es-CO')+suf;if(k<1)requestAnimationFrame(f)})(t0)}
var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){count(e.target);cio.unobserve(e.target)}})},{threshold:.6});
$$('[data-count]').forEach(function(el){cio.observe(el)});
var tabs=$$('.tabs a[data-sec]');
var sio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){tabs.forEach(function(a){a.classList.toggle('cur',a.dataset.sec===e.target.id)})}})},{rootMargin:'-45% 0px -50% 0px'});
['inicio','planes','clases','ubicacion'].forEach(function(id){var s=document.getElementById(id);if(s)sio.observe(s)});

/* Goal picker */
var GOALS={
  peso:{t:'Quema calorías sin aburrirte',x:'Combinamos cardio guiado y clases de energía con pesas para conservar músculo. Te recomendamos el plan Integral.',mix:[['Cardio',50],['Fuerza',35],['Movilidad',15]],plan:'Integral',label:'bajar de peso'},
  musculo:{t:'Fuerza progresiva con técnica',x:'Más peso libre, cargas que suben con el tiempo y un entrenador que corrige tu forma. Te recomendamos el plan Integral.',mix:[['Fuerza',65],['Cardio',20],['Movilidad',15]],plan:'Integral',label:'ganar músculo'},
  salud:{t:'Un hábito que sí puedes sostener',x:'Sesiones cortas y variadas para moverte mejor y dormir mejor. Te recomendamos el plan Básico.',mix:[['Cardio',35],['Fuerza',40],['Movilidad',25]],plan:'Básico',label:'sentirme con más energía'},
  rendimiento:{t:'Entrena para rendir en tu deporte',x:'Fuerza, potencia y capacidad aeróbica con seguimiento cercano. Te recomendamos la Tiquetera.',mix:[['Fuerza',50],['Cardio',35],['Movilidad',15]],plan:'Tiquetera',label:'mejorar mi rendimiento'}
};
function goal(k){
  var g=GOALS[k];$('#pkTitle').textContent=g.t;$('#pkText').textContent=g.x;
  var box=$('#pkMix');box.innerHTML=g.mix.map(function(m){return '<div class="mix-row"><span>'+m[0]+'</span><div class="bar"><i data-w="'+m[1]+'"></i></div><output>'+m[1]+'%</output></div>'}).join('');
  requestAnimationFrame(function(){requestAnimationFrame(function(){$$('#pkMix i').forEach(function(i){i.style.width=i.dataset.w+'%'})})});
  $('#pkCta').href=wa('Hola, mi meta es '+g.label+'. Me interesa el plan '+g.plan+'.');
  $$('.chip[data-goal]').forEach(function(c){c.setAttribute('aria-checked',c.dataset.goal===k)});
  var s=$('#fm');if(s){var idx={peso:0,musculo:1,salud:2,rendimiento:3}[k];s.selectedIndex=idx}
}
$$('.chip[data-goal]').forEach(function(c){c.addEventListener('click',function(){goal(c.dataset.goal)})});
goal('peso');

/* Plans Data Integrada */
var PLANS=[
 {n:'Básico',base:85000,d:'Entrenamiento libre a tu propio ritmo.',f:['Sala de pesas y máquinas','Casilleros y duchas','(No incluye clases, asesoría ni caminadoras)']},
 {n:'Integral',base:105000,hot:1,d:'La experiencia completa de Olympus Gym.',f:['Sala de pesas y máquinas','Asesoría en tus entrenamientos','Clases grupales incluidas','Uso libre de caminadoras']},
 {n:'Tiquetera',base:92000,elite:1,d:'Flexibilidad para entrenar cuando puedas.',f:['12 ingresos en el mes','Asesoría en tus entrenamientos','Clases grupales incluidas','Uso libre de caminadoras']}
];
var pEl=$('#plans');
pEl.innerHTML=PLANS.map(function(p,i){return '<article class="plan'+(p.hot?' hot':'')+(p.elite?' elite':'')+'">'+(p.hot?'<span class="flag">El más elegido</span>':'')+'<h3>'+p.n+'</h3><p class="pd">'+p.d+'</p><p class="price"><span class="amt" data-i="'+i+'"></span><span class="per">'+(p.n==='Tiquetera'?'/ 12 fichos':'/mes')+'</span></p><p class="tot">Sin cláusulas de permanencia.</p><ul>'+p.f.map(function(x){return '<li><svg class="ic" aria-hidden="true"><use href="#i-check"/></svg>'+x+'</li>'}).join('')+'</ul><a class="btn '+(p.hot?'btn-ink':p.elite?'btn-star':'btn-line')+'" data-i="'+i+'" target="_blank" rel="noopener">Elegir '+p.n+'</a></article>'}).join('');

function tween(el,to,instant){var from=+el.dataset.v||0;el.dataset.v=to;if(reduce||instant){el.textContent=fmt(to);return}var t0=performance.now();(function f(t){var k=Math.min(1,(t-t0)/450),e=1-Math.pow(1-k,3);el.textContent=fmt(Math.round((from+(to-from)*e)/1000)*1000);if(k<1)requestAnimationFrame(f)})(t0)}
function renderPlans(first){
  $$('.amt',pEl).forEach(function(a){var p=PLANS[+a.dataset.i],m=p.base;tween(a,m,first);var art=a.closest('.plan');$('.btn',art).href=wa('Hola, quiero inscribirme en el plan '+p.n+' ('+fmt(m)+'). ¿Cómo sigo?')});
}
renderPlans(true);


/* Open now */
var HRS=[[5.166,21.5],[5.166,21.5],[5.166,21.5],[5.166,21.5],[5.166,21.5],[8,15],[8,13]];
var FULL=['lunes','martes','miércoles','jueves','viernes','sábado','domingo'];
function bogota(){return new Date(new Date().toLocaleString('en-US',{timeZone:CFG.tz}))}
function h12(h){var s=h>=12?'p. m.':'a. m.',x=Math.floor(h)%12||12,m=Math.round((h%1)*60);return x+':'+(m<10?'0'+m:m)+' '+s}
function openNow(){
  var n=bogota(),d=(n.getDay()+6)%7,t=n.getHours()+n.getMinutes()/60,H=HRS[d],el=$('#status'),tx=$('span',el);
  if(H[1]>0 && t>=H[0]&&t<H[1]){el.classList.add('open');tx.textContent='Abierto ahora. Cierra a las '+h12(H[1])}
  else{
    el.classList.remove('open');
    var k=t<H[0]?0:1,nd=(d+k)%7;
    while(HRS[nd][1]===0){k++;nd=(d+k)%7;}
    var lbl=k===0?'hoy':(k===1?'mañana':FULL[nd]);
    tx.textContent='Cerrado ahora. Abre '+lbl+' a las '+h12(HRS[nd][0]);
  }
}
openNow();setInterval(openNow,60000);

/* Lead form -> WhatsApp */
var form=$('#lead');
form.addEventListener('submit',function(e){
  e.preventDefault();
  var nm=$('#fn').value.trim(),ph=$('#fc').value.replace(/[\s\-().+]/g,'').replace(/^57/,''),ok=true;
  $('#e-fn').textContent='';$('#e-fc').textContent='';$('#e-fk').textContent='';
  if(nm.length<2){$('#e-fn').textContent='Escribe tu nombre.';ok=false}
  if(!/^3\d{9}$/.test(ph)){$('#e-fc').textContent='Escribe un celular colombiano de 10 dígitos, por ejemplo 300 000 0000.';ok=false}
  if(!$('#fk').checked){$('#e-fk').textContent='Acepta el tratamiento de datos para poder contactarte.';ok=false}
  if(!ok){var f=$$('.err',form).filter(function(x){return x.textContent})[0];if(f){var inp=f.previousElementSibling;if(inp&&inp.focus)inp.focus()}return}
  var msg='Hola, soy '+nm+'. Quiero agendar mi valoración gratis. Mi meta es '+$('#fm').value.toLowerCase()+' y prefiero entrenar en la '+($('#fh').value==='Mañana'?'mañana':$('#fh').value.toLowerCase())+'. Mi celular es '+ph+'.';
  var url=wa(msg);window.open(url,'_blank','noopener');
  $('#panel').innerHTML='<div class="ok" role="status"><svg class="ic" aria-hidden="true"><use href="#i-check"/></svg><h3>Listo, '+nm.replace(/[<>&"]/g,'')+'</h3><p style="color:var(--muted)">Abrimos WhatsApp con tu solicitud. Si no se abrió, toca el botón.</p><a class="btn btn-wa" target="_blank" rel="noopener" href="'+url+'"><svg class="ic" aria-hidden="true"><use href="#i-wa"/></svg>Abrir WhatsApp</a></div>';
});

})();