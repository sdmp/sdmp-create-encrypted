# sdmp-create-encrypted

This module will create an [`encrypted`](http://sdmp.io/spec/0.13/core/encrypted)
container object according to the specifications in the
[SDMP](http://sdmp.io) protocol.

Two important things to note:

1. The encrypted container is not signed. (Signatures are a
	[different container](http://sdmp.io/spec/0.12/core/signature/).)
	Because of this, there is no inherent proof of authorship in
	this container. 
2. [The specs](http://sdmp.io/spec/0.12/core/encrypted/#payload) require
	the encrypted payload to be a valid SDMP container. This module does
	*not* validate the data in any way prior to encryption.

## install

This module is made to use [npm](https://www.npmjs.com/). Install
the normal `npm` way:

	npm install sdmp-create-encrypted

## use it

Pass in the payload to be encrypted as a [buffer](https://nodejs.org/api/buffer.html),
and an array of [node-rsa](https://github.com/rzcoder/node-rsa)
public key objects of `2048` bits:

	var create = require('sdmp-create-encrypted')
	var container = create(payload, listOfNodeRsaPublicKeys)
	// container is a valid identity container object, e,g,
	console.log(container.encrypted.payload) // base64url encoded string

## node-rsa

The node-rsa module is an RSA crypto module implemented in pure
JavaScript. This gives maximum portability, but generating keys
in JS is not as fast as system-native libraries.

You can create a `node-rsa` public key object any of the following ways:

#### from PEM encoded string

	var NodeRSA = require('node-rsa')
	var pemKey = '-----BEGIN PUBLIC KEY-----\n...'
	var nodeRsaKey = new NodeRSA(pemKey)

#### from existing SDMP `identity` container

	var NodeRSA = require('node-rsa')
	var container = // a valid `identity` container
	var nodeRsaKey = new NodeRSA(container.identity.key)

## api `create(payload, listOfNodeRsaPublicKeys)`

In all cases, calling the function will either return a new
container object, or throw an exception.

###### `payload` *(`Buffer`, required)*

The parameter `payload` must be a [buffer](https://nodejs.org/api/buffer.html).

The [SDMP specs](http://sdmp.io/spec/0.12/core/encrypted/#payload)
require the payload to be a valid container object, so you will likely
do something like:

	var container = { /* a valid container object */ }
	var payload = new Buffer(JSON.stringify(container), 'utf8')

###### `listOfNodeRsaPublicKeys` *(`array`, required)*

An array of [node-rsa](https://github.com/rzcoder/node-rsa)
equivalent object, each containing a public key of `2048` bytes.

E.g., maybe created like:

	var listOfNodeRsaPublicKeys = [
		new NodeRsa(pemEncodedKey1),
		new NodeRsa(pemEncodedKey2),
		new NodeRsa(pemEncodedKey3)
	]

## license

Published and released under the [Very Open License](http://veryopenlicense.com/).

<3
