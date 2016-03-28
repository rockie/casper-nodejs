var webserver = require('webserver');

var server = {
  
  _server: null,

  _send: function(response, content, status_code) {
    if(status_code == null)
      status_code = 200;

    response.statusCode = status_code;
    response.write(content);
    response.close();
  },

  start: function(casper, action_list, port) {
    casper.echo("attente d'une requete");
    server._server = webserver.create();
    server._server.listen(port, function(request, response) {
      
      var method = request.method.toUpperCase();

      if (method !== 'POST') {
        server._send(response, 'Requests must be POST\n', 405);
        return;
      } 
      else if (request.headers['Content-Type'] !== 'application/json' &&
        request.headers['content-type'] !== 'application/json'
      ) {
        server._send(response, 'Request entity must be JSON\n', 415);
        return;
      }

      // execute the action asked
      try {
        var req_content = JSON.parse(request.post);
      } catch (e) {
        throw new Error('Could not parse "' + request.post + '" as JSON');
      }

      casper.echo("test");
      console.log("test");

      console.log(req_content['action']);
      /*if(req_content.action == 'start') {
        casper.start(req_content.url, function() {
          console.log("casper.start executed");
        });
        server._send(response, "OK\n");
        return;
      }
      else if(req_content.action == 'run') {
        casper.run(function() {
          console.log("casper.run executed");
        });
        server._send(response, "OK\n");
        return;
      }*/
      if(req_content.action == 'then') {
        casper.emit('mlc.action');
        /*casper.then(function() {
          console.log("casper.then executed");
        });*/

        server._send(response, "OK\n");
        return;
      }
      else if(req_content.action == 'exit') {
        casper.exit();
        server._send(response, "OK\n");
        return;
      }

      console.log(method);
      server._send(response, "NOT OK: '" + req_content['action'] + "'\n");
    });
  }
  
};

module.exports = server;
