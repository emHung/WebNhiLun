// test_phase1.js - Test suite for Phase P1 Public Pages
const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('=== RUNNING PHASE P1 TESTS ===');

// Setup mock browser environment
const localStorageStore = {};
const mockLocalStorage = {
  getItem: (k) => localStorageStore[k] || null,
  setItem: (k, v) => { localStorageStore[k] = String(v); },
  removeItem: (k) => { delete localStorageStore[k]; },
  clear: () => { Object.keys(localStorageStore).forEach(k => delete localStorageStore[k]); }
};

const sandbox = {
  console,
  localStorage: mockLocalStorage,
  window: {},
  document: {
    addEventListener: () => {}
  }
};
vm.createContext(sandbox);

const seedDataCode = fs.readFileSync(path.join(__dirname, 'data', 'seedData.js'), 'utf8');
vm.runInContext(seedDataCode, sandbox);

const storageCode = fs.readFileSync(path.join(__dirname, 'shared', 'useStorage.js'), 'utf8');
vm.runInContext(storageCode, sandbox);

const repoCode = fs.readFileSync(path.join(__dirname, 'shared', 'useRepository.js'), 'utf8');
vm.runInContext(repoCode, sandbox);

const useRepository = sandbox.window.useRepository || sandbox.useRepository;
useRepository.init();

// Test 1: useRepository public activities count
const publicActs = useRepository.getActivities({ publicOnly: true });
console.log(`[TEST 1] Public activities returned: ${publicActs.length}`);
if (publicActs.length >= 5) {
  console.log('✅ PASS: getActivities({ publicOnly: true }) returns published activities');
} else {
  console.error('❌ FAIL: Expected at least 5 public activities');
  process.exit(1);
}

// Test 2: Verify HTML files load scripts properly
const activitiesHtml = fs.readFileSync(path.join(__dirname, 'activities.html'), 'utf8');
const detailHtml = fs.readFileSync(path.join(__dirname, 'detail.html'), 'utf8');
const storiesHtml = fs.readFileSync(path.join(__dirname, 'stories.html'), 'utf8');

const requiredScripts = ['data/seedData.js', 'shared/useRepository.js', 'shared/useToast.js', 'shared/useTheme.js', 'shared/useAuth.js', 'shared/useNotification.js'];
requiredScripts.forEach(script => {
  if (!activitiesHtml.includes(script)) {
    console.error(`❌ FAIL: activities.html missing ${script}`);
    process.exit(1);
  }
  if (!detailHtml.includes(script)) {
    console.error(`❌ FAIL: detail.html missing ${script}`);
    process.exit(1);
  }
  if (!storiesHtml.includes(script)) {
    console.error(`❌ FAIL: stories.html missing ${script}`);
    process.exit(1);
  }
});
console.log('✅ PASS: All 3 public pages include standardized data & repo scripts');

// Test 3: Verify no alert() in activities, detail, stories
const checkAlert = (html, filename) => {
  const alertMatches = html.match(/alert\s*\(/g);
  if (alertMatches) {
    console.error(`❌ FAIL: ${filename} still contains alert(): ${alertMatches.length} occurrences`);
    process.exit(1);
  }
};
checkAlert(activitiesHtml, 'activities.html');
checkAlert(detailHtml, 'detail.html');
checkAlert(storiesHtml, 'stories.html');
console.log('✅ PASS: 0 alert() mock calls in public pages');

// Test 4: Verify 7 detail tabs exist
const expectedTabs = ['overview', 'schedule', 'location', 'requirements', 'organizer', 'images', 'reviews'];
expectedTabs.forEach(t => {
  if (!detailHtml.includes(`tab-pane-${t}`)) {
    console.error(`❌ FAIL: detail.html missing section #tab-pane-${t}`);
    process.exit(1);
  }
});
console.log('✅ PASS: detail.html has all 7 content tab sections');

// Test 5: Verify Lightbox modal exists in detail.html
if (detailHtml.includes('id="lightboxModal"') && detailHtml.includes('openLightbox') && detailHtml.includes('closeLightbox')) {
  console.log('✅ PASS: detail.html includes functional Lightbox Modal');
} else {
  console.error('❌ FAIL: Lightbox modal missing in detail.html');
  process.exit(1);
}

// Test 6: Verify Video modal exists in stories.html
if (storiesHtml.includes('id="storyVideoModal"') && storiesHtml.includes('openStoryVideoModal')) {
  console.log('✅ PASS: stories.html includes functional Video Modal');
} else {
  console.error('❌ FAIL: Video modal missing in stories.html');
  process.exit(1);
}

// Test 7: Verify Favorite toggle persistence via repository
// Initially ACT-001 & ACT-003 are favorited in seedData
console.log('Initial favorites:', useRepository.getFavorites());
const isFavInitial = useRepository.isFavorite('ACT-002'); // should be false
const toggleResult1 = useRepository.toggleFavorite('ACT-002'); // should be true
const isFavAfter1 = useRepository.isFavorite('ACT-002');

if (!isFavInitial && toggleResult1 === true && isFavAfter1 === true) {
  console.log('✅ PASS: Favorite ACT-002 toggled to TRUE and persisted');
} else {
  console.error('❌ FAIL: Favorite toggle to true failed');
  process.exit(1);
}

const toggleResult2 = useRepository.toggleFavorite('ACT-002'); // should be false
const isFavAfter2 = useRepository.isFavorite('ACT-002');

if (toggleResult2 === false && isFavAfter2 === false) {
  console.log('✅ PASS: Favorite ACT-002 untoggled to FALSE and persisted');
} else {
  console.error('❌ FAIL: Favorite untoggle to false failed');
  process.exit(1);
}

console.log('=== ALL PHASE P1 TESTS PASSED! ===');
