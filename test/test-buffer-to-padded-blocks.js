var test = require('tape')
var bufferBlocks = require('../buffer-to-padded-blocks.js')

function bufferArray(buffer) {
	return JSON.stringify(buffer.toJSON().data)
}

test('padding is added', function(t) {
	var byteArray = [ 1, 2, 3, 4, 5, 6 ]
	var blockSize = 8
	var paddedBuffers = bufferBlocks(new Buffer(byteArray), blockSize)
	t.ok(Array.isArray(paddedBuffers), 'returns an array')
	t.equals(paddedBuffers.length, 1, 'there should only be one entry')
	t.ok(Buffer.isBuffer(paddedBuffers[0]), 'the entry should be a buffer')
	t.equals(paddedBuffers[0].length, blockSize, 'it should have been padded')
	t.equals(bufferArray(paddedBuffers[0]), '[1,2,3,4,5,6,0,0]', 'it should be zero padded')
	t.end()
})

test('buffer is split into blocks', function(t) {
	var byteArray = [ 1, 2, 3, 4, 5, 6 ]
	var blockSize = 4
	var paddedBuffers = bufferBlocks(new Buffer(byteArray), blockSize)
	t.ok(Array.isArray(paddedBuffers), 'returns an array')
	t.equals(paddedBuffers.length, 2, 'there should be two entries')
	t.ok(Buffer.isBuffer(paddedBuffers[0]), 'the first entry should be a buffer')
	t.ok(Buffer.isBuffer(paddedBuffers[1]), 'the second entry should be a buffer')
	t.equals(paddedBuffers[1].length, blockSize, 'the second block should have been padded')
	t.equals(bufferArray(paddedBuffers[0]), '[1,2,3,4]', 'the first block')
	t.equals(bufferArray(paddedBuffers[1]), '[5,6,0,0]', 'the second block')
	t.end()
})