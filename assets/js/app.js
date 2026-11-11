(function () {
  var wrap = document.querySelector(".wrap");
  var KEY = "econ-note-" + ((wrap && wrap.getAttribute("data-date")) || "today");
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var views = {};

  document.querySelectorAll("[data-view]").forEach(function (el) {
    var name = el.getAttribute("data-view");
    var ids = [], minutes = {};
    el.querySelectorAll("article.story[id]").forEach(function (a) {
      ids.push(a.id);
      minutes[a.id] = parseInt(a.getAttribute("data-min") || "0", 10);
    });
    views[name] = {
      el: el, ids: ids, minutes: minutes,
      base: parseInt(el.getAttribute("data-base") || "0", 10),
      end: el.getAttribute("data-end"),
      toc: document.querySelector('[data-toc="' + name + '"]')
    };
  });

  var names = Object.keys(views);
  var first = views.econ ? "econ" : names[0];
  var current = first;
  var done = {};
  try { done = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { done = {}; }

  function save() { try { localStorage.setItem(KEY, JSON.stringify(done)); } catch (e) {} }

  function viewFor(id) {
    if (views[id]) return id;
    var t = id ? document.getElementById(id) : null;
    var v = t && t.closest("[data-view]");
    return v ? v.getAttribute("data-view") : first;
  }

  function render() {
    names.forEach(function (name) {
      var v = views[name];
      v.ids.forEach(function (id) {
        var btn = document.querySelector('[data-done="' + id + '"]');
        var li = v.toc ? v.toc.querySelector('li[data-for="' + id + '"]') : null;
        if (btn) {
          btn.setAttribute("aria-pressed", done[id] ? "true" : "false");
          btn.textContent = done[id] ? "읽음 표시 취소" : "다 읽었어요";
        }
        if (li) li.classList.toggle("done", !!done[id]);
      });
    });
    var v = views[current], count = 0, left = v.base, total = v.ids.length;
    v.ids.forEach(function (id) { if (done[id]) count++; else left += v.minutes[id]; });
    document.getElementById("progress-text").textContent =
      count === total ? total + "/" + total + " 다 읽었습니다" : count + "/" + total + " 읽음, 남은 시간 약 " + left + "분";
    document.getElementById("progress-bar").style.width = (total ? count / total * 100 : 0) + "%";
  }

  function show(name) {
    current = name;
    names.forEach(function (n) {
      views[n].el.hidden = n !== name;
      if (views[n].toc) views[n].toc.hidden = n !== name;
    });
    document.querySelectorAll("[data-tab]").forEach(function (a) {
      if (a.getAttribute("data-tab") === name) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    render();
  }

  function route() {
    var id = (location.hash || "").replace("#", "");
    var name = viewFor(id);
    var changed = name !== current;
    show(name);
    var target = id && !views[id] ? document.getElementById(id) : null;
    if (target) target.scrollIntoView();
    else if (changed || views[id]) window.scrollTo(0, 0);
  }

  document.querySelectorAll("[data-done]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-done");
      var v = views[viewFor(id)];
      done[id] = !done[id];
      save(); render();
      if (done[id]) {
        var next = v.ids[v.ids.indexOf(id) + 1];
        var target = document.getElementById(next || v.end);
        if (target) target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      }
    });
  });

  document.querySelectorAll("[data-quiz]").forEach(function (quiz) {
    var buttons = quiz.querySelectorAll(".opts button");
    var explain = quiz.querySelector(".explain");
    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        buttons.forEach(function (x) {
          x.disabled = true;
          if (x.hasAttribute("data-correct")) x.classList.add("right");
        });
        if (!b.hasAttribute("data-correct")) b.classList.add("wrong");
        explain.textContent = (b.hasAttribute("data-correct") ? "맞습니다. " : "정답은 초록색 보기입니다. ") + explain.textContent;
        explain.hidden = false;
      });
    });
  });

  window.addEventListener("hashchange", route);
  route();
})();
