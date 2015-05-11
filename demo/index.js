var Stickshift = require('stickshift');

var db = new SQL.Database();

db.run('CREATE TABLE fake(x, y, z)');
db.run('CREATE TABLE places(name, lat, lng)');
db.run('CREATE TABLE cats(name, whiskers, feet)');

for (var i = 0; i < 100; i++) {
  // truly random data and totally sin-wave data looks weird, so we
  // have a slowly-changing random offset
  db.run('INSERT INTO fake VALUES (?, ?, ?)', [
    (new Date((+new Date() - (i * 1000 * 60 * 60)))).toString(),
    ((Math.sin(i / 10) + 1) * 10) + Math.random() * 20,
    ((Math.cos(i / 5) + 1) * 40) + Math.random() * 5
  ]);
}

require('./france.json').forEach(function(place) {
  db.run('INSERT INTO places VALUES (?, ?, ?)', place);
});

['bella', 'socks', 'jack', 'oreo'].forEach(function(name) {
  db.run('INSERT INTO cats VALUES (?, ?, ?)', [
    name, ~~(Math.random() * 50), 4
  ]);
});

Stickshift(document.getElementById('page'), {
  mapboxToken: 'pk.eyJ1IjoidG1jdyIsImEiOiJIZmRUQjRBIn0.lRARalfaGHnPdRcc-7QZYQ',
  endpoint: function(query, callback) {
    try {
      var stmt = db.prepare(query);
      var rows = [];
      while (stmt.step()) {
        rows.push(stmt.getAsObject());
      }
      callback(null, rows);
    } catch(e) {
      callback(null, { message: e.toString() });
    }
  }
});
