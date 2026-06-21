/* ============================================================
   HELIOS GYM — interactions
   ============================================================ */
(function () {
  'use strict';

  document.body.classList.add('js-loaded');

  /* ---- WhatsApp config (BOTH numbers are WhatsApp) ---- */
  window.HELIOS = {
    wa: [
      { label: 'Stadium Road', num: '919058619990', disp: '+91 90586 19990' },
      { label: 'Rampur Garden', num: '917895894740', disp: '+91 78958 94740' }
    ]
  };
  function waLink(num, msg) {
    return 'https://wa.me/' + num + '?text=' + encodeURIComponent(msg);
  }

  /* ---- mobile nav ---- */
  function bind(id, fn, ev) { var el = document.getElementById(id); if (el) el.addEventListener(ev || 'click', fn); }
  bind('burger', function () { document.getElementById('mnav').classList.add('open'); document.body.style.overflow = 'hidden'; });
  bind('mclose', function () { document.getElementById('mnav').classList.remove('open'); document.body.style.overflow = ''; });

  /* ---- floating whatsapp ---- */
  var waBtn = document.getElementById('waFab');
  if (waBtn) {
    waBtn.addEventListener('click', function () {
      document.getElementById('waMenu').classList.toggle('open');
    });
    document.addEventListener('click', function (e) {
      var f = document.querySelector('.wa-float');
      if (f && !f.contains(e.target)) document.getElementById('waMenu').classList.remove('open');
    });
  }

  /* ---- scroll reveal ---- */
  var revs = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revs.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    revs.forEach(function (r) { io.observe(r); });
  } else { revs.forEach(function (r) { r.classList.add('in'); }); }

  /* ---- count up stats ---- */
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target, target = parseFloat(el.dataset.count), dec = (el.dataset.dec || 0) | 0,
          dur = 1400, t0 = null;
        function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / dur, 1), ease = 1 - Math.pow(1 - p, 3),
            val = (target * ease).toFixed(dec);
          el.firstChild ? (el.childNodes[0].nodeValue = val) : (el.textContent = val);
          if (p < 1) requestAnimationFrame(step);
        }
        // keep any trailing markup (like + or ★) — only replace the leading text node
        if (el.childNodes.length && el.childNodes[0].nodeType === 3) requestAnimationFrame(step);
        else { el.textContent = target.toFixed(dec); }
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---- trainer branch toggle ---- */
  var toggle = document.getElementById('branchToggle');
  if (toggle) {
    var btns = toggle.querySelectorAll('button'), pill = toggle.querySelector('.toggle__pill');
    function setPill(b) { pill.style.width = b.offsetWidth + 'px'; pill.style.transform = 'translateX(' + b.offsetLeft + 'px)'; }
    function activate(idx) {
      btns.forEach(function (b, i) {
        b.classList.toggle('on', i === idx);
        if (i === idx) setPill(b);
      });
      document.querySelectorAll('[data-branch]').forEach(function (g) {
        g.style.display = (parseInt(g.dataset.branch, 10) === idx) ? '' : 'none';
      });
    }
    btns.forEach(function (b, i) { b.addEventListener('click', function () { activate(i); }); });
    activate(0);
    window.addEventListener('resize', function () { var on = toggle.querySelector('.on'); if (on) setPill(on); });
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq__q').forEach(function (q) {
    q.addEventListener('click', function () {
      var a = q.nextElementSibling, open = q.classList.toggle('open');
      a.style.maxHeight = open ? a.scrollHeight + 'px' : 0;
    });
  });

  /* ---- BMI calculator ---- */
  var bmiForm = document.getElementById('bmiForm');
  if (bmiForm) {
    var cats = [
      { max: 18.5, label: 'Underweight', col: '#6fb6e8' },
      { max: 25, label: 'Healthy', col: '#5fd687' },
      { max: 30, label: 'Overweight', col: '#e7c56b' },
      { max: 999, label: 'Obese', col: '#d98a3a' }
    ];
    function calcBMI() {
      var h = parseFloat(document.getElementById('bmiH').value),
        w = parseFloat(document.getElementById('bmiW').value),
        out = document.getElementById('bmiOut');
      if (!h || !w || h <= 0 || w <= 0) { out.style.display = 'none'; return; }
      var bmi = w / Math.pow(h / 100, 2), c = cats.find(function (x) { return bmi < x.max; });
      document.getElementById('bmiVal').textContent = bmi.toFixed(1);
      var cat = document.getElementById('bmiCat');
      cat.textContent = c.label; cat.style.color = c.col; cat.style.borderColor = c.col;
      var msg = 'Hi Helios Gym! My BMI is ' + bmi.toFixed(1) + ' (' + c.label + '). I\'d like guidance on a plan to reach my goal.';
      document.getElementById('bmiWa').href = waLink(window.HELIOS.wa[0].num, msg);
      out.style.display = 'flex';
    }
    bmiForm.addEventListener('submit', function (e) { e.preventDefault(); calcBMI(); });
    bmiForm.addEventListener('input', calcBMI);
  }

  /* ---- contact form -> WhatsApp ---- */
  var cForm = document.getElementById('contactForm');
  if (cForm) {
    cForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('cName').value.trim(),
        phone = document.getElementById('cPhone').value.trim(),
        branchIdx = parseInt(document.getElementById('cBranch').value, 10),
        goal = document.getElementById('cGoal').value,
        msg = document.getElementById('cMsg').value.trim();
      var b = window.HELIOS.wa[branchIdx] || window.HELIOS.wa[0];
      var text = 'Hi Helios Gym (' + b.label + ' branch)!%0A%0A'
        + 'Name: ' + name + '%0A'
        + 'Phone: ' + phone + '%0A'
        + 'Interested in: ' + goal + '%0A'
        + (msg ? ('Message: ' + msg + '%0A') : '')
        + '%0APlease share membership details.';
      window.open('https://wa.me/' + b.num + '?text=' + text, '_blank');
    });
  }

  /* ---- plan enquiry buttons (data-plan attr) ---- */
  document.querySelectorAll('[data-plan]').forEach(function (a) {
    var msg = 'Hi Helios Gym! I\'m interested in the ' + a.dataset.plan + ' membership. Please share the details and how to start a free trial.';
    a.href = waLink(window.HELIOS.wa[0].num, msg);
  });

  /* ---- generic prefilled wa buttons (data-wa) ---- */
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    a.href = waLink(window.HELIOS.wa[0].num, a.dataset.wa);
  });

  /* ---- busy times (typical week, editable by gym) ---- */
  var busyWrap = document.getElementById('busy');
  if (busyWrap) {
    var busy = [20,12,8,8,10,20,55,80,75,55,40,35,40,35,30,35,50,70,90,95,85,65,45,30];
    var startH = 5, endH = 23, curH = new Date().getHours();
    function fmtH(h){ var ap=h<12?' am':' pm'; var hh=h%12; if(hh===0)hh=12; return hh+ap; }
    var frag = '';
    for (var h = startH; h <= endH; h++) {
      var v = busy[h], cls = (h === curH) ? ' now' : '';
      var lvl = v < 35 ? 'Quiet' : (v <= 65 ? 'Moderate' : 'Busy');
      frag += '<div class="busy__bar' + cls + '" style="height:' + Math.max(8, v) + '%" title="' + fmtH(h) + ': ' + lvl + '"></div>';
    }
    document.getElementById('busyBars').innerHTML = frag;
    var cur = (curH >= startH && curH <= endH) ? busy[curH] : busy[curH];
    var label, col;
    if (cur < 35) { label = 'Quiet right now'; col = '#5fd687'; }
    else if (cur <= 65) { label = 'Moderate right now'; col = '#e7c56b'; }
    else { label = 'Busy right now'; col = '#d98a3a'; }
    var st = document.getElementById('busyStatus');
    st.innerHTML = '<span class="busy__dot" style="background:' + col + '"></span>' + label;
    st.style.borderColor = col;
    var quiet = 11, qv = 999;
    for (var h3 = 10; h3 <= 16; h3++) { if (busy[h3] < qv) { qv = busy[h3]; quiet = h3; } }
    document.getElementById('busyMsg').innerHTML = 'Quietest hours are usually late morning to early afternoon, around <b>' + fmtH(quiet) + '</b>. Evenings (6 to 8 pm) are the busiest.';
  }

  /* ---- year ---- */
  var y = document.getElementById('yr'); if (y) y.textContent = new Date().getFullYear();
})();
