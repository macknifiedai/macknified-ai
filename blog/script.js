window.addEventListener('load',function(){
    setTimeout(function(){
      var ls=document.getElementById('loadingScreen');
      ls.classList.add('hidden');
      setTimeout(function(){ls.style.display='none';},800);
    },2000);
  });

  // ── DATE PARSING ────────────────────────────────────────────────────
  // Handles ISO strings ("2026-07-07T09:00:00.000Z") AND
  // Google Sheets serial numbers (e.g. 46209 = Jul 7 2026).
  // Returns Unix milliseconds, or null if unparseable.
  function parsePostDate(v) {
    if (v === null || v === undefined || v === '') return null;
    var s = String(v).trim();
    if (!s) return null;
    // Google Sheets stores dates as days since Dec 30 1899.
    // Serials for years 2000-2100 fall in the range ~36526-73050.
    if (/^\d+(\.\d+)?$/.test(s)) {
      var n = parseFloat(s);
      if (n >= 36526 && n <= 80000) {
        return Math.round((n - 25569) * 86400000);
      }
    }
    // ISO string or any other standard date string
    var ts = new Date(s).getTime();
    return isNaN(ts) ? null : ts;
  }
  // ────────────────────────────────────────────────────────────────────

  function renderMarkdown(raw){
    if(!raw)return'';
    var normalized=raw.replace(/\|\|\|/g,'\n');
    var lines=normalized.split('\n');
    var html='';
    var inOl=false,inUl=false;
    function closeList(){if(inOl){html+='</ol>';inOl=false;}if(inUl){html+='</ul>';inUl=false;}}
    function inlineFormat(s){
      s=s.replace(/\*\*(.+?)\*\*/g,'<strong class="post-strong">$1</strong>');
      s=s.replace(/\*(.+?)\*/g,'<em class="post-em">$1</em>');
      s=s.replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g,'<a class="post-cite" href="$2" target="_blank" rel="noopener">$1</a>');
      s=s.replace(/(?<!["\(])(https?:\/\/[^\s\)]+)/g,'<a class="post-cite" href="$1" target="_blank" rel="noopener">$1</a>');
      return s;
    }
    lines.forEach(function(line){
      var trimmed=line.trim();
      if(!trimmed){closeList();return;}
      if(/^##\s/.test(trimmed)){closeList();html+='<div class="post-h2">'+inlineFormat(trimmed.replace(/^##\s+/,''))+'</div>';return;}
      if(/^###\s/.test(trimmed)||/^####\s/.test(trimmed)){closeList();html+='<div class="post-h3">'+inlineFormat(trimmed.replace(/^#{3,}\s+/,''))+'</div>';return;}
      if(/^#\s/.test(trimmed)){closeList();html+='<div class="post-h2">'+inlineFormat(trimmed.replace(/^#\s+/,''))+'</div>';return;}
      var olMatch=trimmed.match(/^(\d+)\.\s+(.*)/);
      if(olMatch){if(!inOl){if(inUl){html+='</ul>';inUl=false;}html+='<ol class="post-ol">';inOl=true;}html+='<li class="post-li">'+inlineFormat(olMatch[2])+'</li>';return;}
      if(/^[-*]\s/.test(trimmed)){if(!inUl){if(inOl){html+='</ol>';inOl=false;}html+='<ul class="post-ul">';inUl=true;}html+='<li class="post-li">'+inlineFormat(trimmed.replace(/^[-*]\s+/,''))+'</li>';return;}
      if(/^\*\*[^*]+\*\*$/.test(trimmed)){closeList();html+='<div class="post-h3">'+trimmed.replace(/^\*\*|\*\*$/g,'')+'</div>';return;}
      closeList();
      html+='<p class="post-p">'+inlineFormat(trimmed)+'</p>';
    });
    closeList();
    return html;
  }

  (function(){
    // ── SHEET ENDPOINT ─────────────────────────────────────────────────
    // Hardcoded so this works on GitHub Pages where the Macknified
    // platform cannot inject the meta tag at serve time.
    var SHEET_URL = 'https://app.macknified.com/api/public/landing-pages/5140/sheet-data';
    // Also check for a platform-injected meta tag (works on app.macknified.com / paymegpt.com)
    var metaEl = document.querySelector('meta[name="sheet-data-url"]');
    var baseEndpoint = (metaEl && metaEl.content) ? metaEl.content : SHEET_URL;
    // ──────────────────────────────────────────────────────────────────

    var topGrid=document.getElementById('top-grid');
    var restSection=document.getElementById('rest-section');
    var restList=document.getElementById('rest-list');
    var emptyState=document.getElementById('empty-state');
    var errorState=document.getElementById('error-state');
    var modal=document.getElementById('post-modal');
    var modalHero=document.getElementById('modal-hero');
    var modalHeroPh=document.getElementById('modal-hero-ph');
    var modalMeta=document.getElementById('modal-meta');
    var modalTitle=document.getElementById('modal-title');
    var modalContent=document.getElementById('modal-content');
    var modalClose=document.getElementById('modal-close');

    function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

    function dateVal(v){
      var ts=parsePostDate(v);
      return ts===null?0:ts;
    }
    function fmtShort(v){
      var ts=parsePostDate(v);
      if(ts===null)return'';
      return new Date(ts).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'});
    }
    function fmtLong(v){
      var ts=parsePostDate(v);
      if(ts===null)return'';
      return new Date(ts).toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric'});
    }

    function openPost(row){
      var img=row.ImageURL||row.imageUrl||row.imageurl||'';
      var title=row.Title||row.title||'Untitled';
      var date=row.Date||row.date||'';
      var body=row.Body||row.body||row.Excerpt||row.excerpt||'';
      if(img){modalHero.src=img;modalHero.alt=title;modalHero.classList.remove('hidden');modalHeroPh.classList.add('hidden');}
      else{modalHero.classList.add('hidden');modalHeroPh.classList.remove('hidden');}
      var fd=fmtLong(date);
      modalMeta.textContent=fd?fd+' · Power Builders':'Power Builders · Macknified AI';
      modalTitle.textContent=title;
      modalContent.innerHTML=renderMarkdown(body);
      modal.classList.add('open');
      document.body.style.overflow='hidden';
      modal.scrollTop=0;
    }
    function closeModal(){modal.classList.remove('open');document.body.style.overflow='';}
    modalClose.addEventListener('click',closeModal);
    modal.addEventListener('click',function(e){if(e.target===modal)closeModal();});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')closeModal();});

    var phSvg='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(0,102,255,.2)" stroke-width="1.2"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>';

    topGrid.innerHTML=Array.from({length:4}).map(function(){
      return '<div class="top-card"><div style="width:100%;aspect-ratio:4/3;" class="shimmer"></div><div style="padding:14px 16px;display:flex;flex-direction:column;gap:8px;"><div style="height:9px;width:70px;border-radius:3px;" class="shimmer"></div><div style="height:13px;width:90%;border-radius:3px;" class="shimmer"></div><div style="height:13px;width:65%;border-radius:3px;" class="shimmer"></div></div></div>';
    }).join('');

    function renderTopGrid(rows){
      topGrid.innerHTML=rows.map(function(row,i){
        var title=row.Title||row.title||'Untitled';
        var date=row.Date||row.date||'';
        var img=row.ImageURL||row.imageUrl||row.imageurl||'';
        var ds=fmtShort(date);
        return '<div class="top-card" data-i="'+i+'">'+
          (img?'<img src="'+esc(img)+'" alt="'+esc(title)+'" class="card-img" loading="lazy" onerror="this.style.display=\'none\'">':'<div class="card-img-ph">'+phSvg+'</div>')+
          '<div class="card-body">'+(ds?'<div class="card-date">'+esc(ds)+'</div>':'')+
          '<div class="card-title">'+esc(title)+'</div>'+
          '<div class="card-read">Read →</div></div></div>';
      }).join('');
      topGrid.querySelectorAll('.top-card').forEach(function(el){
        el.addEventListener('click',function(){openPost(rows[parseInt(el.dataset.i)]);});
      });
    }

    function renderRest(rows){
      if(!rows.length){restSection.style.display='none';return;}
      restSection.style.display='block';
      restList.innerHTML=rows.map(function(row,i){
        var title=row.Title||row.title||'Untitled';
        var date=row.Date||row.date||'';
        var excerpt=row.Excerpt||row.excerpt||'';
        var img=row.ImageURL||row.imageUrl||row.imageurl||'';
        var ds=fmtShort(date);
        return '<div class="rest-row" data-i="'+i+'">'+
          (img?'<img src="'+esc(img)+'" class="rest-thumb" alt="'+esc(title)+'" onerror="this.style.display=\'none\'">':'<div class="rest-thumb-ph">'+phSvg+'</div>')+
          '<div style="min-width:0;"><div class="rest-title">'+esc(title)+'</div>'+(excerpt?'<div class="rest-excerpt">'+esc(excerpt)+'</div>':'')+
          '</div>'+(ds?'<div class="rest-date">'+esc(ds)+'</div>':'')+
        '</div>';
      }).join('');
      restList.querySelectorAll('.rest-row').forEach(function(el){
        el.addEventListener('click',function(){openPost(rows[parseInt(el.dataset.i)]);});
      });
    }

    var endpoint = baseEndpoint + '?limit=500&t=' + Date.now();

    fetch(endpoint)
      .then(function(r){if(!r.ok)throw new Error(r.status);return r.json();})
      .then(function(result){
        var rows=Array.isArray(result)?result.slice():(result&&Array.isArray(result.data)?result.data.slice():[]);

        // Keep only rows with a title
        rows=rows.filter(function(r){return(r.Title||r.title||'').trim();});

        // ── PUBLISH DATE GATE ──────────────────────────────────────────
        // Only show posts whose date is today or earlier.
        var now=new Date();
        now.setHours(23,59,59,999);
        var nowMs=now.getTime();
        rows=rows.filter(function(r){
          var d=r.Date||r.date||'';
          if(!d)return true;
          var ts=parsePostDate(d);
          if(ts===null)return true;
          return ts<=nowMs;
        });
        // ──────────────────────────────────────────────────────────────

        rows.sort(function(a,b){
          return dateVal(b.Date||b.date)-dateVal(a.Date||a.date);
        });

        if(!rows.length){topGrid.innerHTML='';emptyState.style.display='block';return;}
        emptyState.style.display='none';errorState.style.display='none';
        renderTopGrid(rows.slice(0,4));
        renderRest(rows.slice(4));
      })
      .catch(function(err){console.error(err);topGrid.innerHTML='';errorState.style.display='block';});
  })();