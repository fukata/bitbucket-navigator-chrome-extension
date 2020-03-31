//console.log('Run Bitbucket Navigator');
const hash = new Date().getTime();
const wrapperId = `bitbucket-navigator-nav-link-wrapper-${hash}`;

/**
 * Handler toggle button
 * @param {Event} event
 */
const onToggle = (event) => {
  const node = event.target;
  const currentText = node.innerText;
  const navNode = document.querySelector(`#${wrapperId} .bitbucker-navigator-nav`);

  if (currentText === node.getAttribute('data-open-text')) {
    // closed
    navNode.style.display = 'block';
    node.innerText = node.getAttribute('data-close-text');
  } else {
    // opened
    navNode.style.display = 'none';
    node.innerText = node.getAttribute('data-open-text');
  }
};

/**
 * Generate navigation links
 * @param {Array} commentLinks
 */
const generateNavLinks = (commentLinks) => {
  //console.log('generateNavLink. commentLinks: ', commentLinks.length);

  let wrapperNode = document.querySelector(`#${wrapperId}`);
  let navNode = null;
  if (wrapperNode) {
    navNode = wrapperNode.querySelector('.bitbucker-navigator-nav');
    navNode.innerHTML = ''; // clear;
  } else {
    wrapperNode = document.createElement('div');
    wrapperNode.id = wrapperId;
    wrapperNode.style.cssText = `
      position: fixed;
      bottom: 10px;
      right: 10px;
      max-width: 500px;
      max-height: 200px;
      overflow-y: auto;
      word-break: break-all;
      z-index: 1000;
      color: black;
      padding: 5px;
      border: 1px solid #999999;
      background-color: #cccccc;
    `;

    // toggle button
    const toggleButton = document.createElement('button');
    toggleButton.setAttribute('data-open-text', 'Open Navi');
    toggleButton.setAttribute('data-close-text', 'Close Navi');
    toggleButton.innerText = toggleButton.getAttribute('data-close-text'); // default opened
    toggleButton.onclick = onToggle;

    const toggleButtonWrapper = document.createElement('div');
    toggleButtonWrapper.style.cssText = `text-align: right;`;
    toggleButtonWrapper.appendChild(toggleButton)
    wrapperNode.appendChild(toggleButtonWrapper);

    // nav
    navNode = document.createElement('div');
    navNode.className = 'bitbucker-navigator-nav'
    wrapperNode.appendChild(navNode);

    document.body.appendChild(wrapperNode);
  }

  commentLinks.forEach(commentLink => {
    //console.log('commentLink: ', commentLink);
    const fileLink = commentLink.querySelector('.comments-link')
    const countNode = commentLink.querySelector('.count')
    navNode.innerHTML += `
      <div>
        <a href="${fileLink.href}">${fileLink.getAttribute('data-file-path')} (${countNode.innerText})</a>
      </div>
    `;
  })
};

window.onload = () => {
  const prTabContent = document.querySelector('#pr-tab-content');
  if (!prTabContent) {
    // maybe not pull request page...
    return;
  }

  let loadedCommitFilesSummary = false;

  prTabContent.addEventListener('DOMSubtreeModified', (_) => {
    if (!loadedCommitFilesSummary) {
      const node = document.querySelector('#commit-files-summary');
      loadedCommitFilesSummary = !!node;

      if (loadedCommitFilesSummary) {
        prTabContent.querySelector('#commit-files-summary').addEventListener('DOMSubtreeModified', (_) => {
          const commentLinks = document.querySelectorAll('#commit-files-summary > li.iterable-item.file.file-modified .count-badge');
          if (commentLinks && commentLinks.length > 0) {
            generateNavLinks(commentLinks);
          }
        });
      }
    }
  });
};