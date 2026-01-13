// Background service worker for Gujarat Services Auto-Fill Extension

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Gujarat Services Auto-Fill Extension installed');
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getStoredData') {
    chrome.storage.local.get(['userData', 'autofillData'], (data) => {
      sendResponse(data);
    });
    return true;
  }
});

// Context menu for quick fill
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'autoFillForm',
    title: 'Auto-Fill with Gujarat Portal Data',
    contexts: ['page']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'autoFillForm') {
    chrome.tabs.sendMessage(tab.id, { action: 'fillForm' });
  }
});
