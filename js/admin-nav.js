(function () {
  // Only run on localhost — production gets sidebar injected by the Worker
  if (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') return;

  var SECTIONS = [
    { label: 'Artworks',    path: '/admin/artworks.html'    },
    { label: 'Exhibitions', path: '/admin/exhibitions.html' },
    { label: 'Invoices',    path: '/admin/invoices.html'    },
    { label: 'Clients',     path: '/admin/clients.html'     },
    { label: 'Press',       path: '/admin/press.html'       },
    { label: 'Settings',    path: '/admin/settings.html'    },
  ];

  function isActive(path) {
    return location.pathname.indexOf(path.replace('.html', '')) !== -1 ||
           location.pathname === path;
  }

  var style = document.createElement('style');
  style.textContent =
    'body{margin-left:176px!important;}' +
    '.adm-sidebar{position:fixed;top:0;left:0;width:176px;height:100vh;background:#fff;border-right:1px solid rgba(0,0,0,0.07);display:flex;flex-direction:column;padding:1.75rem 1.25rem 1.25rem;overflow-y:auto;z-index:200;box-sizing:border-box;}' +
    '.adm-logo{font-family:"DM Sans",sans-serif;font-size:0.62rem;letter-spacing:0.1em;text-transform:uppercase;opacity:0.38;line-height:1.5;margin-bottom:1.75rem;}' +
    '.adm-link{display:block;border-top:1px solid rgba(0,0,0,0.07);padding:0.65rem 0;font-family:"DM Sans",sans-serif;font-size:0.88rem;font-weight:300;color:#111;text-decoration:none;opacity:0.35;letter-spacing:0.01em;transition:opacity 0.1s;}' +
    '.adm-link:last-child{border-bottom:1px solid rgba(0,0,0,0.07);}' +
    '.adm-active{opacity:1!important;font-weight:400!important;}' +
    '.adm-link:hover{opacity:0.7;}';
  document.head.appendChild(style);

  var links = SECTIONS.map(function (s) {
    return '<a class="adm-link' + (isActive(s.path) ? ' adm-active' : '') + '" href="' + s.path + '">' + s.label + '</a>';
  }).join('');

  var sidebar = document.createElement('nav');
  sidebar.className = 'adm-sidebar';
  sidebar.innerHTML = '<div class="adm-logo">Dim Zayan<br>Studio</div>' + links;
  document.body.insertBefore(sidebar, document.body.firstChild);
})();
