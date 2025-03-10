// Job Description Analyzer
// This script extracts information from job descriptions

// Function to analyze job description
function analyzeJobDescription() {
  // Get the job description text
  const jobDescription = getJobDescriptionText();
  
  // Extract years of experience
  const experienceYears = extractExperienceYears(jobDescription);
  
  // Extract visa sponsorship information
  const visaSponsorship = extractVisaSponsorship(jobDescription);
  
  // Create overlay to display results
  displayResults(experienceYears, visaSponsorship);
}

// Function to get job description text based on site
function getJobDescriptionText() {
  // Get full page text as fallback
  let fullText = document.body.innerText;
  
  // Try to find specific job description containers based on the site
  // LinkedIn
  const linkedinSelectors = [
    '.description__text', 
    '.show-more-less-html__markup',
    '.jobs-description'
  ];
  
  // Indeed
  const indeedSelectors = [
    '#jobDescriptionText',
    '.jobsearch-jobDescriptionText'
  ];
  
  // Workday
  const workdaySelectors = [
    '.gwt-HTML',
    '[data-automation-id="jobReqDescription"]',
    '[data-automation-id="jobPostingDescription"]',
    '[data-automation-id="job-requisition-description-section"]',
    '.WKED',
    '#job-details',
    '#qualificationsTab',
    '#additionalJobDescriptionTab',
    '.job-description',
    // Walmart Workday specific selectors
    '[data-automation-id="qualificationsTitle"]',
    '[data-automation-id="minimumQualificationsTitle"]',
    '[data-automation-id="minimumQualificationsLabel"]',
    '[data-automation-id="minimumQualificationsText"]',
    // Generic Workday selectors that might contain job description content
    '[data-automation-id*="qualification"]',
    '[data-automation-id*="description"]',
    '[data-automation-id*="job"]'
  ];
  
  // General selectors that might contain job descriptions
  const generalSelectors = [
    '.job-description',
    '.description',
    '#job-description',
    '[itemprop="description"]',
    '.details-pane__content',
    '.listing-details',
    '.job-details',
    '.job-details-description',
    '.position-description',
    // Common section headers that might contain experience requirements
    '#qualifications',
    '#requirements',
    '#minimum-requirements',
    '#preferred-qualifications',
    '.qualifications',
    '.requirements'
  ];
  
  // Combine all selectors
  const allSelectors = [
    ...linkedinSelectors,
    ...indeedSelectors,
    ...workdaySelectors,
    ...generalSelectors
  ];
  
  // Try each selector
  for (const selector of allSelectors) {
    const elements = document.querySelectorAll(selector);
    if (elements && elements.length > 0) {
      // Combine text from all matching elements
      return Array.from(elements).map(el => el.innerText).join(' ');
    }
  }
  
  // Fallback to body text if no specific container found
  return fullText;
}

// Function to extract years of experience from job description
function extractExperienceYears(text) {
  // Check if text exists
  if (!text) {
    return "Not specified";
  }
  
  // Regular expressions to match common patterns for years of experience
  const patterns = [
    // Matches "X+ years", "X+ years of experience", etc.
    /(\d+)\+?\s*(?:to|-)\s*(\d+)\+?\s*years?(?:\s*of\s*experience)?/gi,
    /(\d+)\+?\s*years?(?:\s*of\s*experience)?/gi,
    
    // Matches phrases like "experience: X-Y years"
    /experience\s*:?\s*(\d+)\+?\s*(?:to|-)\s*(\d+)\+?\s*years?/gi,
    /experience\s*:?\s*(\d+)\+?\s*years?/gi,
    
    // Matches phrases like "X+ years' experience"
    /(\d+)\+?\s*years?['']\s*experience/gi,
    
    // Matches phrases with "minimum" or "at least"
    /(?:minimum|at\s*least)\s*(?:of\s*)?(\d+)\+?\s*years?/gi,
    
    // Matches phrases like "X years or more"
    /(\d+)\+?\s*years?\s*(?:or\s*more|minimum)/gi,
    
    // Match phrases where the word "experience" comes before years
    /experience\s*(?:of\s*)?(\d+)(?:\+|\s*\+)?\s*years?/gi,
    
    // Match phrases that specify months
    /(\d+)\s*months?\s*(?:of\s*)?experience/gi,
    
    // Special case for the format in the user's example (2+ Years of Experience in URL)
    /(\d+)\+?\s*Years?\s*of\s*Experience/gi,
    
    // Degree and experience patterns (like in the Walmart job)
    /(?:Bachelor|BS|B\.S\.|Master|MS|M\.S\.|Degree).*?(?:and|with).*?(\d+)\s*years?(?:\s*of\s*experience)?/gi,
    /(\d+)\s*years?.*?(?:of\s*)?experience.*?(?:in|with)/gi,
    
    // Years' apostrophe pattern (like "2 years' experience")
    /(\d+)\s*years?[''](?:\s*of\s*)?experience/gi,
    
    // OR pattern with different year requirements
    /(\d+)\s*years?.*?OR.*?(\d+)\s*years?/gi,
    
    // SAP or technical experience specific patterns
    /(\d+)\s*years?(?:\s*of\s*)?(?:SAP|technical|functional|related|relevant)\s*experience/gi,
    
    // Minimum qualification patterns
    /[Mm]inimum\s*[Qq]ualifications?.*?(\d+)\s*years?/gi,
    /[Bb]asic\s*[Qq]ualifications?.*?(\d+)\s*years?/gi,
    
    // Experience requirements in sentences
    /requires\s*(?:at\s*least\s*)?(\d+)(?:\+|\s*\+)?\s*years?/gi,
    /requiring\s*(?:at\s*least\s*)?(\d+)(?:\+|\s*\+)?\s*years?/gi
  ];
  
  for (const pattern of patterns) {
    const matches = [...text.matchAll(pattern)];
    if (matches.length > 0) {
      // Get the first match
      const match = matches[0];
      
      // Special case for "OR" patterns
      if (pattern.toString().includes('OR') && match.length > 2 && match[2]) {
        return `${match[1]} or ${match[2]} years`;
      }
      
      // If range is specified (e.g., "3-5 years")
      if (match.length > 2 && match[2]) {
        return `${match[1]}-${match[2]} years`;
      }
      
      // If months are specified
      if (pattern.toString().includes('months')) {
        const months = parseInt(match[1]);
        if (months < 12) {
          return `${months} months`;
        } else {
          const years = Math.floor(months / 12);
          const remainingMonths = months % 12;
          if (remainingMonths === 0) {
            return `${years} years`;
          } else {
            return `${years} years, ${remainingMonths} months`;
          }
        }
      }
      
      // If single value is specified (e.g., "3+ years")
      return `${match[1]}+ years`;
    }
  }
  
  // Check for special cases with degrees and experience requirements
  const degreeExpPattern = /(?:Bachelor|BS|B\.S\.|Master|MS|M\.S\.|Degree).*?and.*?(\d+).*?years?/i;
  const degreeMatch = degreeExpPattern.exec(text);
  if (degreeMatch) {
    return `${degreeMatch[1]}+ years`;
  }
  
  // Special case: Look for years in the URL or title if it's in the format specified
  const urlTitle = document.title + ' ' + window.location.href;
  const urlMatch = /(\d+)\+?\s*Years?\s*of\s*Experience/i.exec(urlTitle);
  if (urlMatch) {
    return `${urlMatch[1]}+ years`;
  }
  
  return "Not specified";
}

// Function to extract visa sponsorship information
function extractVisaSponsorship(text) {
  // Check if text exists
  if (!text) {
    return "Not mentioned";
  }
  
  // Convert to lowercase for case-insensitive matching
  const lowerText = text.toLowerCase();
  
  // Check for positive indications
  const positivePatterns = [
    /visa sponsorship (?:is |will be )?(?:available|provided|offered)/i,
    /(?:will|can|do|does) (?:provide|offer|sponsor)(?:s)? (?:a )?visa/i,
    /(?:will|can|do|does) sponsor(?:s)? (?:a )?visa/i,
    /(?:we )?(?:will|can|do|does) (?:offer|provide) (?:visa )?sponsorship/i,
    /sponsorship (?:is )?available/i,
    /open to sponsorship/i,
    /eligible for sponsorship/i,
    /willing to sponsor/i,
    /(?:visa )?sponsorship (?:will be |is )?provided/i,
    /we sponsor visa/i,
    /sponsor(?:s)? work visa/i,
    /(?:will|can) relocate and sponsor/i,
    /qualified for employment sponsorship/i
  ];
  
  // Check for negative indications
  const negativePatterns = [
    /no visa sponsorship/i,
    /not (?:able to|going to) sponsor/i,
    /cannot (?:provide|offer|sponsor) visa/i,
    /(?:does not|doesn't|will not|won't|do not|don't|unable to) sponsor/i,
    /sponsorship (?:is )?(?:not|NOT) available/i,
    /must be authorized to work/i,
    /must have work authorization/i,
    /authorization to work (?:is )?required/i,
    /must (?:have|possess) (?:the )?right to work/i,
    /no sponsorship/i,
    /cannot support visa/i,
    /visa not provided/i,
    /not eligible for sponsorship/i,
    /currently authorized to work/i,
    /legally authorized to work/i,
    /only candidates authorized to work/i,
    /must be (?:a )?(?:us|u\.s\.|united states) citizen/i,
    /work permit not provided/i,
    /not currently sponsoring/i
  ];
  
  // Check for positive patterns first
  for (const pattern of positivePatterns) {
    if (pattern.test(lowerText)) {
      return "Yes";
    }
  }
  
  // Then check for negative patterns
  for (const pattern of negativePatterns) {
    if (pattern.test(lowerText)) {
      return "No";
    }
  }
  
  return "Not mentioned";
}

// Function to display results in an overlay
function displayResults(experienceYears, visaSponsorship) {
  // Check if overlay already exists
  if (document.getElementById('job-analyzer-overlay')) {
    return;
  }
  
  // Create overlay element
  const overlay = document.createElement('div');
  overlay.id = 'job-analyzer-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 15px;
    width: 250px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 9999;
    font-family: Arial, sans-serif;
  `;
  
  // Create content for overlay
  overlay.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
      <h3 style="margin: 0; color: #0073b1; font-size: 16px;">Job Analysis Results</h3>
      <button id="close-overlay" style="background: none; border: none; cursor: pointer; font-size: 16px;">×</button>
    </div>
    <div style="margin-bottom: 5px;">
      <strong>Years of Experience:</strong> ${experienceYears}
    </div>
    <div>
      <strong>Visa Sponsorship:</strong> ${visaSponsorship}
    </div>
  `;
  
  // Add overlay to page
  document.body.appendChild(overlay);
  
  // Add event listener to close button
  document.getElementById('close-overlay').addEventListener('click', () => {
    document.body.removeChild(overlay);
  });
}

// Function to debug - show what text was analyzed if clicked on the title
function addDebugFunction() {
  const debugButton = document.createElement('button');
  debugButton.textContent = "Debug Job Analyzer";
  debugButton.style.cssText = `
    position: fixed;
    bottom: 10px;
    right: 10px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 5px;
    font-size: 12px;
    z-index: 9999;
    opacity: 0.7;
  `;
  debugButton.onclick = function() {
    const text = getJobDescriptionText();
    console.log("Text analyzed:", text);
    alert("Text length: " + text.length + " characters. Check console for full text.");
  };
  document.body.appendChild(debugButton);
}

// Run analysis when page is loaded
window.addEventListener('load', function() {
  setTimeout(analyzeJobDescription, 1500); // Wait a bit for dynamic content to load
  if (window.location.hostname.includes('myworkday')) {
    addDebugFunction(); // Add debug button for Workday sites
  }
});

// Listen for custom event from popup
document.addEventListener('triggerJobAnalysis', analyzeJobDescription);

// Also add a mutation observer to handle dynamically loaded content
const observer = new MutationObserver((mutations) => {
  // Only run if we don't already have an overlay
  if (!document.getElementById('job-analyzer-overlay')) {
    analyzeJobDescription();
  }
});

// Start observing the document with the configured parameters
observer.observe(document.body, { childList: true, subtree: true }); 