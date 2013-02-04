node-maven
==========

Simple maven repository server written in Javascript using node.js.

Why another server?
-------------------

It was needed simple to configure Maven repository server. We used to use Apache Archiva but it was buggy and slow. It took also quite a lot memory for such a simple task. Apache mod-dav plugin didn't support well PUT deploys (no support for creating inexisting directories).

How to set up?
--------------

1. Install node.js.
2. Clone this repository.
3. Execute `npm install`.
4. Edit config.json file.
5. Execute `npm link`.
6. Start server with ``nodemaven``.

To do
-----

1. Forwarding calls to other servers.
2. ...





