(function(){
  'use strict';

  var WALLPAPERS = [
    { src: 'img/wallpaper-1.webp', desktop: 'center center', mobile: 'left center'  },
    { src: 'img/wallpaper-2.webp', desktop: 'center center', mobile: 'right center' },
    { src: 'img/wallpaper-3.webp', desktop: 'center center', mobile: 'right center' },
    { src: 'img/wallpaper-4.webp', desktop: 'center center', mobile: 'left center'  },
    { src: 'img/wallpaper-5.webp', desktop: 'center center', mobile: 'right center' }
  ];

  var STORAGE = 'last-wallpaper';
  var BP = 560;

  var item, resizeTimer;

  function isMobile(){
    return window.matchMedia('(max-width:' + BP + 'px)').matches;
  }

  function applyPosition(){
    if (!item) return;
    var wp = document.getElementById('wallpaper');
    wp.style.backgroundPosition = isMobile()
      ? (item.mobile  || 'center top')
      : (item.desktop || 'center center');
  }

  function pick(){
    var last = null;
    try { last = sessionStorage.getItem(STORAGE); } catch(e){}
    var pool = WALLPAPERS.filter(function(w){ return w.src !== last; });
    if (!pool.length) pool = WALLPAPERS;
    var chosen = pool[Math.floor(Math.random() * pool.length)];
    try { sessionStorage.setItem(STORAGE, chosen.src); } catch(e){}
    return chosen;
  }

  /* ---------- 预加载其余壁纸 ---------- */
  /* 首屏完成后延迟 2 秒开始，每隔 1.5 秒加载一张，避免抢占带宽 */
  function preloadRest(){
    var others = WALLPAPERS.filter(function(w){ return w.src !== item.src; });
    others.forEach(function(w, i){
      setTimeout(function(){
        var pre = new Image();
        pre.src = w.src;
      }, i * 1500);
    });
  }

  item = pick();
  var loader = new Image();
  loader.onload = function(){
    document.getElementById('wallpaper').style.backgroundImage = 'url("' + item.src + '")';
    applyPosition();

    /* 首屏稳定后再偷偷预加载其他图 */
    setTimeout(preloadRest, 2000);
  };
  loader.src = item.src;

  window.addEventListener('resize', function(){
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(applyPosition, 150);
  });

  function bjParts(){
    var parts = new Intl.DateTimeFormat('zh-CN', {
      timeZone: 'Asia/Shanghai',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).formatToParts(new Date());
    var map = {};
    parts.forEach(function(p){ map[p.type] = p.value; });
    return map;
  }

  function bjHour(){
    return parseInt(new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Shanghai',
      hour: 'numeric',
      hour12: false
    }).format(new Date()), 10);
  }

  var timeEl = document.getElementById('liveTime');

  function tick(){
    var t = bjParts();
    timeEl.textContent = t.hour + ':' + t.minute + ':' + t.second;
  }
  tick();
  setInterval(tick, 1000);

  var greet = document.querySelector('.greet-line');
  var h = bjHour();
  if (h >= 5 && h < 12)       greet.textContent = 'Good Morning';
  else if (h >= 12 && h < 18) greet.textContent = 'Good Afternoon';
  else if (h >= 18 && h < 23) greet.textContent = 'Good Evening';
  else                         greet.textContent = 'Good Night';

  var hero = document.querySelector('.hero');
  var TARGET = 'https://nz.nzyc.top/';

  hero.addEventListener('click', function(){
    window.location.href = TARGET;
  });

  hero.setAttribute('role', 'button');
  hero.setAttribute('tabindex', '0');
  hero.addEventListener('keydown', function(e){
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.location.href = TARGET;
    }
  });

})();
