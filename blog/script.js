// ===== SHEET POSTS LOADER =====
    // Purpose: Fetch blog posts from the runtime-injected sheet endpoint, sort them
    // by date descending, and render cards with loading / empty / error states.
    // Triggers: Runs once on page load.
    (function () {
      var endpoint = document.querySelector('meta[name="sheet-data-url"]')?.content;
      var container = document.getElementById('sheet-data');
      var emptyState = document.getElementById('empty-state');
      var errorState = document.getElementById('error-state');
      var status = document.getElementById('sheet-status');

      function escapeHtml(str) {
        return String(str || '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
      }

      function formatDate(value) {
        if (!value) return '';
        var d = new Date(value);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
        }
        return String(value);
      }

      function dateValue(value) {
        var d = new Date(value);
        return isNaN(d.getTime()) ? 0 : d.getTime();
      }

      function showSkeletons() {
        if (!container) return;
        container.innerHTML = Array.from({ length: 6 }).map(function () {
          return (
            '<article class="overflow-hidden rounded-3xl border border-white/10 bg-[#0D111A]">' +
              '<div class="aspect-[16/10] w-full shimmer"></div>' +
              '<div class="p-5 space-y-4">' +
                '<div class="h-4 w-24 rounded-full shimmer"></div>' +
                '<div class="h-7 w-5/6 rounded-lg shimmer"></div>' +
                '<div class="space-y-2">' +
                  '<div class="h-4 w-full rounded shimmer"></div>' +
                  '<div class="h-4 w-11/12 rounded shimmer"></div>' +
                '</div>' +
                '<div class="h-5 w-28 rounded shimmer"></div>' +
              '</div>' +
            '</article>'
          );
        }).join('');
      }

      function renderPosts(rows) {
        if (!container) return;
        container.innerHTML = rows.map(function (row) {
          var title = row.Title || row.title || 'Untitled post';
          var date = row.Date || row.date || '';
          var excerpt = row.Excerpt || row.excerpt || '';
          var image = row.ImageURL || row.imageurl || row.ImageUrl || row.imageUrl || '';
          var url = row.PostURL || row.posturl || row.PostUrl || row.postUrl || '#';

          return (
            '<article class="card-glow overflow-hidden rounded-3xl border border-white/10 bg-[#0D111A] transition-all duration-200">' +
              '<a href="' + escapeHtml(url) + '" target="_blank" rel="noopener noreferrer" class="block">' +
                '<div class="relative aspect-[16/10] w-full overflow-hidden bg-[#101725]">' +
                  (image
                    ? '<img src="' + escapeHtml(image) + '" alt="' + escapeHtml(title) + '" class="h-full w-full object-cover" loading="lazy" onerror="this.style.display=\'none\';this.parentElement.classList.add(\'bg-gradient-to-br\');this.parentElement.classList.add(\'from-slate-800\');this.parentElement.classList.add(\'to-slate-950\');" />'
                    : '<div class="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950"><span class="font-plex text-xs uppercase tracking-[0.25em] text-slate-500">No image</span></div>') +
                '</div>' +
                '<div class="p-5 sm:p-6">' +
                  '<div class="font-plex text-[11px] uppercase tracking-[0.25em] text-cyan-300/80">' + escapeHtml(formatDate(date)) + '</div>' +
                  '<h2 class="mt-3 font-fraunces text-2xl leading-tight text-slate-50">' + escapeHtml(title) + '</h2>' +
                  '<p class="mt-3 line-clamp-2 text-sm leading-6 text-slate-300">' + escapeHtml(excerpt) + '</p>' +
                  '<div class="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#5EE1FF]">' +
                    '<span>Read post</span><span aria-hidden="true">→</span>' +
                  '</div>' +
                '</div>' +
              '</a>' +
            '</article>'
          );
        }).join('');
      }

      if (!endpoint) {
        if (status) status.textContent = 'Content source unavailable.';
        if (errorState) errorState.classList.remove('hidden');
        return;
      }

      showSkeletons();
      if (status) status.textContent = 'Loading posts...';

      fetch(endpoint)
        .then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r.json();
        })
        .then(function (result) {
          var rows = Array.isArray(result?.data) ? result.data.slice() : [];
          rows.sort(function (a, b) {
            return dateValue(b.Date || b.date) - dateValue(a.Date || a.date);
          });

          if (!rows.length) {
            if (container) container.innerHTML = '';
            if (status) status.textContent = '';
            if (emptyState) emptyState.classList.remove('hidden');
            return;
          }

          if (emptyState) emptyState.classList.add('hidden');
          if (errorState) errorState.classList.add('hidden');
          if (status) status.textContent = rows.length + ' post' + (rows.length === 1 ? '' : 's') + ' loaded.';
          renderPosts(rows);
        })
        .catch(function (err) {
          console.error('Sheet data error:', err);
          if (container) container.innerHTML = '';
          if (status) status.textContent = '';
          if (errorState) errorState.classList.remove('hidden');
        });
    })();