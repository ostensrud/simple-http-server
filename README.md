# SimpleServer.js
SimpleServer.js is a simple tool that utilizes [node.js] (https://nodejs.org/)
to test certain HTTP response codes.

It requires httpdispatcher, so...
```
npm install httpdispatcher
```

### Delay
If you want the server to add a delay to the response you can add ?delay=<delay in millis>.
```
wget "http://localhost:24000/200?delay=5000"
```

### Redirect
Both /301 and /302 will redirect to a 200 OK.
If you need to test a redirect with 302->301->200, use /redirect.
