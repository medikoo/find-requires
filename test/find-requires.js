var fs         = require('fs')
  , test       = require('tap').test
  , bloodhound = require('../')
  , ast        = require('../lib/ast')
  , direct     = require('../lib/direct')

  , directResult, astResult;

directResult = ['one', 'thr/ee', 'fo\\ur', 'five', 'six', 'seven', 'ten', 'in-label',
  'seventeen', '\'eighteen\'', 'nineteen', 'twenty', 'twenty/one',
  'twenty/two', 'twenty/three', '/twenty/two/2/', 'twenty/three/2/',
  'twenty/four/2/\'', 'twenty/five/2/"', '\'twenty/six', '"twenty/eight',
  '"twenty/nine"', '"thirty"', 'thirty break-line one', 'thirty\two'];

astResult = ['one', '12', 'thr/ee', 'fo\\ur', 'five', 'six', 'seven',
  'undefined', 'eight', 'nine', 'ten', 'elevensplitpath', 'twelve',
  'fourteen', 'fifteen', 'sixteen', 'seventeen', '\'eighteen\'', 'nineteen',
  'twenty', 'twenty/one', 'twenty/two', 'twenty/three', '/twenty/two/2/',
  'twenty/three/2/', 'twenty/four/2/\'', 'twenty/five/2/"', '\'twenty/six',
  '\'twenty/seven\'', '"twenty/eight', '"twenty/nine"', '"thirty"',
  'thirty break-line one', 'thirty\two'];

test('find string requires (direct)', function (t) {
  var code = fs.readFileSync(__dirname+'/data/requires-direct.js', 'utf8');
  var wanted = directResult;
  t.plan(1);
  var found = bloodhound(code);
  t.deepEqual(found, wanted)
});

test('find string requires (direct raw)', function (t) {
  var code = fs.readFileSync(__dirname+'/data/requires-direct.js', 'utf8');
  var wanted = directResult;
  t.plan(3);
  var found = bloodhound(code, { raw: true });

  t.deepEqual(found.map(function (val) {
    return val.value;
  }).filter(Boolean), wanted);

  t.equal(found[0].at, 9);
  t.equal(found[0].raw, "'on\\u0065'");
});

test('find string requires (ast)', function (t) {
  var code = fs.readFileSync(__dirname+'/data/requires.js', 'utf8');
  var wanted = astResult;
  t.plan(1);
  var found = bloodhound(code)
  t.deepEqual(found, wanted)
});

test('find string requires (ast raw)', function (t) {
  var code = fs.readFileSync(__dirname+'/data/requires.js', 'utf8');
  var wanted = astResult;
  t.plan(3);
  var found = bloodhound(code, { raw: true });

  t.deepEqual(found.map(function (val) {
    return val.value;
  }).filter(Boolean), wanted);

  t.equal(found[0].at, 9);
  t.equal(found[0].raw, "'on\\u0065'");
});

test('find string requires (ast and direct same)', function (t) {
  var code = fs.readFileSync(__dirname+'/data/requires-direct.js', 'utf8');
  var wanted = astResult;
  var foundAst = ast(code);
  var foundDirect = direct(code);
  t.equal(foundAst.length, foundDirect.length, "Different lengths");

  foundAst.forEach(function (val, index) {
    t.deepEqual(val, foundDirect[index]);
  });
  t.end();
});

test('find string requires (direct - fall on ambigous slash)', function (t) {
  var code = fs.readFileSync(__dirname+'/data/requires-slash.js', 'utf8');
  t.plan(1);
  try {
    direct(code);
  } catch (e) {
    t.equal(e.type, 'slash-ambiguity');
  }
  t.end();
});

test('find string requires (direct - fall on return require)', function (t) {
  var code = fs.readFileSync(__dirname+'/data/requires-return.js', 'utf8');
  t.plan(1);
  try {
    direct(code);
  } catch (e) {
    t.equal(e.type, 'require-preced');
  }
  t.end();
});

test('find string requires (direct - fall on require arg)', function (t) {
  var code = fs.readFileSync(__dirname+'/data/requires-arg.js', 'utf8');
  t.plan(1);
  try {
    direct(code);
  } catch (e) {
    t.equal(e.type, 'require-args');
  }
  t.end();
});
