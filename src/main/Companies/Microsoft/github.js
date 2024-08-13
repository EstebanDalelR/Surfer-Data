const { customConsoleLog, waitForElement, wait, bigStepper } = require('../../preloadFunctions');
const { ipcRenderer } = require('electron');

async function exportGithub(company, name, runID) {
  await wait(2);
  if (document.querySelector('a[href="/login"]')) {
    ipcRenderer.send('connect-website', company);
    return;
  }
  const tabButton = await waitForElement('button[aria-label="Open user navigation menu"]', 'User navigation menu');

  if (!tabButton) {
    ipcRenderer.send('connect-website', company);
    return;
  }

  bigStepper(runID);
  tabButton.click();

  await wait(2);
  const repoTab = await waitForElement(
    '#\\:rg\\:',
    'Repository link',
  );

  bigStepper(runID);
  repoTab.click();

  await wait(2);

  return;
}

async function continueExportGithub() {
      ipcRenderer.sendToHost('get-run-id');
      ipcRenderer.on('got-run-id', async (event, id) => {
        bigStepper(id);
        customConsoleLog('got run id! ', id);
        
        const repos = [];

        while (true) {
          await wait(2);
          const repoLinks = await waitForElement('a[itemprop="name codeRepository"]', 'Repository links', true);
          for (const repoLink of repoLinks) {
            let desc = '';

            const siblingDiv =
              repoLink.parentElement.parentElement.nextElementSibling;
            if (siblingDiv && siblingDiv.childNodes[1]) {
              desc = siblingDiv.childNodes[1].innerText;
            }
            repos.push({
              name: repoLink.innerText,
              url: repoLink.href,
              description: desc,
            });
          }

          await wait(2);

          const nextPageButton = await waitForElement('a.next_page', 'Next page button');
          if (!nextPageButton) {
            break;
          }
          nextPageButton.scrollIntoView({
            behavior: 'instant',
            block: 'center',
          });
          nextPageButton.click();

          await wait(2);
        }


    customConsoleLog(
      'GitHub export completed. Total repositories:',
      repos.length,
    );

    bigStepper(id);
    ipcRenderer.send('handle-export', 'Microsoft', 'GitHub', repos, id);
    return;
  });
}

module.exports = { exportGithub, continueExportGithub };
