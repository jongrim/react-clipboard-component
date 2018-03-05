'use strict';

const clipboard = jest.genMockFromModule('clipboard-polyfill');

const write = jest.fn().mockReturnValue(Promise.resolve());
const writeText = jest.fn().mockReturnValue(Promise.resolve());

function DT(dataType, data) {
  return {
    setData: function(dataType, data) {
      this.dataType = dataType;
      this.data = data;
    }
  };
}

clipboard.DT = DT;
clipboard.write = write;
clipboard.writeText = writeText;

module.exports = clipboard;
