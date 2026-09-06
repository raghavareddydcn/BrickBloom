// BrickBloom Static App — All product data embedded for GitHub Pages deployment
var app = angular.module('brickbloomSite', []);

app.controller('mainController', function ($scope, $http) {
  $scope.formats = [];
  $scope.sourcingHubs = [];
  $scope.qualityNotes = [];
  $scope.overview = '';
  $scope.selectedCategory = 'all';
  $scope.form = { name: '', email: '', phone: '', company: '', product: '', message: '' };
  $scope.notice = '';

  // Static data — replaces the API call for GitHub Pages compatibility
  var staticData = {
    overview: 'Premium BrickBloom sourcing for hydroponics, nurseries, and commercial growers.',
    formats: [
      {
        name: 'Coco Tabs',
        benefit: 'Precision-fit starter tabs for clean sowing and fast, uniform germination.',
        path: 'tabs.html',
        image: 'images/actual-products/Strater-kit.JPG'
      },
      {
        name: 'Coco Grow Cubes',
        benefit: 'Uniform propagation cubes that support strong rooting and tidy nursery handling.',
        path: 'coco-grow-cubes.html',
        image: 'images/actual-products/disk.png'
      },
      {
        name: 'Coco Bricks',
        benefit: 'Compact bricks that expand into a rich medium for nursery and potting programs.',
        path: 'coco-bricks.html',
        image: 'images/actual-products/Brick.JPG'
      },
      {
        name: 'Coco Blocks',
        benefit: 'Bulk blocks made for commercial growers who want dependable hydration and storage efficiency.',
        path: 'blocks.html',
        image: 'images/actual-products/Brick.JPG'
      },
      {
        name: 'Coco GrowSlabs',
        benefit: 'Ready-to-use slabs designed for balanced moisture and smooth greenhouse placement.',
        path: 'coco-growslabs.html',
        image: 'images/actual-products/premium.png'
      },
      {
        name: 'Coco Growbags',
        benefit: 'Flexible growbags built for easy transplanting, durable handling, and clean crop flow.',
        path: 'growbags.html',
        image: 'images/actual-products/premium.png'
      },
      {
        name: 'Open Top Growbags',
        benefit: 'Open top growbags engineered for excellent aeration and simple crop access.',
        path: 'open-top-growbags.html',
        image: 'images/actual-products/Ready-Pot.JPG'
      },
      {
        name: 'Coco Loose Substrates',
        benefit: 'Loose cocopeat for custom media recipes, rapid potting, and flexible cultivation setups.',
        path: 'loose.html',
        image: 'images/actual-products/Medium-Kit.JPG'
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
    var f = $scope.form;
    if (!f.name || !f.email || !f.phone || !f.company || !f.product || !f.message) {
      $scope.notice = 'Please complete every field so we can prepare your quote.';
      return;
    }
    
    $http({
      method: 'POST',
      url: 'https://formsubmit.co/ajax/admin@brickbloom.co.in',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      data: {
        name: f.name,
        email: f.email,
        phone: f.phone,
        company: f.company,
        product: f.product,
        message: f.message,
        _subject: 'BrickBloom Sourcing Inquiry for ' + f.product + ' from ' + f.company
      }
    }).then(function (response) {
      $scope.notice = 'Thank you, ' + f.name + '. Our sourcing desk will contact you shortly.';
      $scope.form = { name: '', email: '', phone: '', company: '', product: '', message: '' };
    }).catch(function (error) {
      var details = (error.status === -1) ? "Network Error / AdBlocker / CORS" : error.status;
      if (error.data && error.data.message) {
        details += " - " + error.data.message;
      }
      $scope.notice = 'Error processing inquiry (' + details + '). Please check the admin email for activation link or wait 2 minutes for deployment cache to clear.';
    });
  };
});
