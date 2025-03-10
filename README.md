# Job Description Analyzer Chrome Extension

A Chrome extension that analyzes job descriptions on LinkedIn and other job sites to extract key information:
- Years of experience required
- Visa sponsorship availability (Yes/No/Not mentioned)

## Installation Instructions

Since this extension isn't published on the Chrome Web Store, you'll need to install it in developer mode:

1. **Download/Clone this repository**
   - Save all files to a folder on your computer

2. **Open Chrome Extensions page**
   - Open Chrome and navigate to `chrome://extensions/`
   - Or click on the menu (three dots) > More Tools > Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner to ON

4. **Load the Extension**
   - Click the "Load unpacked" button
   - Navigate to and select the folder containing the extension files
   - Click "Select Folder"

5. **Verify Installation**
   - The extension should now appear in your list of extensions
   - You should see the extension icon in your Chrome toolbar

## Usage Instructions

1. **Navigate to a job description page**
   - The extension works on many job sites including:
     - LinkedIn
     - Indeed
     - Glassdoor
     - Monster
     - Workday sites (myworkdaysite.com)
     - Lever
     - Greenhouse
     - And many others

2. **Automatic Analysis**
   - The extension will automatically analyze the job description and display results in an overlay
   - The overlay will appear in the top-right corner of the page

3. **Manual Analysis**
   - If the automatic analysis doesn't trigger, click on the extension icon in the toolbar
   - In the popup, click the "Analyze Current Job" button

4. **View Results**
   - The results will show:
     - Years of experience required
     - Whether visa sponsorship is available

5. **Close the Overlay**
   - Click the "×" button in the top-right corner of the overlay to close it

## How It Works

The extension uses pattern matching and regular expressions to scan the job description text for:

- Phrases indicating years of experience (e.g., "3+ years", "2-5 years of experience")
- Phrases indicating visa sponsorship status (e.g., "visa sponsorship available", "no visa sponsorship")

The extension will also look at the page URL and title for additional clues (especially useful for job titles that contain experience requirements).

## Troubleshooting

If the extension doesn't work on a particular job site:

1. Try clicking the extension icon and using the "Analyze Current Job" button
2. If that doesn't work, the job description might be in a format the extension can't recognize
3. Please report such cases so the extension can be improved

## Limitations

- The extension relies on pattern matching, so it may not capture all variations of how this information is presented
- Some job descriptions may not explicitly mention this information
- The extension works best on standard job description pages from major job sites 