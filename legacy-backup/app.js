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
        name: 'Ready Pot',
        benefit: 'A ready-to-gift 4" eco-coir pot with coco peat and premium seeds in an eco-friendly gift box.',
        path: 'open-top-growbags.html',
        image: 'images/actual-products/Ready-Pot.JPG'
      },
      {
        name: 'Starter Kit',
        benefit: 'A compact 2-pot DIY coir kit with coco peat and premium seed balls for easy at-home growing.',
        path: 'tabs.html',
        image: 'images/actual-products/Strater-kit.JPG'
      },
      {
        name: 'Medium Kit',
        benefit: 'A complete 2-pot medium DIY coir kit with larger 6" pots, coco peat, and premium seed balls.',
        path: 'loose.html',
        image: 'images/actual-products/Medium-Kit.JPG'
      },
      {
        name: 'Premium Kit',
        benefit: 'Our top-tier kit with 6 eco-coir pots, a hanging coir basket, and a coco support pole in a luxury box.',
        path: 'growbags.html',
        image: 'images/actual-products/premium.png'
      },
      {
        name: 'Coco Grow Disk',
        benefit: 'Uniform coco grow disks for clean propagation, quick rooting, and tidy nursery handling.',
        path: 'coco-grow-cubes.html',
        image: 'images/actual-products/disk.png'
      },
      {
        name: 'Premium Cocopeat',
        benefit: 'Premium cocopeat media formulated for strong root growth and reliable moisture retention.',
        path: 'blocks.html',
        image: 'images/actual-products/Brick.JPG'
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
    $scope.selectedCategory = 'all';
  };

  $scope.filterFormat = function (format) {
    return true;
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
