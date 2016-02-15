function createZeroFilledBuffer(numberOfBytes) {
	var array = []
	for (var i = 0; i < numberOfBytes; i++) {
		array.push(0)
	}
	return new Buffer(array)
}

module.exports = function bufferToPaddedBlocks(buffer, blockSize) {
	var blockCount = Math.ceil(buffer.length / blockSize)
	var blocks = []
	for (var i = 0; i < blockCount; i++) {
		var block = buffer.slice(i * blockSize, (i + 1) * blockSize)
		if (block.length < blockSize) {
			var padding = createZeroFilledBuffer(blockSize - block.length)
			block = Buffer.concat([ block, padding])
		}
		blocks.push(block)
	}
	return blocks
}
