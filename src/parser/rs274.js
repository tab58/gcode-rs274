(function() {
  'use strict';

  var extend = function(destination, source) {
    if (!destination || !source) return destination;
    for (var key in source) {
      if (destination[key] !== source[key])
        destination[key] = source[key];
    }
    return destination;
  };

  var formatError = function(input, offset, expected) {
    var lines = input.split(/\n/g),
        lineNo = 0,
        position = 0;

    while (position <= offset) {
      position += lines[lineNo].length + 1;
      lineNo += 1;
    }
    var message = 'Line ' + lineNo + ': expected ' + expected.join(', ') + '\n',
        line = lines[lineNo - 1];

    message += line + '\n';
    position -= line.length + 1;

    while (position < offset) {
      message += ' ';
      position += 1;
    }
    return message + '^';
  };

  var inherit = function(subclass, parent) {
    var chain = function() {};
    chain.prototype = parent.prototype;
    subclass.prototype = new chain();
    subclass.prototype.constructor = subclass;
  };

  var TreeNode = function(text, offset, elements) {
    this.text = text;
    this.offset = offset;
    this.elements = elements || [];
  };

  TreeNode.prototype.forEach = function(block, context) {
    for (var el = this.elements, i = 0, n = el.length; i < n; i++) {
      block.call(context, el[i], i, el);
    }
  };

  var TreeNode1 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['digit'] = elements[1];
  };
  inherit(TreeNode1, TreeNode);

  var TreeNode2 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['mid_line_letter'] = elements[0];
    this['real_value'] = elements[1];
  };
  inherit(TreeNode2, TreeNode);

  var TreeNode3 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['digit'] = elements[0];
  };
  inherit(TreeNode3, TreeNode);

  var TreeNode4 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['digit'] = elements[1];
  };
  inherit(TreeNode4, TreeNode);

  var TreeNode5 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['real_value'] = elements[1];
  };
  inherit(TreeNode5, TreeNode);

  var TreeNode6 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['ordinary_unary_operation'] = elements[0];
    this['expression'] = elements[1];
  };
  inherit(TreeNode6, TreeNode);

  var TreeNode7 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['expression'] = elements[3];
  };
  inherit(TreeNode7, TreeNode);

  var TreeNode8 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['real_value'] = elements[1];
  };
  inherit(TreeNode8, TreeNode);

  var TreeNode9 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['real_value'] = elements[3];
  };
  inherit(TreeNode9, TreeNode);

  var TreeNode10 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['real_value'] = elements[1];
  };
  inherit(TreeNode10, TreeNode);

  var TreeNode11 = function(text, offset, elements) {
    TreeNode.apply(this, arguments);
    this['comma'] = elements[8];
  };
  inherit(TreeNode11, TreeNode);

  var FAILURE = {};

  var Grammar = {
    _read_line: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._line = this._cache._line || {};
      var cached = this._cache._line[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(4);
      var address1 = FAILURE;
      var index2 = this._offset;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 1);
      }
      if (chunk0 === '/') {
        address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
        this._offset = this._offset + 1;
      } else {
        address1 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('"/"');
        }
      }
      if (address1 === FAILURE) {
        address1 = new TreeNode(this._input.substring(index2, index2), index2);
        this._offset = index2;
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        var index3 = this._offset;
        address2 = this._read_line_number();
        if (address2 === FAILURE) {
          address2 = new TreeNode(this._input.substring(index3, index3), index3);
          this._offset = index3;
        }
        if (address2 !== FAILURE) {
          elements0[1] = address2;
          var address3 = FAILURE;
          var remaining0 = 0, index4 = this._offset, elements1 = [], address4 = true;
          while (address4 !== FAILURE) {
            address4 = this._read_segment();
            if (address4 !== FAILURE) {
              elements1.push(address4);
              --remaining0;
            }
          }
          if (remaining0 <= 0) {
            address3 = new TreeNode(this._input.substring(index4, this._offset), index4, elements1);
            this._offset = this._offset;
          } else {
            address3 = FAILURE;
          }
          if (address3 !== FAILURE) {
            elements0[2] = address3;
            var address5 = FAILURE;
            var index5 = this._offset;
            var chunk1 = null;
            if (this._offset < this._inputSize) {
              chunk1 = this._input.substring(this._offset, this._offset + 1);
            }
            if (chunk1 !== null && /^[\n]/.test(chunk1)) {
              address5 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
              this._offset = this._offset + 1;
            } else {
              address5 = FAILURE;
              if (this._offset > this._failure) {
                this._failure = this._offset;
                this._expected = [];
              }
              if (this._offset === this._failure) {
                this._expected.push('[\\n]');
              }
            }
            if (address5 === FAILURE) {
              address5 = new TreeNode(this._input.substring(index5, index5), index5);
              this._offset = index5;
            }
            if (address5 !== FAILURE) {
              elements0[3] = address5;
            } else {
              elements0 = null;
              this._offset = index1;
            }
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = this._actions.makeLine(this._input, index1, this._offset, elements0);
        this._offset = this._offset;
      }
      this._cache._line[index0] = [address0, this._offset];
      return address0;
    },

    _read_line_number: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._line_number = this._cache._line_number || {};
      var cached = this._cache._line_number[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(6);
      var address1 = FAILURE;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 1);
      }
      if (chunk0 !== null && /^[Nn]/.test(chunk0)) {
        address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
        this._offset = this._offset + 1;
      } else {
        address1 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('[Nn]');
        }
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        address2 = this._read_digit();
        if (address2 !== FAILURE) {
          elements0[1] = address2;
          var address3 = FAILURE;
          var index2 = this._offset;
          address3 = this._read_digit();
          if (address3 === FAILURE) {
            address3 = new TreeNode(this._input.substring(index2, index2), index2);
            this._offset = index2;
          }
          if (address3 !== FAILURE) {
            elements0[2] = address3;
            var address4 = FAILURE;
            var index3 = this._offset;
            address4 = this._read_digit();
            if (address4 === FAILURE) {
              address4 = new TreeNode(this._input.substring(index3, index3), index3);
              this._offset = index3;
            }
            if (address4 !== FAILURE) {
              elements0[3] = address4;
              var address5 = FAILURE;
              var index4 = this._offset;
              address5 = this._read_digit();
              if (address5 === FAILURE) {
                address5 = new TreeNode(this._input.substring(index4, index4), index4);
                this._offset = index4;
              }
              if (address5 !== FAILURE) {
                elements0[4] = address5;
                var address6 = FAILURE;
                var index5 = this._offset;
                address6 = this._read_digit();
                if (address6 === FAILURE) {
                  address6 = new TreeNode(this._input.substring(index5, index5), index5);
                  this._offset = index5;
                }
                if (address6 !== FAILURE) {
                  elements0[5] = address6;
                } else {
                  elements0 = null;
                  this._offset = index1;
                }
              } else {
                elements0 = null;
                this._offset = index1;
              }
            } else {
              elements0 = null;
              this._offset = index1;
            }
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = this._actions.makeLineNumber(this._input, index1, this._offset, elements0);
        this._offset = this._offset;
      }
      this._cache._line_number[index0] = [address0, this._offset];
      return address0;
    },

    _read_digit: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._digit = this._cache._digit || {};
      var cached = this._cache._digit[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 1);
      }
      if (chunk0 !== null && /^[0-9]/.test(chunk0)) {
        address0 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
        this._offset = this._offset + 1;
      } else {
        address0 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('[0-9]');
        }
      }
      this._cache._digit[index0] = [address0, this._offset];
      return address0;
    },

    _read_segment: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._segment = this._cache._segment || {};
      var cached = this._cache._segment[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset;
      address0 = this._read_mid_line_word();
      if (address0 === FAILURE) {
        this._offset = index1;
        address0 = this._read_comment();
        if (address0 === FAILURE) {
          this._offset = index1;
          address0 = this._read_parameter_setting();
          if (address0 === FAILURE) {
            this._offset = index1;
          }
        }
      }
      this._cache._segment[index0] = [address0, this._offset];
      return address0;
    },

    _read_mid_line_word: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._mid_line_word = this._cache._mid_line_word || {};
      var cached = this._cache._mid_line_word[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(2);
      var address1 = FAILURE;
      address1 = this._read_mid_line_letter();
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        address2 = this._read_real_value();
        if (address2 !== FAILURE) {
          elements0[1] = address2;
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = this._actions.makeMidLineWord(this._input, index1, this._offset, elements0);
        this._offset = this._offset;
      }
      this._cache._mid_line_word[index0] = [address0, this._offset];
      return address0;
    },

    _read_real_value: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._real_value = this._cache._real_value || {};
      var cached = this._cache._real_value[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset;
      address0 = this._read_real_number();
      if (address0 === FAILURE) {
        this._offset = index1;
        address0 = this._read_expression();
        if (address0 === FAILURE) {
          this._offset = index1;
          address0 = this._read_parameter_value();
          if (address0 === FAILURE) {
            this._offset = index1;
            address0 = this._read_unary_combo();
            if (address0 === FAILURE) {
              this._offset = index1;
            }
          }
        }
      }
      this._cache._real_value[index0] = [address0, this._offset];
      return address0;
    },

    _read_real_number: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._real_number = this._cache._real_number || {};
      var cached = this._cache._real_number[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(2);
      var address1 = FAILURE;
      var index2 = this._offset;
      var index3 = this._offset;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 1);
      }
      if (chunk0 === '+') {
        address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
        this._offset = this._offset + 1;
      } else {
        address1 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('"+"');
        }
      }
      if (address1 === FAILURE) {
        this._offset = index3;
        var chunk1 = null;
        if (this._offset < this._inputSize) {
          chunk1 = this._input.substring(this._offset, this._offset + 1);
        }
        if (chunk1 === '-') {
          address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
          this._offset = this._offset + 1;
        } else {
          address1 = FAILURE;
          if (this._offset > this._failure) {
            this._failure = this._offset;
            this._expected = [];
          }
          if (this._offset === this._failure) {
            this._expected.push('"-"');
          }
        }
        if (address1 === FAILURE) {
          this._offset = index3;
        }
      }
      if (address1 === FAILURE) {
        address1 = new TreeNode(this._input.substring(index2, index2), index2);
        this._offset = index2;
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        var index4 = this._offset;
        var index5 = this._offset, elements1 = new Array(4);
        var address3 = FAILURE;
        address3 = this._read_digit();
        if (address3 !== FAILURE) {
          elements1[0] = address3;
          var address4 = FAILURE;
          var remaining0 = 0, index6 = this._offset, elements2 = [], address5 = true;
          while (address5 !== FAILURE) {
            address5 = this._read_digit();
            if (address5 !== FAILURE) {
              elements2.push(address5);
              --remaining0;
            }
          }
          if (remaining0 <= 0) {
            address4 = new TreeNode(this._input.substring(index6, this._offset), index6, elements2);
            this._offset = this._offset;
          } else {
            address4 = FAILURE;
          }
          if (address4 !== FAILURE) {
            elements1[1] = address4;
            var address6 = FAILURE;
            var index7 = this._offset;
            var chunk2 = null;
            if (this._offset < this._inputSize) {
              chunk2 = this._input.substring(this._offset, this._offset + 1);
            }
            if (chunk2 === '.') {
              address6 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
              this._offset = this._offset + 1;
            } else {
              address6 = FAILURE;
              if (this._offset > this._failure) {
                this._failure = this._offset;
                this._expected = [];
              }
              if (this._offset === this._failure) {
                this._expected.push('"."');
              }
            }
            if (address6 === FAILURE) {
              address6 = new TreeNode(this._input.substring(index7, index7), index7);
              this._offset = index7;
            }
            if (address6 !== FAILURE) {
              elements1[2] = address6;
              var address7 = FAILURE;
              var remaining1 = 0, index8 = this._offset, elements3 = [], address8 = true;
              while (address8 !== FAILURE) {
                address8 = this._read_digit();
                if (address8 !== FAILURE) {
                  elements3.push(address8);
                  --remaining1;
                }
              }
              if (remaining1 <= 0) {
                address7 = new TreeNode(this._input.substring(index8, this._offset), index8, elements3);
                this._offset = this._offset;
              } else {
                address7 = FAILURE;
              }
              if (address7 !== FAILURE) {
                elements1[3] = address7;
              } else {
                elements1 = null;
                this._offset = index5;
              }
            } else {
              elements1 = null;
              this._offset = index5;
            }
          } else {
            elements1 = null;
            this._offset = index5;
          }
        } else {
          elements1 = null;
          this._offset = index5;
        }
        if (elements1 === null) {
          address2 = FAILURE;
        } else {
          address2 = new TreeNode3(this._input.substring(index5, this._offset), index5, elements1);
          this._offset = this._offset;
        }
        if (address2 === FAILURE) {
          this._offset = index4;
          var index9 = this._offset, elements4 = new Array(3);
          var address9 = FAILURE;
          var chunk3 = null;
          if (this._offset < this._inputSize) {
            chunk3 = this._input.substring(this._offset, this._offset + 1);
          }
          if (chunk3 === '.') {
            address9 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
            this._offset = this._offset + 1;
          } else {
            address9 = FAILURE;
            if (this._offset > this._failure) {
              this._failure = this._offset;
              this._expected = [];
            }
            if (this._offset === this._failure) {
              this._expected.push('"."');
            }
          }
          if (address9 !== FAILURE) {
            elements4[0] = address9;
            var address10 = FAILURE;
            address10 = this._read_digit();
            if (address10 !== FAILURE) {
              elements4[1] = address10;
              var address11 = FAILURE;
              var remaining2 = 0, index10 = this._offset, elements5 = [], address12 = true;
              while (address12 !== FAILURE) {
                address12 = this._read_digit();
                if (address12 !== FAILURE) {
                  elements5.push(address12);
                  --remaining2;
                }
              }
              if (remaining2 <= 0) {
                address11 = new TreeNode(this._input.substring(index10, this._offset), index10, elements5);
                this._offset = this._offset;
              } else {
                address11 = FAILURE;
              }
              if (address11 !== FAILURE) {
                elements4[2] = address11;
              } else {
                elements4 = null;
                this._offset = index9;
              }
            } else {
              elements4 = null;
              this._offset = index9;
            }
          } else {
            elements4 = null;
            this._offset = index9;
          }
          if (elements4 === null) {
            address2 = FAILURE;
          } else {
            address2 = new TreeNode4(this._input.substring(index9, this._offset), index9, elements4);
            this._offset = this._offset;
          }
          if (address2 === FAILURE) {
            this._offset = index4;
          }
        }
        if (address2 !== FAILURE) {
          elements0[1] = address2;
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = this._actions.makeRealNumber(this._input, index1, this._offset, elements0);
        this._offset = this._offset;
      }
      this._cache._real_number[index0] = [address0, this._offset];
      return address0;
    },

    _read_parameter_value: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._parameter_value = this._cache._parameter_value || {};
      var cached = this._cache._parameter_value[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(2);
      var address1 = FAILURE;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 1);
      }
      if (chunk0 === '#') {
        address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
        this._offset = this._offset + 1;
      } else {
        address1 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('"#"');
        }
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        address2 = this._read_real_value();
        if (address2 !== FAILURE) {
          elements0[1] = address2;
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = this._actions.makeGetParameterValue(this._input, index1, this._offset, elements0);
        this._offset = this._offset;
      }
      this._cache._parameter_value[index0] = [address0, this._offset];
      return address0;
    },

    _read_unary_combo: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._unary_combo = this._cache._unary_combo || {};
      var cached = this._cache._unary_combo[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset;
      address0 = this._read_ordinary_unary_combo();
      if (address0 === FAILURE) {
        this._offset = index1;
        address0 = this._read_arc_tangent_combo();
        if (address0 === FAILURE) {
          this._offset = index1;
        }
      }
      this._cache._unary_combo[index0] = [address0, this._offset];
      return address0;
    },

    _read_ordinary_unary_combo: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._ordinary_unary_combo = this._cache._ordinary_unary_combo || {};
      var cached = this._cache._ordinary_unary_combo[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(2);
      var address1 = FAILURE;
      address1 = this._read_ordinary_unary_operation();
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        address2 = this._read_expression();
        if (address2 !== FAILURE) {
          elements0[1] = address2;
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = this._actions.makeOrdinaryUnaryCombo(this._input, index1, this._offset, elements0);
        this._offset = this._offset;
      }
      this._cache._ordinary_unary_combo[index0] = [address0, this._offset];
      return address0;
    },

    _read_arc_tangent_combo: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._arc_tangent_combo = this._cache._arc_tangent_combo || {};
      var cached = this._cache._arc_tangent_combo[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(4);
      var address1 = FAILURE;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 4);
      }
      if (chunk0 === 'atan') {
        address1 = new TreeNode(this._input.substring(this._offset, this._offset + 4), this._offset);
        this._offset = this._offset + 4;
      } else {
        address1 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('"atan"');
        }
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        address2 = this._read_expression();
        if (address2 !== FAILURE) {
          elements0[1] = address2;
          var address3 = FAILURE;
          var chunk1 = null;
          if (this._offset < this._inputSize) {
            chunk1 = this._input.substring(this._offset, this._offset + 1);
          }
          if (chunk1 === '/') {
            address3 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
            this._offset = this._offset + 1;
          } else {
            address3 = FAILURE;
            if (this._offset > this._failure) {
              this._failure = this._offset;
              this._expected = [];
            }
            if (this._offset === this._failure) {
              this._expected.push('"/"');
            }
          }
          if (address3 !== FAILURE) {
            elements0[2] = address3;
            var address4 = FAILURE;
            address4 = this._read_expression();
            if (address4 !== FAILURE) {
              elements0[3] = address4;
            } else {
              elements0 = null;
              this._offset = index1;
            }
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = this._actions.makeArcTangentCombo(this._input, index1, this._offset, elements0);
        this._offset = this._offset;
      }
      this._cache._arc_tangent_combo[index0] = [address0, this._offset];
      return address0;
    },

    _read_expression: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._expression = this._cache._expression || {};
      var cached = this._cache._expression[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(4);
      var address1 = FAILURE;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 1);
      }
      if (chunk0 === '[') {
        address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
        this._offset = this._offset + 1;
      } else {
        address1 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('"["');
        }
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        address2 = this._read_real_value();
        if (address2 !== FAILURE) {
          elements0[1] = address2;
          var address3 = FAILURE;
          var remaining0 = 0, index2 = this._offset, elements1 = [], address4 = true;
          while (address4 !== FAILURE) {
            address4 = this._read_binary_operation_combo();
            if (address4 !== FAILURE) {
              elements1.push(address4);
              --remaining0;
            }
          }
          if (remaining0 <= 0) {
            address3 = new TreeNode(this._input.substring(index2, this._offset), index2, elements1);
            this._offset = this._offset;
          } else {
            address3 = FAILURE;
          }
          if (address3 !== FAILURE) {
            elements0[2] = address3;
            var address5 = FAILURE;
            var chunk1 = null;
            if (this._offset < this._inputSize) {
              chunk1 = this._input.substring(this._offset, this._offset + 1);
            }
            if (chunk1 === ']') {
              address5 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
              this._offset = this._offset + 1;
            } else {
              address5 = FAILURE;
              if (this._offset > this._failure) {
                this._failure = this._offset;
                this._expected = [];
              }
              if (this._offset === this._failure) {
                this._expected.push('"]"');
              }
            }
            if (address5 !== FAILURE) {
              elements0[3] = address5;
            } else {
              elements0 = null;
              this._offset = index1;
            }
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = this._actions.makeExpression(this._input, index1, this._offset, elements0);
        this._offset = this._offset;
      }
      this._cache._expression[index0] = [address0, this._offset];
      return address0;
    },

    _read_parameter_setting: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._parameter_setting = this._cache._parameter_setting || {};
      var cached = this._cache._parameter_setting[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(4);
      var address1 = FAILURE;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 1);
      }
      if (chunk0 === '#') {
        address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
        this._offset = this._offset + 1;
      } else {
        address1 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('"#"');
        }
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        address2 = this._read_real_value();
        if (address2 !== FAILURE) {
          elements0[1] = address2;
          var address3 = FAILURE;
          var chunk1 = null;
          if (this._offset < this._inputSize) {
            chunk1 = this._input.substring(this._offset, this._offset + 1);
          }
          if (chunk1 === '=') {
            address3 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
            this._offset = this._offset + 1;
          } else {
            address3 = FAILURE;
            if (this._offset > this._failure) {
              this._failure = this._offset;
              this._expected = [];
            }
            if (this._offset === this._failure) {
              this._expected.push('"="');
            }
          }
          if (address3 !== FAILURE) {
            elements0[2] = address3;
            var address4 = FAILURE;
            address4 = this._read_real_value();
            if (address4 !== FAILURE) {
              elements0[3] = address4;
            } else {
              elements0 = null;
              this._offset = index1;
            }
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = this._actions.makeSetParameterValue(this._input, index1, this._offset, elements0);
        this._offset = this._offset;
      }
      this._cache._parameter_setting[index0] = [address0, this._offset];
      return address0;
    },

    _read_binary_operation_combo: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._binary_operation_combo = this._cache._binary_operation_combo || {};
      var cached = this._cache._binary_operation_combo[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(2);
      var address1 = FAILURE;
      var index2 = this._offset;
      address1 = this._read_binary_operation1();
      if (address1 === FAILURE) {
        this._offset = index2;
        address1 = this._read_binary_operation2();
        if (address1 === FAILURE) {
          this._offset = index2;
          address1 = this._read_binary_operation3();
          if (address1 === FAILURE) {
            this._offset = index2;
          }
        }
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        address2 = this._read_real_value();
        if (address2 !== FAILURE) {
          elements0[1] = address2;
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = this._actions.makeBinaryOperationCombo(this._input, index1, this._offset, elements0);
        this._offset = this._offset;
      }
      this._cache._binary_operation_combo[index0] = [address0, this._offset];
      return address0;
    },

    _read_comment: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._comment = this._cache._comment || {};
      var cached = this._cache._comment[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset;
      address0 = this._read_message();
      if (address0 === FAILURE) {
        this._offset = index1;
        address0 = this._read_ordinary_comment();
        if (address0 === FAILURE) {
          this._offset = index1;
        }
      }
      this._cache._comment[index0] = [address0, this._offset];
      return address0;
    },

    _read_ordinary_comment: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._ordinary_comment = this._cache._ordinary_comment || {};
      var cached = this._cache._ordinary_comment[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(3);
      var address1 = FAILURE;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 1);
      }
      if (chunk0 === '(') {
        address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
        this._offset = this._offset + 1;
      } else {
        address1 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('"("');
        }
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        var remaining0 = 0, index2 = this._offset, elements1 = [], address3 = true;
        while (address3 !== FAILURE) {
          address3 = this._read_comment_character();
          if (address3 !== FAILURE) {
            elements1.push(address3);
            --remaining0;
          }
        }
        if (remaining0 <= 0) {
          address2 = new TreeNode(this._input.substring(index2, this._offset), index2, elements1);
          this._offset = this._offset;
        } else {
          address2 = FAILURE;
        }
        if (address2 !== FAILURE) {
          elements0[1] = address2;
          var address4 = FAILURE;
          var chunk1 = null;
          if (this._offset < this._inputSize) {
            chunk1 = this._input.substring(this._offset, this._offset + 1);
          }
          if (chunk1 === ')') {
            address4 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
            this._offset = this._offset + 1;
          } else {
            address4 = FAILURE;
            if (this._offset > this._failure) {
              this._failure = this._offset;
              this._expected = [];
            }
            if (this._offset === this._failure) {
              this._expected.push('")"');
            }
          }
          if (address4 !== FAILURE) {
            elements0[2] = address4;
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = this._actions.makeComment(this._input, index1, this._offset, elements0);
        this._offset = this._offset;
      }
      this._cache._ordinary_comment[index0] = [address0, this._offset];
      return address0;
    },

    _read_message: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._message = this._cache._message || {};
      var cached = this._cache._message[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset, elements0 = new Array(11);
      var address1 = FAILURE;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 1);
      }
      if (chunk0 === '(') {
        address1 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
        this._offset = this._offset + 1;
      } else {
        address1 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('"("');
        }
      }
      if (address1 !== FAILURE) {
        elements0[0] = address1;
        var address2 = FAILURE;
        var remaining0 = 0, index2 = this._offset, elements1 = [], address3 = true;
        while (address3 !== FAILURE) {
          address3 = this._read_white_space();
          if (address3 !== FAILURE) {
            elements1.push(address3);
            --remaining0;
          }
        }
        if (remaining0 <= 0) {
          address2 = new TreeNode(this._input.substring(index2, this._offset), index2, elements1);
          this._offset = this._offset;
        } else {
          address2 = FAILURE;
        }
        if (address2 !== FAILURE) {
          elements0[1] = address2;
          var address4 = FAILURE;
          var chunk1 = null;
          if (this._offset < this._inputSize) {
            chunk1 = this._input.substring(this._offset, this._offset + 1);
          }
          if (chunk1 !== null && /^[Mm]/.test(chunk1)) {
            address4 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
            this._offset = this._offset + 1;
          } else {
            address4 = FAILURE;
            if (this._offset > this._failure) {
              this._failure = this._offset;
              this._expected = [];
            }
            if (this._offset === this._failure) {
              this._expected.push('[Mm]');
            }
          }
          if (address4 !== FAILURE) {
            elements0[2] = address4;
            var address5 = FAILURE;
            var remaining1 = 0, index3 = this._offset, elements2 = [], address6 = true;
            while (address6 !== FAILURE) {
              address6 = this._read_white_space();
              if (address6 !== FAILURE) {
                elements2.push(address6);
                --remaining1;
              }
            }
            if (remaining1 <= 0) {
              address5 = new TreeNode(this._input.substring(index3, this._offset), index3, elements2);
              this._offset = this._offset;
            } else {
              address5 = FAILURE;
            }
            if (address5 !== FAILURE) {
              elements0[3] = address5;
              var address7 = FAILURE;
              var chunk2 = null;
              if (this._offset < this._inputSize) {
                chunk2 = this._input.substring(this._offset, this._offset + 1);
              }
              if (chunk2 !== null && /^[Ss]/.test(chunk2)) {
                address7 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                this._offset = this._offset + 1;
              } else {
                address7 = FAILURE;
                if (this._offset > this._failure) {
                  this._failure = this._offset;
                  this._expected = [];
                }
                if (this._offset === this._failure) {
                  this._expected.push('[Ss]');
                }
              }
              if (address7 !== FAILURE) {
                elements0[4] = address7;
                var address8 = FAILURE;
                var remaining2 = 0, index4 = this._offset, elements3 = [], address9 = true;
                while (address9 !== FAILURE) {
                  address9 = this._read_white_space();
                  if (address9 !== FAILURE) {
                    elements3.push(address9);
                    --remaining2;
                  }
                }
                if (remaining2 <= 0) {
                  address8 = new TreeNode(this._input.substring(index4, this._offset), index4, elements3);
                  this._offset = this._offset;
                } else {
                  address8 = FAILURE;
                }
                if (address8 !== FAILURE) {
                  elements0[5] = address8;
                  var address10 = FAILURE;
                  var chunk3 = null;
                  if (this._offset < this._inputSize) {
                    chunk3 = this._input.substring(this._offset, this._offset + 1);
                  }
                  if (chunk3 !== null && /^[Gg]/.test(chunk3)) {
                    address10 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                    this._offset = this._offset + 1;
                  } else {
                    address10 = FAILURE;
                    if (this._offset > this._failure) {
                      this._failure = this._offset;
                      this._expected = [];
                    }
                    if (this._offset === this._failure) {
                      this._expected.push('[Gg]');
                    }
                  }
                  if (address10 !== FAILURE) {
                    elements0[6] = address10;
                    var address11 = FAILURE;
                    var remaining3 = 0, index5 = this._offset, elements4 = [], address12 = true;
                    while (address12 !== FAILURE) {
                      address12 = this._read_white_space();
                      if (address12 !== FAILURE) {
                        elements4.push(address12);
                        --remaining3;
                      }
                    }
                    if (remaining3 <= 0) {
                      address11 = new TreeNode(this._input.substring(index5, this._offset), index5, elements4);
                      this._offset = this._offset;
                    } else {
                      address11 = FAILURE;
                    }
                    if (address11 !== FAILURE) {
                      elements0[7] = address11;
                      var address13 = FAILURE;
                      address13 = this._read_comma();
                      if (address13 !== FAILURE) {
                        elements0[8] = address13;
                        var address14 = FAILURE;
                        var remaining4 = 0, index6 = this._offset, elements5 = [], address15 = true;
                        while (address15 !== FAILURE) {
                          address15 = this._read_comment_character();
                          if (address15 !== FAILURE) {
                            elements5.push(address15);
                            --remaining4;
                          }
                        }
                        if (remaining4 <= 0) {
                          address14 = new TreeNode(this._input.substring(index6, this._offset), index6, elements5);
                          this._offset = this._offset;
                        } else {
                          address14 = FAILURE;
                        }
                        if (address14 !== FAILURE) {
                          elements0[9] = address14;
                          var address16 = FAILURE;
                          var chunk4 = null;
                          if (this._offset < this._inputSize) {
                            chunk4 = this._input.substring(this._offset, this._offset + 1);
                          }
                          if (chunk4 === ')') {
                            address16 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
                            this._offset = this._offset + 1;
                          } else {
                            address16 = FAILURE;
                            if (this._offset > this._failure) {
                              this._failure = this._offset;
                              this._expected = [];
                            }
                            if (this._offset === this._failure) {
                              this._expected.push('")"');
                            }
                          }
                          if (address16 !== FAILURE) {
                            elements0[10] = address16;
                          } else {
                            elements0 = null;
                            this._offset = index1;
                          }
                        } else {
                          elements0 = null;
                          this._offset = index1;
                        }
                      } else {
                        elements0 = null;
                        this._offset = index1;
                      }
                    } else {
                      elements0 = null;
                      this._offset = index1;
                    }
                  } else {
                    elements0 = null;
                    this._offset = index1;
                  }
                } else {
                  elements0 = null;
                  this._offset = index1;
                }
              } else {
                elements0 = null;
                this._offset = index1;
              }
            } else {
              elements0 = null;
              this._offset = index1;
            }
          } else {
            elements0 = null;
            this._offset = index1;
          }
        } else {
          elements0 = null;
          this._offset = index1;
        }
      } else {
        elements0 = null;
        this._offset = index1;
      }
      if (elements0 === null) {
        address0 = FAILURE;
      } else {
        address0 = this._actions.makeMessage(this._input, index1, this._offset, elements0);
        this._offset = this._offset;
      }
      this._cache._message[index0] = [address0, this._offset];
      return address0;
    },

    _read_ordinary_unary_operation: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._ordinary_unary_operation = this._cache._ordinary_unary_operation || {};
      var cached = this._cache._ordinary_unary_operation[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 3);
      }
      if (chunk0 === 'abs') {
        address0 = new TreeNode(this._input.substring(this._offset, this._offset + 3), this._offset);
        this._offset = this._offset + 3;
      } else {
        address0 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('"abs"');
        }
      }
      if (address0 === FAILURE) {
        this._offset = index1;
        var chunk1 = null;
        if (this._offset < this._inputSize) {
          chunk1 = this._input.substring(this._offset, this._offset + 3);
        }
        if (chunk1 === 'ABS') {
          address0 = new TreeNode(this._input.substring(this._offset, this._offset + 3), this._offset);
          this._offset = this._offset + 3;
        } else {
          address0 = FAILURE;
          if (this._offset > this._failure) {
            this._failure = this._offset;
            this._expected = [];
          }
          if (this._offset === this._failure) {
            this._expected.push('"ABS"');
          }
        }
        if (address0 === FAILURE) {
          this._offset = index1;
          var chunk2 = null;
          if (this._offset < this._inputSize) {
            chunk2 = this._input.substring(this._offset, this._offset + 4);
          }
          if (chunk2 === 'acos') {
            address0 = new TreeNode(this._input.substring(this._offset, this._offset + 4), this._offset);
            this._offset = this._offset + 4;
          } else {
            address0 = FAILURE;
            if (this._offset > this._failure) {
              this._failure = this._offset;
              this._expected = [];
            }
            if (this._offset === this._failure) {
              this._expected.push('"acos"');
            }
          }
          if (address0 === FAILURE) {
            this._offset = index1;
            var chunk3 = null;
            if (this._offset < this._inputSize) {
              chunk3 = this._input.substring(this._offset, this._offset + 4);
            }
            if (chunk3 === 'ACOS') {
              address0 = new TreeNode(this._input.substring(this._offset, this._offset + 4), this._offset);
              this._offset = this._offset + 4;
            } else {
              address0 = FAILURE;
              if (this._offset > this._failure) {
                this._failure = this._offset;
                this._expected = [];
              }
              if (this._offset === this._failure) {
                this._expected.push('"ACOS"');
              }
            }
            if (address0 === FAILURE) {
              this._offset = index1;
              var chunk4 = null;
              if (this._offset < this._inputSize) {
                chunk4 = this._input.substring(this._offset, this._offset + 4);
              }
              if (chunk4 === 'asin') {
                address0 = new TreeNode(this._input.substring(this._offset, this._offset + 4), this._offset);
                this._offset = this._offset + 4;
              } else {
                address0 = FAILURE;
                if (this._offset > this._failure) {
                  this._failure = this._offset;
                  this._expected = [];
                }
                if (this._offset === this._failure) {
                  this._expected.push('"asin"');
                }
              }
              if (address0 === FAILURE) {
                this._offset = index1;
                var chunk5 = null;
                if (this._offset < this._inputSize) {
                  chunk5 = this._input.substring(this._offset, this._offset + 4);
                }
                if (chunk5 === 'ASIN') {
                  address0 = new TreeNode(this._input.substring(this._offset, this._offset + 4), this._offset);
                  this._offset = this._offset + 4;
                } else {
                  address0 = FAILURE;
                  if (this._offset > this._failure) {
                    this._failure = this._offset;
                    this._expected = [];
                  }
                  if (this._offset === this._failure) {
                    this._expected.push('"ASIN"');
                  }
                }
                if (address0 === FAILURE) {
                  this._offset = index1;
                  var chunk6 = null;
                  if (this._offset < this._inputSize) {
                    chunk6 = this._input.substring(this._offset, this._offset + 3);
                  }
                  if (chunk6 === 'cos') {
                    address0 = new TreeNode(this._input.substring(this._offset, this._offset + 3), this._offset);
                    this._offset = this._offset + 3;
                  } else {
                    address0 = FAILURE;
                    if (this._offset > this._failure) {
                      this._failure = this._offset;
                      this._expected = [];
                    }
                    if (this._offset === this._failure) {
                      this._expected.push('"cos"');
                    }
                  }
                  if (address0 === FAILURE) {
                    this._offset = index1;
                    var chunk7 = null;
                    if (this._offset < this._inputSize) {
                      chunk7 = this._input.substring(this._offset, this._offset + 3);
                    }
                    if (chunk7 === 'COS') {
                      address0 = new TreeNode(this._input.substring(this._offset, this._offset + 3), this._offset);
                      this._offset = this._offset + 3;
                    } else {
                      address0 = FAILURE;
                      if (this._offset > this._failure) {
                        this._failure = this._offset;
                        this._expected = [];
                      }
                      if (this._offset === this._failure) {
                        this._expected.push('"COS"');
                      }
                    }
                    if (address0 === FAILURE) {
                      this._offset = index1;
                      var chunk8 = null;
                      if (this._offset < this._inputSize) {
                        chunk8 = this._input.substring(this._offset, this._offset + 3);
                      }
                      if (chunk8 === 'exp') {
                        address0 = new TreeNode(this._input.substring(this._offset, this._offset + 3), this._offset);
                        this._offset = this._offset + 3;
                      } else {
                        address0 = FAILURE;
                        if (this._offset > this._failure) {
                          this._failure = this._offset;
                          this._expected = [];
                        }
                        if (this._offset === this._failure) {
                          this._expected.push('"exp"');
                        }
                      }
                      if (address0 === FAILURE) {
                        this._offset = index1;
                        var chunk9 = null;
                        if (this._offset < this._inputSize) {
                          chunk9 = this._input.substring(this._offset, this._offset + 3);
                        }
                        if (chunk9 === 'EXP') {
                          address0 = new TreeNode(this._input.substring(this._offset, this._offset + 3), this._offset);
                          this._offset = this._offset + 3;
                        } else {
                          address0 = FAILURE;
                          if (this._offset > this._failure) {
                            this._failure = this._offset;
                            this._expected = [];
                          }
                          if (this._offset === this._failure) {
                            this._expected.push('"EXP"');
                          }
                        }
                        if (address0 === FAILURE) {
                          this._offset = index1;
                          var chunk10 = null;
                          if (this._offset < this._inputSize) {
                            chunk10 = this._input.substring(this._offset, this._offset + 3);
                          }
                          if (chunk10 === 'fix') {
                            address0 = new TreeNode(this._input.substring(this._offset, this._offset + 3), this._offset);
                            this._offset = this._offset + 3;
                          } else {
                            address0 = FAILURE;
                            if (this._offset > this._failure) {
                              this._failure = this._offset;
                              this._expected = [];
                            }
                            if (this._offset === this._failure) {
                              this._expected.push('"fix"');
                            }
                          }
                          if (address0 === FAILURE) {
                            this._offset = index1;
                            var chunk11 = null;
                            if (this._offset < this._inputSize) {
                              chunk11 = this._input.substring(this._offset, this._offset + 3);
                            }
                            if (chunk11 === 'FIX') {
                              address0 = new TreeNode(this._input.substring(this._offset, this._offset + 3), this._offset);
                              this._offset = this._offset + 3;
                            } else {
                              address0 = FAILURE;
                              if (this._offset > this._failure) {
                                this._failure = this._offset;
                                this._expected = [];
                              }
                              if (this._offset === this._failure) {
                                this._expected.push('"FIX"');
                              }
                            }
                            if (address0 === FAILURE) {
                              this._offset = index1;
                              var chunk12 = null;
                              if (this._offset < this._inputSize) {
                                chunk12 = this._input.substring(this._offset, this._offset + 3);
                              }
                              if (chunk12 === 'fup') {
                                address0 = new TreeNode(this._input.substring(this._offset, this._offset + 3), this._offset);
                                this._offset = this._offset + 3;
                              } else {
                                address0 = FAILURE;
                                if (this._offset > this._failure) {
                                  this._failure = this._offset;
                                  this._expected = [];
                                }
                                if (this._offset === this._failure) {
                                  this._expected.push('"fup"');
                                }
                              }
                              if (address0 === FAILURE) {
                                this._offset = index1;
                                var chunk13 = null;
                                if (this._offset < this._inputSize) {
                                  chunk13 = this._input.substring(this._offset, this._offset + 3);
                                }
                                if (chunk13 === 'FUP') {
                                  address0 = new TreeNode(this._input.substring(this._offset, this._offset + 3), this._offset);
                                  this._offset = this._offset + 3;
                                } else {
                                  address0 = FAILURE;
                                  if (this._offset > this._failure) {
                                    this._failure = this._offset;
                                    this._expected = [];
                                  }
                                  if (this._offset === this._failure) {
                                    this._expected.push('"FUP"');
                                  }
                                }
                                if (address0 === FAILURE) {
                                  this._offset = index1;
                                  var chunk14 = null;
                                  if (this._offset < this._inputSize) {
                                    chunk14 = this._input.substring(this._offset, this._offset + 2);
                                  }
                                  if (chunk14 === 'ln') {
                                    address0 = new TreeNode(this._input.substring(this._offset, this._offset + 2), this._offset);
                                    this._offset = this._offset + 2;
                                  } else {
                                    address0 = FAILURE;
                                    if (this._offset > this._failure) {
                                      this._failure = this._offset;
                                      this._expected = [];
                                    }
                                    if (this._offset === this._failure) {
                                      this._expected.push('"ln"');
                                    }
                                  }
                                  if (address0 === FAILURE) {
                                    this._offset = index1;
                                    var chunk15 = null;
                                    if (this._offset < this._inputSize) {
                                      chunk15 = this._input.substring(this._offset, this._offset + 2);
                                    }
                                    if (chunk15 === 'LN') {
                                      address0 = new TreeNode(this._input.substring(this._offset, this._offset + 2), this._offset);
                                      this._offset = this._offset + 2;
                                    } else {
                                      address0 = FAILURE;
                                      if (this._offset > this._failure) {
                                        this._failure = this._offset;
                                        this._expected = [];
                                      }
                                      if (this._offset === this._failure) {
                                        this._expected.push('"LN"');
                                      }
                                    }
                                    if (address0 === FAILURE) {
                                      this._offset = index1;
                                      var chunk16 = null;
                                      if (this._offset < this._inputSize) {
                                        chunk16 = this._input.substring(this._offset, this._offset + 5);
                                      }
                                      if (chunk16 === 'round') {
                                        address0 = new TreeNode(this._input.substring(this._offset, this._offset + 5), this._offset);
                                        this._offset = this._offset + 5;
                                      } else {
                                        address0 = FAILURE;
                                        if (this._offset > this._failure) {
                                          this._failure = this._offset;
                                          this._expected = [];
                                        }
                                        if (this._offset === this._failure) {
                                          this._expected.push('"round"');
                                        }
                                      }
                                      if (address0 === FAILURE) {
                                        this._offset = index1;
                                        var chunk17 = null;
                                        if (this._offset < this._inputSize) {
                                          chunk17 = this._input.substring(this._offset, this._offset + 5);
                                        }
                                        if (chunk17 === 'ROUND') {
                                          address0 = new TreeNode(this._input.substring(this._offset, this._offset + 5), this._offset);
                                          this._offset = this._offset + 5;
                                        } else {
                                          address0 = FAILURE;
                                          if (this._offset > this._failure) {
                                            this._failure = this._offset;
                                            this._expected = [];
                                          }
                                          if (this._offset === this._failure) {
                                            this._expected.push('"ROUND"');
                                          }
                                        }
                                        if (address0 === FAILURE) {
                                          this._offset = index1;
                                          var chunk18 = null;
                                          if (this._offset < this._inputSize) {
                                            chunk18 = this._input.substring(this._offset, this._offset + 3);
                                          }
                                          if (chunk18 === 'sin') {
                                            address0 = new TreeNode(this._input.substring(this._offset, this._offset + 3), this._offset);
                                            this._offset = this._offset + 3;
                                          } else {
                                            address0 = FAILURE;
                                            if (this._offset > this._failure) {
                                              this._failure = this._offset;
                                              this._expected = [];
                                            }
                                            if (this._offset === this._failure) {
                                              this._expected.push('"sin"');
                                            }
                                          }
                                          if (address0 === FAILURE) {
                                            this._offset = index1;
                                            var chunk19 = null;
                                            if (this._offset < this._inputSize) {
                                              chunk19 = this._input.substring(this._offset, this._offset + 3);
                                            }
                                            if (chunk19 === 'SIN') {
                                              address0 = new TreeNode(this._input.substring(this._offset, this._offset + 3), this._offset);
                                              this._offset = this._offset + 3;
                                            } else {
                                              address0 = FAILURE;
                                              if (this._offset > this._failure) {
                                                this._failure = this._offset;
                                                this._expected = [];
                                              }
                                              if (this._offset === this._failure) {
                                                this._expected.push('"SIN"');
                                              }
                                            }
                                            if (address0 === FAILURE) {
                                              this._offset = index1;
                                              var chunk20 = null;
                                              if (this._offset < this._inputSize) {
                                                chunk20 = this._input.substring(this._offset, this._offset + 4);
                                              }
                                              if (chunk20 === 'sqrt') {
                                                address0 = new TreeNode(this._input.substring(this._offset, this._offset + 4), this._offset);
                                                this._offset = this._offset + 4;
                                              } else {
                                                address0 = FAILURE;
                                                if (this._offset > this._failure) {
                                                  this._failure = this._offset;
                                                  this._expected = [];
                                                }
                                                if (this._offset === this._failure) {
                                                  this._expected.push('"sqrt"');
                                                }
                                              }
                                              if (address0 === FAILURE) {
                                                this._offset = index1;
                                                var chunk21 = null;
                                                if (this._offset < this._inputSize) {
                                                  chunk21 = this._input.substring(this._offset, this._offset + 4);
                                                }
                                                if (chunk21 === 'SQRT') {
                                                  address0 = new TreeNode(this._input.substring(this._offset, this._offset + 4), this._offset);
                                                  this._offset = this._offset + 4;
                                                } else {
                                                  address0 = FAILURE;
                                                  if (this._offset > this._failure) {
                                                    this._failure = this._offset;
                                                    this._expected = [];
                                                  }
                                                  if (this._offset === this._failure) {
                                                    this._expected.push('"SQRT"');
                                                  }
                                                }
                                                if (address0 === FAILURE) {
                                                  this._offset = index1;
                                                  var chunk22 = null;
                                                  if (this._offset < this._inputSize) {
                                                    chunk22 = this._input.substring(this._offset, this._offset + 3);
                                                  }
                                                  if (chunk22 === 'tan') {
                                                    address0 = new TreeNode(this._input.substring(this._offset, this._offset + 3), this._offset);
                                                    this._offset = this._offset + 3;
                                                  } else {
                                                    address0 = FAILURE;
                                                    if (this._offset > this._failure) {
                                                      this._failure = this._offset;
                                                      this._expected = [];
                                                    }
                                                    if (this._offset === this._failure) {
                                                      this._expected.push('"tan"');
                                                    }
                                                  }
                                                  if (address0 === FAILURE) {
                                                    this._offset = index1;
                                                    var chunk23 = null;
                                                    if (this._offset < this._inputSize) {
                                                      chunk23 = this._input.substring(this._offset, this._offset + 3);
                                                    }
                                                    if (chunk23 === 'TAN') {
                                                      address0 = new TreeNode(this._input.substring(this._offset, this._offset + 3), this._offset);
                                                      this._offset = this._offset + 3;
                                                    } else {
                                                      address0 = FAILURE;
                                                      if (this._offset > this._failure) {
                                                        this._failure = this._offset;
                                                        this._expected = [];
                                                      }
                                                      if (this._offset === this._failure) {
                                                        this._expected.push('"TAN"');
                                                      }
                                                    }
                                                    if (address0 === FAILURE) {
                                                      this._offset = index1;
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      this._cache._ordinary_unary_operation[index0] = [address0, this._offset];
      return address0;
    },

    _read_binary_operation1: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._binary_operation1 = this._cache._binary_operation1 || {};
      var cached = this._cache._binary_operation1[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 2);
      }
      if (chunk0 === '**') {
        address0 = this._actions.makeBinOp(this._input, this._offset, this._offset + 2);
        this._offset = this._offset + 2;
      } else {
        address0 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('"**"');
        }
      }
      this._cache._binary_operation1[index0] = [address0, this._offset];
      return address0;
    },

    _read_binary_operation2: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._binary_operation2 = this._cache._binary_operation2 || {};
      var cached = this._cache._binary_operation2[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 1);
      }
      if (chunk0 === '/') {
        address0 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
        this._offset = this._offset + 1;
      } else {
        address0 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('"/"');
        }
      }
      if (address0 === FAILURE) {
        this._offset = index1;
        var chunk1 = null;
        if (this._offset < this._inputSize) {
          chunk1 = this._input.substring(this._offset, this._offset + 3);
        }
        if (chunk1 === 'mod') {
          address0 = new TreeNode(this._input.substring(this._offset, this._offset + 3), this._offset);
          this._offset = this._offset + 3;
        } else {
          address0 = FAILURE;
          if (this._offset > this._failure) {
            this._failure = this._offset;
            this._expected = [];
          }
          if (this._offset === this._failure) {
            this._expected.push('"mod"');
          }
        }
        if (address0 === FAILURE) {
          this._offset = index1;
          var chunk2 = null;
          if (this._offset < this._inputSize) {
            chunk2 = this._input.substring(this._offset, this._offset + 1);
          }
          if (chunk2 === '*') {
            address0 = this._actions.makeBinOp(this._input, this._offset, this._offset + 1);
            this._offset = this._offset + 1;
          } else {
            address0 = FAILURE;
            if (this._offset > this._failure) {
              this._failure = this._offset;
              this._expected = [];
            }
            if (this._offset === this._failure) {
              this._expected.push('"*"');
            }
          }
          if (address0 === FAILURE) {
            this._offset = index1;
          }
        }
      }
      this._cache._binary_operation2[index0] = [address0, this._offset];
      return address0;
    },

    _read_binary_operation3: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._binary_operation3 = this._cache._binary_operation3 || {};
      var cached = this._cache._binary_operation3[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var index1 = this._offset;
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 3);
      }
      if (chunk0 === 'and') {
        address0 = new TreeNode(this._input.substring(this._offset, this._offset + 3), this._offset);
        this._offset = this._offset + 3;
      } else {
        address0 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('"and"');
        }
      }
      if (address0 === FAILURE) {
        this._offset = index1;
        var chunk1 = null;
        if (this._offset < this._inputSize) {
          chunk1 = this._input.substring(this._offset, this._offset + 3);
        }
        if (chunk1 === 'xor') {
          address0 = new TreeNode(this._input.substring(this._offset, this._offset + 3), this._offset);
          this._offset = this._offset + 3;
        } else {
          address0 = FAILURE;
          if (this._offset > this._failure) {
            this._failure = this._offset;
            this._expected = [];
          }
          if (this._offset === this._failure) {
            this._expected.push('"xor"');
          }
        }
        if (address0 === FAILURE) {
          this._offset = index1;
          var chunk2 = null;
          if (this._offset < this._inputSize) {
            chunk2 = this._input.substring(this._offset, this._offset + 1);
          }
          if (chunk2 === '-') {
            address0 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
            this._offset = this._offset + 1;
          } else {
            address0 = FAILURE;
            if (this._offset > this._failure) {
              this._failure = this._offset;
              this._expected = [];
            }
            if (this._offset === this._failure) {
              this._expected.push('"-"');
            }
          }
          if (address0 === FAILURE) {
            this._offset = index1;
            var chunk3 = null;
            if (this._offset < this._inputSize) {
              chunk3 = this._input.substring(this._offset, this._offset + 2);
            }
            if (chunk3 === 'or') {
              address0 = new TreeNode(this._input.substring(this._offset, this._offset + 2), this._offset);
              this._offset = this._offset + 2;
            } else {
              address0 = FAILURE;
              if (this._offset > this._failure) {
                this._failure = this._offset;
                this._expected = [];
              }
              if (this._offset === this._failure) {
                this._expected.push('"or"');
              }
            }
            if (address0 === FAILURE) {
              this._offset = index1;
              var chunk4 = null;
              if (this._offset < this._inputSize) {
                chunk4 = this._input.substring(this._offset, this._offset + 1);
              }
              if (chunk4 === '+') {
                address0 = this._actions.makeBinOp(this._input, this._offset, this._offset + 1);
                this._offset = this._offset + 1;
              } else {
                address0 = FAILURE;
                if (this._offset > this._failure) {
                  this._failure = this._offset;
                  this._expected = [];
                }
                if (this._offset === this._failure) {
                  this._expected.push('"+"');
                }
              }
              if (address0 === FAILURE) {
                this._offset = index1;
              }
            }
          }
        }
      }
      this._cache._binary_operation3[index0] = [address0, this._offset];
      return address0;
    },

    _read_mid_line_letter: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._mid_line_letter = this._cache._mid_line_letter || {};
      var cached = this._cache._mid_line_letter[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 1);
      }
      if (chunk0 !== null && /^[a-dA-Df-nF-Np-tP-Tx-zX-Z]/.test(chunk0)) {
        address0 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
        this._offset = this._offset + 1;
      } else {
        address0 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('[a-dA-Df-nF-Np-tP-Tx-zX-Z]');
        }
      }
      this._cache._mid_line_letter[index0] = [address0, this._offset];
      return address0;
    },

    _read_comment_character: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._comment_character = this._cache._comment_character || {};
      var cached = this._cache._comment_character[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 1);
      }
      if (chunk0 !== null && /^[a-zA-Z0-9!"#$%&'*\+,.\/:;<=>?@\[\] ^_`{|}~\- \t]/.test(chunk0)) {
        address0 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
        this._offset = this._offset + 1;
      } else {
        address0 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('[a-zA-Z0-9!"#$%&\'*\\+,.\\/:;<=>?@\\[\\] ^_`{|}~\\- \\t]');
        }
      }
      this._cache._comment_character[index0] = [address0, this._offset];
      return address0;
    },

    _read_white_space: function() {
      var address0 = FAILURE, index0 = this._offset;
      this._cache._white_space = this._cache._white_space || {};
      var cached = this._cache._white_space[index0];
      if (cached) {
        this._offset = cached[1];
        return cached[0];
      }
      var chunk0 = null;
      if (this._offset < this._inputSize) {
        chunk0 = this._input.substring(this._offset, this._offset + 1);
      }
      if (chunk0 !== null && /^[\t ]/.test(chunk0)) {
        address0 = new TreeNode(this._input.substring(this._offset, this._offset + 1), this._offset);
        this._offset = this._offset + 1;
      } else {
        address0 = FAILURE;
        if (this._offset > this._failure) {
          this._failure = this._offset;
          this._expected = [];
        }
        if (this._offset === this._failure) {
          this._expected.push('[\\t ]');
        }
      }
      this._cache._white_space[index0] = [address0, this._offset];
      return address0;
    }
  };

  var Parser = function(input, actions, types) {
    this._input = input;
    this._inputSize = input.length;
    this._actions = actions;
    this._types = types;
    this._offset = 0;
    this._cache = {};
    this._failure = 0;
    this._expected = [];
  };

  Parser.prototype.parse = function() {
    var tree = this._read_line();
    if (tree !== FAILURE && this._offset === this._inputSize) {
      return tree;
    }
    if (this._expected.length === 0) {
      this._failure = this._offset;
      this._expected.push('<EOF>');
    }
    this.constructor.lastError = {offset: this._offset, expected: this._expected};
    throw new SyntaxError(formatError(this._input, this._failure, this._expected));
  };

  var parse = function(input, options) {
    options = options || {};
    var parser = new Parser(input, options.actions, options.types);
    return parser.parse();
  };
  extend(Parser.prototype, Grammar);

  var exported = {Grammar: Grammar, Parser: Parser, parse: parse};

  if (typeof require === 'function' && typeof exports === 'object') {
    extend(exports, exported);
  } else {
    var namespace = typeof this !== 'undefined' ? this : window;
    namespace.RS274Line = exported;
  }
})();
