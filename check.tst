
handleChange(event) {
  var self = this;
  var reader = new FileReader();
  var file = event.target.files[0];
  var batch = 1024 * 1024 * 2;
  var start = 0;
  var total = file.size;
  var current = keccak256;
  reader.onload = function (event) {
    try {
      current = current.update(event.target.result);
      asyncUpdate();
    } catch(e) {
      console.log(e)
    }
  };
  var asyncUpdate = function () {
    if (start < total) {
      console.log('hashing...' + (start / total * 100).toFixed(2) + '%');
      var end = Math.min(start + batch, total);
      reader.readAsArrayBuffer(file.slice(start, end));
      start = end;
    } else {
      self.setState({value:current.hex()});
      console.log(self.state.value);
    }
  };
  asyncUpdate();
}
