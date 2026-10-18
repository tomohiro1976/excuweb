(() => {
  const executors = window.EXECUTORS || [];
  const pathParts = location.pathname.split('/').filter(Boolean);
  const lastPart = pathParts[pathParts.length - 1] || '';
  const folderPart = lastPart.toLowerCase() === 'index.html' ? pathParts[pathParts.length - 2] : lastPart;
  const folderId = (folderPart || '').replace(/\.html$/, '').toLowerCase();
  const fileId = folderId || 'solara';
  const id = new URLSearchParams(location.search).get('id') || (fileId !== 'executor' ? fileId : 'solara');
  const executor = executors.find(item => item.id === id) || executors[0];
  if (!executor) return;
  const $ = selector => document.querySelector(selector);
  const setText = (selector, value) => { const el = $(selector); if (el) el.textContent = value || ''; };
  const safe = value => String(value || '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const assetPath = value => /^(?:[a-z]+:|\/\/|data:|\/)/i.test(value || '') ? value : `/${value}`;
  const currentMonthYear = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date());
  if (window.Topography) Topography.mount(document.querySelector('.topography'), { variant: 'calm', hover: '.btn, .detail-panel' });
  document.title = `${executor.name} Executor - Features, UNC Level & Download`;
  $('#detail-logo').src = assetPath(executor.logo);
  $('#detail-logo').alt = `${executor.name} logo`;
  $('#detail-conclusion-logo').src = assetPath(executor.logo);
  $('#detail-conclusion-logo').alt = `${executor.name} logo`;
  const downloadsAvailable = executor.id === 'solara' || executor.id === 'xeno';
  const setDownloadState = (selector, available) => {
    const link = $(selector);
    if (!link) return;
    if (available) {
      link.href = executor.download;
      link.removeAttribute('target');
      link.removeAttribute('rel');
      link.removeAttribute('aria-disabled');
      link.removeAttribute('tabindex');
      link.classList.remove('is-disabled');
    } else {
      link.removeAttribute('href');
      link.removeAttribute('target');
      link.removeAttribute('rel');
      link.setAttribute('aria-disabled', 'true');
      link.setAttribute('tabindex', '-1');
      link.classList.add('is-disabled');
      link.setAttribute('title', 'Download is not currently available');
    }
  };
  setDownloadState('#detail-conclusion-download', downloadsAvailable);
  $('#detail-ui').src = assetPath(executor.ui);
  $('#detail-ui').alt = `${executor.name} interface preview`;
  setText('#detail-name', `${executor.name} Executor`);
  setText('#detail-description', executor.description);
  setText('#detail-intro-name', executor.name);
  setText('#detail-conclusion-name', executor.name);
  $('#detail-tags').innerHTML = `<span class="tag tag--status is-working"><i></i>Working</span><span class="tag">${safe(executor.price)}</span><span class="tag">${executor.keySystem ? 'Key system' : 'Keyless'}</span>${executor.platforms.map(platform => `<span class="tag">${safe(platform)}</span>`).join('')}`;
  setDownloadState('#detail-download', downloadsAvailable);
  const statIcons = {
    'UNC level': '<path d="M4 17 9 12l3 3 8-8"/><path d="M16 7h4v4"/>',
    'User count': '<circle cx="9" cy="8" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><path d="M15 6.5a3 3 0 0 1 0 5.8M17 14a4.5 4.5 0 0 1 3.5 4"/>',
    'Review rating': '<path d="m12 4 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8L12 4Z"/>',
    'Last updated': '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/>'
  };
  $('#detail-stats').innerHTML = [['UNC level', executor.unc], ['User count', executor.userCount], ['Review rating', executor.rating], ['Last updated', currentMonthYear]].map(([label, value]) => `<div><span class="detail-stat__icon"><svg viewBox="0 0 24 24" aria-hidden="true">${statIcons[label]}</svg></span><span>${safe(label)}</span><strong>${safe(value)}</strong></div>`).join('');
  $('#detail-table').innerHTML = [['Status', 'Working'], ['Supported OS', executor.platforms.join(', ')], ['Pricing', executor.price], ['Access', executor.keySystem ? 'Key system required' : 'Keyless'], ['UNC result', executor.unc], ['Profile reviewed', currentMonthYear]].map(([label, value]) => `<div><span>${safe(label)}</span><strong>${safe(value)}</strong></div>`).join('');
  $('#detail-pros').innerHTML = executor.pros.map(item => `<li>${safe(item)}</li>`).join('');
  $('#detail-cons').innerHTML = executor.cons.map(item => `<li>${safe(item)}</li>`).join('');
  $('#detail-features').innerHTML = executor.features.map(item => `<li>${safe(item)}</li>`).join('');
  const access = executor.keySystem ? 'key based' : 'keyless';
  setText('#detail-introduction', `${executor.name} is a ${executor.price.toLowerCase()} Windows executor with a ${access} access model. It is designed around ${executor.tagline.toLowerCase()} This profile brings the practical details together: compatibility, current feature coverage, access requirements, and the checks worth making before you run third-party software.`);
  setText('#detail-why', `${executor.name} is a good fit for people who value ${executor.features.slice(0, 2).join(' and ').toLowerCase()}. Its strongest use case is a simple, repeatable workflow where you can keep scripts organised, understand what is running, and return to the official source when Roblox updates change compatibility.`);
  const benefits = [...executor.features.slice(0, 3), executor.keySystem ? 'Clear access requirements' : 'No separate key step'];
  $('#detail-benefits').innerHTML = benefits.map(item => `<li>${safe(item)}</li>`).join('');
  const steps = [`Open the official ${executor.name} source from the Download button on this page.`, 'Read the current release notes and verify that the file matches the publisher and version you expect.', 'Scan the download with your security tools and keep it separate from sensitive files or accounts.', 'Follow the publisher setup notes, then test with a small, disposable workflow before relying on it.'];
  $('#detail-steps').innerHTML = steps.map(item => `<li>${safe(item)}</li>`).join('');
  const safety = ['Use official links and avoid re-uploaded executables, shortened URLs, and forced download wrappers.', 'Keep Roblox credentials, payment details, and personal files away from unknown tools or scripts.', 'Use a separate test account if you choose to experiment with third-party software.', 'Review Roblox rules and local security guidance before installing anything that injects into another process.'];
  $('#detail-safety').innerHTML = safety.map(item => `<li>${safe(item)}</li>`).join('');
  const troubleshooting = [['The download does not open', 'Confirm you used the official source, check that the file finished downloading, and review Windows security quarantine before trying again.'], ['The executor does not attach', 'Restart Roblox and the tool, check for a current release after the latest Roblox update, and follow the publisher setup notes.'], ['A script fails to run', 'Check whether it expects a function set this executor does not support, then test a small known script from a source you trust.'], ['Performance feels slow', 'Close unused clients, reduce background apps, and avoid running several heavy scripts at once.']];
  $('#detail-troubleshooting').innerHTML = troubleshooting.map(([q, a]) => `<details><summary>${safe(q)}<span class="faq__icon" aria-hidden="true"></span></summary><p>${safe(a)}</p></details>`).join('');
  const faq = [['Is this executor free?', `${executor.name} is listed as ${executor.price.toLowerCase()}. Check the access notes above for any key or premium requirements.`], ['Is it keyless?', executor.keySystem ? `${executor.name} uses a key system, so access may require a temporary key step.` : `${executor.name} is listed as keyless, which means there is no separate access key step in the listed flow.`], ['Which operating systems are supported?', `${executor.name} currently lists ${executor.platforms.join(', ')} support.`], ['Can I trust every script?', 'No. Script compatibility and safety depend on the source and what the code does. Prefer readable sources and never run code you cannot explain.']];
  $('#detail-faq').innerHTML = faq.map(([q, a]) => `<details><summary>${safe(q)}<span class="faq__icon" aria-hidden="true"></span></summary><p>${safe(a)}</p></details>`).join('');
  const animateDetails = root => root.querySelectorAll('details').forEach(item => {
    const summary = item.querySelector('summary');
    summary.addEventListener('click', event => {
      event.preventDefault();
      if (item.open) {
        item.classList.remove('is-opening');
        item.classList.add('is-closing');
        setTimeout(() => { item.open = false; item.classList.remove('is-closing'); }, 220);
      } else {
        item.open = true;
        item.classList.remove('is-closing');
        item.classList.add('is-opening');
        setTimeout(() => item.classList.remove('is-opening'), 280);
      }
    });
  });
  animateDetails($('#detail-troubleshooting'));
  animateDetails($('#detail-faq'));
  setText('#detail-conclusion', `${executor.name} brings together ${executor.features.slice(0, 3).join(', ').toLowerCase()} in a focused Windows workflow. Review the compatibility details, access model, and current release notes before you decide.`);
  setText('#detail-conclusion-summary', `A practical choice when you want ${executor.features.slice(0, 2).join(' and ').toLowerCase()} in one focused executor.`);
})();


