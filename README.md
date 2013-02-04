node-maven
==========

Simple maven repository server written in Javascript using node.js.

Why another server?
-------------------

It was needed simple to configure Maven repository server. We used to use Apache Archiva but it was buggy and slow. It took also quite a lot memory for such a simple task. Apache mod-dav plugin didn't support well PUT deploys (no support for creating inexisting directories).

How to set up?
--------------

1. Install node.js.
2. Edit config.js file.
3. Start server with ``node main.js``

To do
-----

1. Authentication/authorization.
2. Forwarding calls to other servers.
3. ...





