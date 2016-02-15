var aesjs = require('aes-js')
var crypto = require('crypto')
var base64url = require('base64-url')

var padBufferBlocks = require('./buffer-to-padded-blocks.js')

module.exports = function createEncryptedContainer(payload, listOfNodeRsaPublicKeys) {
	if (!Array.isArray(listOfNodeRsaPublicKeys)) {
		throw 'must include list of node-rsa keys to encrypt to'
	}
	if (!Buffer.isBuffer(payload)) {
		throw 'payload must be a buffer'
	}

	var aesKey = crypto.randomBytes(32)

	var aesKeyEncryptedToRsaKeys = listOfNodeRsaPublicKeys.map(function(key) {
		if (!key.isPublic(true)) {
			throw 'each key must be public'
		}
		if (key.getKeySize() !== 2048) {
			throw 'key size must be `2048`'
		}
		return {
			key: base64url.escape(key.encrypt(aesKey, 'base64'))
		}
	})

	var initializationVector = crypto.randomBytes(16)

	var aesCbc = new aesjs.ModeOfOperation.cbc(aesKey, initializationVector)
	var encryptedPayloadBlocks = []
	padBufferBlocks(payload, initializationVector.length).map(function(paddedBlock) {
		return encryptedPayloadBlocks.push(aesCbc.encrypt(paddedBlock))
	})

	return {
		sdmp: {
			version: '0.13',
			schemas: [ 'encrypted' ]
		},
		encrypted: {
			iv: base64url.escape(initializationVector.toString('base64')),
			payload: base64url.escape(Buffer.concat(encryptedPayloadBlocks).toString('base64')),
			recipients: aesKeyEncryptedToRsaKeys
		}
	}
}
