/* Before/after slider + example tabs (home page). Works with mouse, touch and keyboard. */
(function () {
  var frame = document.getElementById('baFrame');
  if (!frame) return;
  var range = document.getElementById('baRange');
  var dragging = false, startX = 0, startY = 0, decided = false;

  function set(p) {
    p = Math.max(0, Math.min(100, p));
    frame.style.setProperty('--pos', p + '%');
    range.value = Math.round(p);
  }
  function fromEvent(e) {
    var r = frame.getBoundingClientRect();
    return ((e.clientX - r.left) / r.width) * 100;
  }
  frame.addEventListener('pointerdown', function (e) {
    dragging = true; decided = e.pointerType !== 'touch';
    startX = e.clientX; startY = e.clientY;
    if (decided) { set(fromEvent(e)); try { frame.setPointerCapture(e.pointerId); } catch (x) {} }
  });
  frame.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    if (!decided) {
      var dx = Math.abs(e.clientX - startX), dy = Math.abs(e.clientY - startY);
      if (dx < 6 && dy < 6) return;
      if (dy > dx) { dragging = false; return; }
      decided = true;
    }
    set(fromEvent(e));
  });
  function end(e) {
    if (dragging && !decided && e && e.type === 'pointerup') set(fromEvent(e)); // a tap moves the slider
    dragging = false;
  }
  frame.addEventListener('pointerup', end);
  frame.addEventListener('pointercancel', function () { dragging = false; });
  range.addEventListener('input', function () { set(+range.value); });

  document.querySelectorAll('.chip[data-pos]').forEach(function (b) {
    b.addEventListener('click', function () {
      frame.classList.add('anim');
      set(+b.getAttribute('data-pos'));
      setTimeout(function () { frame.classList.remove('anim'); }, 450);
    });
  });

  var data = {};
  document.querySelectorAll('#baData li').forEach(function (li) { data[li.getAttribute('data-k')] = li; });
  var tabs = document.querySelectorAll('.ba-tab');
  function swap(pic, side, k) {
    var src = pic.querySelector('source'), img = pic.querySelector('img');
    var v = img.getAttribute('src').split('?')[1] || '';
    src.setAttribute('srcset', '/img/ba-' + side + '-' + k + '.webp' + (v ? '?' + v : ''));
    img.setAttribute('src', '/img/ba-' + side + '-' + k + '.jpg' + (v ? '?' + v : ''));
  }
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      var k = t.getAttribute('data-k'), d = data[k];
      tabs.forEach(function (o) { o.classList.toggle('on', o === t); o.setAttribute('aria-selected', o === t ? 'true' : 'false'); });
      swap(frame.querySelector('.ba-after picture'), 'after', k);
      swap(frame.querySelector('.ba-before picture'), 'before', k);
      document.getElementById('baName').innerHTML = d.getAttribute('data-name');
      document.getElementById('baWhere').innerHTML = d.getAttribute('data-where');
      document.getElementById('baDesc').textContent = d.getAttribute('data-desc');
      document.getElementById('baLink').href = d.getAttribute('data-url');
      set(50);
    });
  });
  // warm the cache for the other examples once the page is idle
  window.addEventListener('load', function () {
    var v = (frame.querySelector('img').getAttribute('src').split('?')[1] || '');
    setTimeout(function () {
      Object.keys(data).forEach(function (k) {
        ['before', 'after'].forEach(function (s) { var i = new Image(); i.src = '/img/ba-' + s + '-' + k + '.webp' + (v ? '?' + v : ''); });
      });
    }, 1500);
  });
})();
