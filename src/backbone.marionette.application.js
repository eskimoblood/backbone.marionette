// Application
// -----------

// Contain and manage the composite application as a whole.
// Stores and starts up `Region` objects, includes an
// event aggregator as `app.vent`
Marionette.Application = function(options){
  this.initCallbacks = new Marionette.Callbacks();
  this.vent = new Marionette.EventAggregator();
  _.extend(this, options);
};

_.extend(Marionette.Application.prototype, Backbone.Events, {
  // Add an initializer that is either run at when the `start`
  // method is called, or run immediately if added after `start`
  // has already been called.
  addInitializer: function(initializer){
    this.initCallbacks.add(initializer);
  },

  // kick off all of the application's processes.
  // initializes all of the regions that have been added
  // to the app, and runs all of the initializer functions
  start: function(options){
    this.trigger("initialize:before", options);
    this.initCallbacks.run(options, this);
    this.trigger("initialize:after", options);

    this.trigger("start", options);
  },

  // Add regions to your app. 
  // Accepts a hash of named strings or Region objects
  // addRegions({something: "#someRegion"})
  // addRegions{{something: Region.extend({el: "#someRegion"}) });
  addRegions: function(regions){
    var regionValue, regionObj, region;

    for(region in regions){
      if (regions.hasOwnProperty(region)){
        regionValue = regions[region];

        if (typeof regionValue === "string"){
          regionObj = new Marionette.Region({
            el: regionValue
          });
        } else {
          regionObj = new regionValue();
        }

        this[region] = regionObj;
      }
    }
  },

  // Create a module, attached to the application
  module: function(){
    // see the Marionette.Module object for more information
    return Marionette.Module.create.apply(this, arguments);
  }
});

// Copy the `extend` function used by Backbone's classes
Marionette.Application.extend = Backbone.View.extend;

// Copy the features of `BindTo`
_.extend(Marionette.Application.prototype, Marionette.BindTo);
