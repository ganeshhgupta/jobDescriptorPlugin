// Wait for the DOM to be loaded
document.addEventListener('DOMContentLoaded', function() {
  // Get the analyze button
  const analyzeButton = document.getElementById('analyze-button');
  
  // Add click event listener
  analyzeButton.addEventListener('click', function() {
    // Get the active tab in the current window
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      // Get the active tab
      const activeTab = tabs[0];
      
      // First try to execute direct script
      chrome.scripting.executeScript({
        target: {tabId: activeTab.id},
        function: triggerAnalysis
      });
      
      // Also inject the content script for sites where it might not have loaded
      chrome.scripting.executeScript({
        target: {tabId: activeTab.id},
        files: ['content.js']
      }, function() {
        // After injecting content script, trigger the analysis
        chrome.scripting.executeScript({
          target: {tabId: activeTab.id},
          function: triggerAnalysisByEvent
        });
      });
    });
  });
});

// Function to trigger analysis in the content script
function triggerAnalysis() {
  // Check if content script is already loaded
  if (typeof analyzeJobDescription === 'function') {
    // Call the function directly
    analyzeJobDescription();
    return true;
  }
  return false;
}

// Function to trigger analysis via custom event
function triggerAnalysisByEvent() {
  // Dispatch a custom event to trigger analysis
  const event = new CustomEvent('triggerJobAnalysis');
  document.dispatchEvent(event);
} 