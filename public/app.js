// BrickBloom Static App — All product data embedded for GitHub Pages deployment
var app = angular.module('brickbloomSite', []);

app.controller('mainController', function ($scope, $http) {
  $scope.formats = [];
  $scope.sourcingHubs = [];
  $scope.qualityNotes = [];
  $scope.overview = '';
  $scope.selectedCategory = 'all';
  $scope.form = { name: '', email: '', company: '', message: '' };
  $scope.notice = '';

  // Static data — replaces the API call for GitHub Pages compatibility
  var staticData = {
    overview: 'Premium BrickBloom sourcing for hydroponics, nurseries, and commercial growers.',
    formats: [
      {
        name: 'Coco Tabs',
        benefit: 'Eco-friendly propagation tablets for seed starting and cuttings.',
        path: 'tabs.html',
        image: 'images/coco-tabs.svg'
      },
      {
        name: 'Coco Grow Cubes',
        benefit: 'Preformed grow cubes for uniform rooting and clean handling.',
        path: 'coco-grow-cubes.html',
        image: 'images/coco-grow-cubes.svg'
      },
      {
        name: 'Coco Bricks',
        benefit: 'Compressed cocopeat bricks for potting mixes and seedling beds.',
        path: 'coco-bricks.html',
        image: 'images/coco-bricks.png'
      },
      {
        name: 'Coco Blocks',
        benefit: 'Bulk cocopeat blocks for growers and export-ready packs.',
        path: 'blocks.html',
        image: 'images/coco-blocks-branded.svg'
      },
      {
        name: 'Coco GrowSlabs',
        benefit: 'Ready-to-use slabs with controlled peat, fiber, and chip ratios.',
        path: 'coco-growslabs.html',
        image: 'images/coco-growslabs.png'
      },
      {
        name: 'Coco Growbags',
        benefit: 'Standard coco growbags for transplanting and greenhouse crops.',
        path: 'growbags.html',
        image: 'images/coco-growbags-branded.svg'
      },
      {
        name: 'Open Top Growbags',
        benefit: 'Open top growbags for premium planting and easy crop access.',
        path: 'open-top-growbags.html',
        image: 'images/open-top-growbags-branded.svg'
      },
      {
        name: 'Coco Loose Substrates',
        benefit: 'Loose cocopeat substrate for bulk potting and media mixing.',
        path: 'loose.html',
        image: 'images/coco-loose.svg'
      }
    ],
    sourcingHubs: [
      { region: 'India', focus: 'Large-scale processing, low-EC custom blends, and compressed bales.' },
      { region: 'Sri Lanka', focus: 'Naturally aged, high-porosity cocopeat for premium media mixes.' },
      { region: 'Global directories', focus: 'Direct sourcing from certified mills and exporters.' }
    ],
    qualityNotes: [
      'Washed and buffered media for lower salinity.',
      'Custom peat-to-chip ratios for different crop programs.',
      'Bulk freight-ready packaging for long-haul export.'
    ]
  };

  // Load static data directly
  $scope.formats = staticData.formats;
  $scope.sourcingHubs = staticData.sourcingHubs;
  $scope.qualityNotes = staticData.qualityNotes;
  $scope.overview = staticData.overview;

  // Also try the API if running on Node.js (gracefully fallback if not available)
  $http.get('api/market-intelligence.json').then(function (response) {
    if (response.data && response.data.formats) {
      $scope.formats = response.data.formats;
      $scope.sourcingHubs = response.data.sourcingHubs;
      $scope.qualityNotes = response.data.qualityNotes;
      $scope.overview = response.data.overview;
    }
  }).catch(function () {
    // Silently use static data when API is unavailable (GitHub Pages)
  });

  $scope.setFilter = function (category) {
    $scope.selectedCategory = category;
  };

  $scope.filterFormat = function (format) {
    if ($scope.selectedCategory === 'all') return true;
    if ($scope.selectedCategory === 'bricks' && (format.name.includes('Brick') || format.name.includes('Block'))) return true;
    if ($scope.selectedCategory === 'growbags' && (format.name.includes('Growbag') || format.name.includes('Slab') || format.name.includes('GrowSlabs'))) return true;
    if ($scope.selectedCategory === 'propagation' && (format.name.includes('Tab') || format.name.includes('Cube') || format.name.includes('Loose'))) return true;
    return false;
  };

  $scope.submitLead = function () {
    // For GitHub Pages, open mailto link as API calls are unavailable
    var f = $scope.form;
    if (!f.name || !f.email || !f.company || !f.message) {
      $scope.notice = 'Please complete every field so we can prepare your quote.';
      return;
    }
    var subject = encodeURIComponent('BrickBloom Sourcing Inquiry from ' + f.company);
    var body = encodeURIComponent(
      'Name: ' + f.name + '\n' +
      'Email: ' + f.email + '\n' +
      'Company: ' + f.company + '\n\n' +
      'Inquiry:\n' + f.message
    );
    window.location.href = 'mailto:admin@brickbloom.co.in?subject=' + subject + '&body=' + body;
    $scope.notice = 'Thank you, ' + f.name + '. Opening your email client to send the inquiry.';
    $scope.form = { name: '', email: '', company: '', message: '' };
  };
});
