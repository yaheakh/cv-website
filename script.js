(function(){
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- BOOT SEQUENCE ---------- */
  var boot = document.getElementById('boot');
  var bar = document.getElementById('boot-bar');
  if(reduced){
    boot.style.display='none';
  } else {
    var p = 0;
    var iv = setInterval(function(){
      p += Math.random()*22;
      if(p>=100){ p=100; clearInterval(iv); setTimeout(function(){ boot.classList.add('hide'); }, 250); }
      bar.style.width = p+'%';
    }, 130);
  }

  /* ---------- CUSTOM CURSOR ---------- */
  var dot = document.getElementById('cursor-dot');
  var ring = document.getElementById('cursor-ring');
  var glow = document.getElementById('cursor-glow');
  var mx=0, my=0;
  window.addEventListener('mousemove', function(e){
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx+'px'; dot.style.top = my+'px';
    ring.style.left = mx+'px'; ring.style.top = my+'px';
    if(glow){ glow.style.left = mx+'px'; glow.style.top = my+'px'; }
  });
  document.querySelectorAll('a,button,input,.cert,.chip').forEach(function(el){
    el.addEventListener('mouseenter', function(){ ring.classList.add('active'); if(glow) glow.classList.add('active'); });
    el.addEventListener('mouseleave', function(){ ring.classList.remove('active'); if(glow) glow.classList.remove('active'); });
  });

  /* ---------- CLICK RIPPLE ---------- */
  document.addEventListener('click', function(e){
    if(reduced) return;
    var r = document.createElement('div');
    r.className = 'click-ripple';
    r.style.left = e.clientX+'px';
    r.style.top = e.clientY+'px';
    document.body.appendChild(r);
    setTimeout(function(){ r.remove(); }, 650);
  });

  /* ---------- WATCHING EYES ---------- */
  var pupil1 = document.getElementById('pupil1');
  var pupil2 = document.getElementById('pupil2');
  var pupil3 = document.getElementById('pupil3');
  var pupil4 = document.getElementById('pupil4');
  if(pupil1 && pupil2){
    var eyeCenters = [];
    function cacheEyeCenters(){
      eyeCenters = [pupil1,pupil2,pupil3,pupil4].filter(Boolean).map(function(p){
        var rect = p.parentElement.getBoundingClientRect();
        return { pupil:p, cx: rect.left+rect.width/2, cy: rect.top+rect.height/2 };
      });
    }
    cacheEyeCenters();
    window.addEventListener('resize', cacheEyeCenters);
    function moveEye(entry, mouseX, mouseY){
      var angle = Math.atan2(mouseY-entry.cy, mouseX-entry.cx);
      var dist = Math.min(8, Math.hypot(mouseX-entry.cx, mouseY-entry.cy)/12);
      entry.pupil.style.transform = 'translate(calc(-50% + '+(Math.cos(angle)*dist)+'px), calc(-50% + '+(Math.sin(angle)*dist)+'px))';
    }
    window.addEventListener('mousemove', function(e){
      for(var i=0;i<eyeCenters.length;i++) moveEye(eyeCenters[i], e.clientX, e.clientY);
    });
  }

  /* ---------- LIVE CLOCK (Doha) ---------- */
  var clockEl = document.getElementById('clock');
  function tick(){
    try{
      var s = new Date().toLocaleTimeString('en-GB', {timeZone:'Asia/Qatar', hour:'2-digit', minute:'2-digit', second:'2-digit'});
      clockEl.textContent = s + ' AST';
    }catch(e){ clockEl.textContent = new Date().toLocaleTimeString(); }
  }
  tick(); setInterval(tick, 1000);

  /* ---------- ROLE TYPEWRITER ---------- */
  var roles = ['Senior Cyber Security Specialist','SOC Operations Leader','DFIR & Threat Hunter','Security Architecture Lead'];
  var roleEl = document.getElementById('role-type');
  if(reduced){
    roleEl.textContent = roles[0];
  } else {
    var ri=0, ci=0, deleting=false;
    function typeLoop(){
      var word = roles[ri];
      if(!deleting){
        ci++;
        roleEl.textContent = word.slice(0,ci);
        if(ci===word.length){ deleting=true; setTimeout(typeLoop, 1400); return; }
      } else {
        ci--;
        roleEl.textContent = word.slice(0,ci);
        if(ci===0){ deleting=false; ri=(ri+1)%roles.length; }
      }
      setTimeout(typeLoop, deleting?35:65);
    }
    typeLoop();
  }

  /* ---------- SCROLL PROGRESS ---------- */
  var prog = document.getElementById('scan-progress');
  function onScroll(){
    var h = document.documentElement;
    var pct = (h.scrollTop)/(h.scrollHeight-h.clientHeight)*100;
    prog.style.width = pct+'%';
  }
  document.addEventListener('scroll', onScroll); onScroll();

  /* ---------- REVEAL ON SCROLL ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && !reduced){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){ en.target.classList.add('shown'); io.unobserve(en.target); }
      });
    }, {threshold:0.12});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('shown'); });
  }

  /* ---------- COUNTERS ---------- */
  var counters = document.querySelectorAll('[data-count]');
  var counted = false;
  function runCounters(){
    if(counted) return; counted = true;
    counters.forEach(function(el){
      var target = parseInt(el.getAttribute('data-count'),10);
      var cur = 0;
      var step = Math.max(1, Math.round(target/30));
      var iv = setInterval(function(){
        cur += step;
        if(cur>=target){ cur=target; clearInterval(iv); }
        el.textContent = cur;
      }, 40);
    });
  }
  var statsBlock = document.querySelector('.hero-stats');
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(entries,obs){
      entries.forEach(function(en){ if(en.isIntersecting){ runCounters(); obs.disconnect(); } });
    }, {threshold:0.4}).observe(statsBlock);
  } else { runCounters(); }

  /* ---------- RADAR CHART REVEAL ---------- */
  var radarPoly = document.getElementById('radar-poly');
  var domainBlock = document.querySelector('.matrix-domain');
  function growRadar(){ if(radarPoly) radarPoly.classList.add('grown'); }
  if('IntersectionObserver' in window && domainBlock){
    new IntersectionObserver(function(entries,obs){
      entries.forEach(function(en){ if(en.isIntersecting){ growRadar(); obs.disconnect(); } });
    }, {threshold:0.3}).observe(domainBlock);
  } else { growRadar(); }

  /* ---------- 3D TILT ---------- */
  if(!reduced && window.matchMedia('(hover:hover)').matches){
    document.querySelectorAll('.tilt').forEach(function(el){
      el.style.transformStyle = 'preserve-3d';
      el.addEventListener('mousemove', function(e){
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left)/r.width - 0.5;
        var py = (e.clientY - r.top)/r.height - 0.5;
        el.style.transform = 'perspective(600px) rotateX(' + (-py*8) + 'deg) rotateY(' + (px*8) + 'deg) translateZ(2px)';
      });
      el.addEventListener('mouseleave', function(){ el.style.transform = ''; });
    });
  }

  /* ---------- SCROLL SPY NAV ---------- */
  var spyLinks = document.querySelectorAll('#spy a');
  var navLinks = document.querySelectorAll('nav.links a');
  var sections = ['hero','summary','experience','skills','certs','education','contact'].map(function(id){ return document.getElementById(id); }).filter(Boolean);
  function updateSpy(){
    var pos = window.scrollY + window.innerHeight*0.4;
    var current = sections[0].id;
    sections.forEach(function(sec){ if(sec.offsetTop <= pos) current = sec.id; });
    spyLinks.forEach(function(a){ a.classList.toggle('active', a.getAttribute('data-spy')===current); });
    navLinks.forEach(function(a){ a.classList.toggle('active', a.getAttribute('data-nav')===current); });
  }
  document.addEventListener('scroll', updateSpy); updateSpy();

  /* ---------- MATRIX RAIN CANVAS ---------- */
  var canvas = document.getElementById('matrix-canvas');
  var ctx = canvas.getContext('2d');
  var toggleBtn = document.getElementById('matrix-toggle');
  var matrixOn = false, matrixRAF = null;
  var cols, drops;
  function sizeCanvas(){
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    cols = Math.floor(canvas.width/16);
    drops = new Array(cols).fill(0);
  }
  sizeCanvas();
  window.addEventListener('resize', sizeCanvas);
  var chars = '01アカサタナハマヤラワ$#%&';
  var lastFrame = 0;
  var frameInterval = 1000/24; // cap at ~24fps — plenty smooth for a rain effect, far cheaper than 60fps
  function drawMatrix(ts){
    matrixRAF = requestAnimationFrame(drawMatrix);
    if(ts - lastFrame < frameInterval) return;
    lastFrame = ts;
    ctx.fillStyle = 'rgba(10,13,18,0.08)';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.font = '14px monospace';
    for(var i=0;i<drops.length;i++){
      var ch = chars[Math.floor(Math.random()*chars.length)];
      ctx.fillStyle = Math.random() > 0.97 ? '#ff3b3b' : '#34d399';
      ctx.fillText(ch, i*16, drops[i]*16);
      if(drops[i]*16 > canvas.height && Math.random()>0.975) drops[i]=0;
      drops[i]++;
    }
  }
  function setMatrix(on){
    matrixOn = on;
    canvas.classList.toggle('on', on);
    toggleBtn.classList.toggle('on', on);
    if(on && !matrixRAF && !reduced){ drawMatrix(); }
    if(!on && matrixRAF){ cancelAnimationFrame(matrixRAF); matrixRAF=null; ctx.clearRect(0,0,canvas.width,canvas.height); }
  }
  toggleBtn.addEventListener('click', function(){ setMatrix(!matrixOn); });
  if(!reduced){ setMatrix(true); }
  document.addEventListener('visibilitychange', function(){
    if(document.hidden && matrixRAF){ cancelAnimationFrame(matrixRAF); matrixRAF=null; }
    else if(!document.hidden && matrixOn && !matrixRAF && !reduced){ drawMatrix(performance.now()); }
  });

  /* ---------- PRINT ---------- */
  function doPrint(e){ if(e) e.preventDefault(); window.print(); }
  document.getElementById('print-cv').addEventListener('click', doPrint);
  document.getElementById('print-cv-2').addEventListener('click', doPrint);

  /* ---------- DOWNLOAD REAL PDF FILE ---------- */
  var pdfBusy = false;
  async function downloadPDF(e){
    if(e) e.preventDefault();
    if(pdfBusy) return;
    if(typeof html2canvas === 'undefined' || !window.jspdf){
      window.print(); return; // graceful fallback if CDN blocked
    }
    pdfBusy = true;
    var btns = [document.getElementById('download-cv'), document.getElementById('download-cv-2')];
    btns.forEach(function(b){ if(b) b.textContent = b.textContent.replace(/Download|download/, 'Building…'); });
    document.body.classList.add('pdf-mode');
    await new Promise(function(r){ setTimeout(r, 80); });
    try{
      var canvas = await html2canvas(document.body, {backgroundColor:'#ffffff', scale:2, useCORS:true, windowWidth:document.documentElement.scrollWidth});
      var imgData = canvas.toDataURL('image/jpeg', 0.92);
      var jsPDF = window.jspdf.jsPDF;
      var pdf = new jsPDF('p','pt','a4');
      var pageWidth = pdf.internal.pageSize.getWidth();
      var pageHeight = pdf.internal.pageSize.getHeight();
      var imgWidth = pageWidth;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;
      var position = 0;
      pdf.addImage(imgData,'JPEG',0,position,imgWidth,imgHeight);
      heightLeft -= pageHeight;
      while(heightLeft > 0){
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData,'JPEG',0,position,imgWidth,imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save('Yahya_Alkharabsheh_CV.pdf');
    } catch(err){
      window.print();
    } finally {
      document.body.classList.remove('pdf-mode');
      btns.forEach(function(b){ if(b) b.textContent = b===document.getElementById('download-cv') ? '↓ download CV (PDF)' : '↓ Download PDF'; });
      pdfBusy = false;
    }
  }
  document.getElementById('download-cv').addEventListener('click', downloadPDF);
  document.getElementById('download-cv-2').addEventListener('click', downloadPDF);

  /* ---------- DISABLE RIGHT-CLICK ---------- */
  document.addEventListener('contextmenu', function(e){ e.preventDefault(); });

})();
