
/**
 * Expose `JSON`.
 */

exports = module.exports = JSONReporter;

/**
 * Initialize a new `JSON` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function JSONReporter(runner) {
   "use strict";
  var self = this,
      Base;
    /**
     * Module dependencies.
     */


  try { Base = require('../mocha/lib/reporters/base'); } catch (err) {};
  if (!Base) try { Base = require('./base'); } catch (err) {};
  Base.call(this, runner);

  var tests = [],
      failures = [],
      passes = [],
      skipped = [];

  runner.on('test end', function(test){
    tests.push(test);
  });

  runner.on('pending', function (test) {
      skipped.push(test);
  });

  runner.on('pass', function(test){
    passes.push(test);
  });

  runner.on('fail', function(test){
    failures.push(test);
  });

  runner.on('end', function(){
    var obj = {
        stats: self.stats,
      //, tests: tests.map(clean)
        failures: failures.map(clean),
        passes: passes.map(clean),
        skipped: skipped.map(clean)
    };

    process.stdout.write(JSON.stringify(obj, null, 2));
  });
}

/**
 * Return a plain-object representation of `test`
 * free of cyclic properties etc.
 *
 * @param {Object} test
 * @return {Object}
 * @api private
 */

function clean(test) {
    "use strict";
    var o = {
        title: test.title,
        fullTitle: test.fullTitle(),
        duration: test.duration
    };
    if (test.hasOwnProperty("err")) {
        o.error = test.err.stack.toString();
    }
    return o;
}