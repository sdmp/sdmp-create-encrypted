var create = require('../')
var exampleKeys = require('sdmp-example-keys')
var test = require('tape')
var NodeRSA = require('node-rsa')

var aesjs = require('aes-js')
var base64url = require('base64-url')
var bufferBlocks = require('../buffer-to-padded-blocks.js')

test('create an encrypted container', function(t) {
	var message = 'notice that this module does *not* verify that the payload is an SDMP container, which is *required* by the specs'
	var payload = new Buffer(message, 'utf8')

	var publicKey = new NodeRSA(exampleKeys.publicKey)
	var privateKey = new NodeRSA(exampleKeys.privateKey)

	var container = create(payload, [ publicKey ])

	t.equals(container.encrypted.recipients.length, 1, 'there is only one public key used')

	// deserialize JSON serialized components
	var initializationVector = new Buffer(base64url.unescape(container.encrypted.iv), 'base64')
	var encryptedAesKey = new Buffer(base64url.unescape(container.encrypted.recipients[0].key), 'base64')
	var aesKey = privateKey.decrypt(encryptedAesKey)
	var payload = new Buffer(base64url.unescape(container.encrypted.payload), 'base64')

	// decrypt using AES-CBC directly
	var aesCbc = new aesjs.ModeOfOperation.cbc(aesKey, initializationVector)
	var decryptedBytes = Buffer.concat(bufferBlocks(payload, initializationVector.length).map(function(block) {
		return aesCbc.decrypt(block)
	}))

	// we need to strip the padding from the string
	var decryptedMessage = decryptedBytes.toString('utf8').replace(/\x00*$/, '')
	t.equals(decryptedMessage, message, 'these should be identical')

	t.end()
})

test('the payload must be a buffer', function(t) {
	var publicKey = new NodeRSA(exampleKeys.publicKey)
	var payload = 'fails because this is a string'
	t.throws(function() { create(payload, [ publicKey ]) })
	t.end()
})

test('must include the list of node-rsa public key objects', function(t) {
	var payload = new Buffer('some random message', 'utf8')
	t.throws(function() { create(payload) })
	t.end()
})

test('each element must be a valid node-rsa public key object', function(t) {
	var publicKey = new NodeRSA(exampleKeys.publicKey)
	var payload = new Buffer('some random message', 'utf8')
	t.throws(function() { create(payload, [ publicKey, {} ]) })
	t.end()
})
