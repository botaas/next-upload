import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { v4 } from 'uuid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { STSClient, GetFederationTokenCommand } from '@aws-sdk/client-sts';
import { Upload } from '@aws-sdk/lib-storage';
import React, { forwardRef, useRef, useState } from 'react';

function _regeneratorRuntime() {
  _regeneratorRuntime = function () {
    return exports;
  };
  var exports = {},
    Op = Object.prototype,
    hasOwn = Op.hasOwnProperty,
    defineProperty = Object.defineProperty || function (obj, key, desc) {
      obj[key] = desc.value;
    },
    $Symbol = "function" == typeof Symbol ? Symbol : {},
    iteratorSymbol = $Symbol.iterator || "@@iterator",
    asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
    toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
  function define(obj, key, value) {
    return Object.defineProperty(obj, key, {
      value: value,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), obj[key];
  }
  try {
    define({}, "");
  } catch (err) {
    define = function (obj, key, value) {
      return obj[key] = value;
    };
  }
  function wrap(innerFn, outerFn, self, tryLocsList) {
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
      generator = Object.create(protoGenerator.prototype),
      context = new Context(tryLocsList || []);
    return defineProperty(generator, "_invoke", {
      value: makeInvokeMethod(innerFn, self, context)
    }), generator;
  }
  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }
  exports.wrap = wrap;
  var ContinueSentinel = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf,
    NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }
  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if ("throw" !== record.type) {
        var result = record.arg,
          value = result.value;
        return value && "object" == typeof value && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
          invoke("next", value, resolve, reject);
        }, function (err) {
          invoke("throw", err, resolve, reject);
        }) : PromiseImpl.resolve(value).then(function (unwrapped) {
          result.value = unwrapped, resolve(result);
        }, function (error) {
          return invoke("throw", error, resolve, reject);
        });
      }
      reject(record.arg);
    }
    var previousPromise;
    defineProperty(this, "_invoke", {
      value: function (method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }
        return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(innerFn, self, context) {
    var state = "suspendedStart";
    return function (method, arg) {
      if ("executing" === state) throw new Error("Generator is already running");
      if ("completed" === state) {
        if ("throw" === method) throw arg;
        return doneResult();
      }
      for (context.method = method, context.arg = arg;;) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }
        if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
          if ("suspendedStart" === state) throw state = "completed", context.arg;
          context.dispatchException(context.arg);
        } else "return" === context.method && context.abrupt("return", context.arg);
        state = "executing";
        var record = tryCatch(innerFn, self, context);
        if ("normal" === record.type) {
          if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
          return {
            value: record.arg,
            done: context.done
          };
        }
        "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
      }
    };
  }
  function maybeInvokeDelegate(delegate, context) {
    var methodName = context.method,
      method = delegate.iterator[methodName];
    if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel;
    var record = tryCatch(method, delegate.iterator, context.arg);
    if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
    var info = record.arg;
    return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
  }
  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };
    1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
  }
  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal", delete record.arg, entry.completion = record;
  }
  function Context(tryLocsList) {
    this.tryEntries = [{
      tryLoc: "root"
    }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) return iteratorMethod.call(iterable);
      if ("function" == typeof iterable.next) return iterable;
      if (!isNaN(iterable.length)) {
        var i = -1,
          next = function next() {
            for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
            return next.value = undefined, next.done = !0, next;
          };
        return next.next = next;
      }
    }
    return {
      next: doneResult
    };
  }
  function doneResult() {
    return {
      value: undefined,
      done: !0
    };
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), defineProperty(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
    var ctor = "function" == typeof genFun && genFun.constructor;
    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
  }, exports.mark = function (genFun) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
  }, exports.awrap = function (arg) {
    return {
      __await: arg
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    void 0 === PromiseImpl && (PromiseImpl = Promise);
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
    return this;
  }), define(Gp, "toString", function () {
    return "[object Generator]";
  }), exports.keys = function (val) {
    var object = Object(val),
      keys = [];
    for (var key in object) keys.push(key);
    return keys.reverse(), function next() {
      for (; keys.length;) {
        var key = keys.pop();
        if (key in object) return next.value = key, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, exports.values = values, Context.prototype = {
    constructor: Context,
    reset: function (skipTempReset) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
    },
    stop: function () {
      this.done = !0;
      var rootRecord = this.tryEntries[0].completion;
      if ("throw" === rootRecord.type) throw rootRecord.arg;
      return this.rval;
    },
    dispatchException: function (exception) {
      if (this.done) throw exception;
      var context = this;
      function handle(loc, caught) {
        return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
      }
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i],
          record = entry.completion;
        if ("root" === entry.tryLoc) return handle("end");
        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc"),
            hasFinally = hasOwn.call(entry, "finallyLoc");
          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
          } else {
            if (!hasFinally) throw new Error("try statement without catch or finally");
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          }
        }
      }
    },
    abrupt: function (type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }
      finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
      var record = finallyEntry ? finallyEntry.completion : {};
      return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
    },
    complete: function (record, afterLoc) {
      if ("throw" === record.type) throw record.arg;
      return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
    },
    finish: function (finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
      }
    },
    catch: function (tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if ("throw" === record.type) {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function (iterable, resultName, nextLoc) {
      return this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
    }
  }, exports;
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}

function getClient(config) {
  var client = new S3Client(_extends({
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey
    },
    region: config.region
  }, config.forcePathStyle ? {
    forcePathStyle: config.forcePathStyle
  } : {}, config.endpoint ? {
    endpoint: config.endpoint
  } : {}));
  return client;
}

var uuid = function uuid() {
  return v4();
};
var SAFE_CHARACTERS = /[^0-9a-zA-Z!_\\.\\*'\\(\\)\\\-/]/g;
var sanitizeKey = function sanitizeKey(value) {
  return value.replace(SAFE_CHARACTERS, ' ').replace(/\s+/g, '-');
};

var makeRouteHandler = function makeRouteHandler(optionsFetcher) {
  var route = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(request) {
      var _yield$request$json, strategy, filename, filetype, options, key, bucket, region, endpoint, client, params, url, stsConfig, policy, sts, command, token;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return request.json();
          case 2:
            _yield$request$json = _context.sent;
            strategy = _yield$request$json.strategy;
            filename = _yield$request$json.filename;
            filetype = _yield$request$json.filetype;
            console.log('filetype: ', filetype);
            if (optionsFetcher) {
              _context.next = 9;
              break;
            }
            return _context.abrupt("return", new Response("S3 Upload: Missing config", {
              status: 400
            }));
          case 9:
            _context.next = 11;
            return optionsFetcher(request);
          case 11:
            options = _context.sent;
            if (options) {
              _context.next = 14;
              break;
            }
            return _context.abrupt("return", new Response("S3 Upload: No config fetched", {
              status: 400
            }));
          case 14:
            if (!options.key) {
              _context.next = 20;
              break;
            }
            _context.next = 17;
            return Promise.resolve(options.key(request, filename));
          case 17:
            _context.t0 = _context.sent;
            _context.next = 21;
            break;
          case 20:
            _context.t0 = "uploads/" + uuid() + "/" + sanitizeKey(filename);
          case 21:
            key = _context.t0;
            bucket = options.bucket, region = options.region, endpoint = options.endpoint;
            if (!(strategy === 'presigned')) {
              _context.next = 32;
              break;
            }
            client = getClient(options);
            params = {
              Bucket: bucket,
              Key: key,
              ContentType: filetype,
              CacheControl: 'max-age=630720000'
            };
            _context.next = 28;
            return getSignedUrl(client, new PutObjectCommand(params), {
              expiresIn: 60 * 60
            });
          case 28:
            url = _context.sent;
            return _context.abrupt("return", NextResponse.json({
              key: key,
              bucket: bucket,
              region: region,
              endpoint: endpoint,
              url: url
            }));
          case 32:
            stsConfig = {
              credentials: {
                accessKeyId: options.accessKeyId,
                secretAccessKey: options.secretAccessKey
              },
              region: region
            };
            policy = {
              Statement: [{
                Sid: 'Stmt1S3UploadAssets',
                Effect: 'Allow',
                Action: ['s3:PutObject'],
                Resource: ["arn:aws:s3:::" + bucket + "/" + key]
              }]
            };
            sts = new STSClient(stsConfig);
            command = new GetFederationTokenCommand({
              Name: 'S3UploadWebToken',
              Policy: JSON.stringify(policy),
              DurationSeconds: 60 * 60
            });
            _context.next = 38;
            return sts.send(command);
          case 38:
            token = _context.sent;
            return _context.abrupt("return", NextResponse.json({
              token: token,
              key: key,
              bucket: bucket,
              region: region
            }));
          case 40:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function route(_x) {
      return _ref.apply(this, arguments);
    };
  }();
  var configure = function configure(optionsFetcher) {
    return makeRouteHandler(optionsFetcher);
  };
  return Object.assign(route, {
    configure: configure
  });
};
var APIRoute = /*#__PURE__*/makeRouteHandler();

var _excluded = ["onChange"];
var FileInput = /*#__PURE__*/forwardRef(function (_ref, forwardedRef) {
  var _ref$onChange = _ref.onChange,
    onChange = _ref$onChange === void 0 ? function () {} : _ref$onChange,
    restOfProps = _objectWithoutPropertiesLoose(_ref, _excluded);
  var handleChange = function handleChange(event) {
    var _event$target, _event$target$files;
    var file = (_event$target = event.target) == null ? void 0 : (_event$target$files = _event$target.files) == null ? void 0 : _event$target$files[0];
    onChange(file, event);
  };
  return React.createElement("input", Object.assign({
    onChange: handleChange
  }, restOfProps, {
    ref: forwardedRef,
    type: "file"
  }));
});

var useUploadFiles = function useUploadFiles() {
  var ref = useRef();
  var _useState = useState([]),
    files = _useState[0],
    setFiles = _useState[1];
  var openFileDialog = function openFileDialog() {
    if (ref.current) {
      var _ref$current;
      ref.current.value = '';
      (_ref$current = ref.current) == null ? void 0 : _ref$current.click();
    }
  };
  var resetFiles = function resetFiles() {
    setFiles([]);
  };
  var updateFileProgress = function updateFileProgress(file, uploaded) {
    setFiles(function (files) {
      return files.map(function (trackedFile) {
        return trackedFile.file === file ? {
          file: file,
          uploaded: uploaded,
          size: file.size,
          progress: file.size ? uploaded / file.size * 100 : 0
        } : trackedFile;
      });
    });
  };
  var addFile = function addFile(file) {
    setFiles(function (files) {
      return [].concat(files, [{
        file: file,
        progress: 0,
        uploaded: 0,
        size: file.size
      }]);
    });
  };
  return {
    FileInput: function FileInput$1(props) {
      return React.createElement(FileInput, Object.assign({}, props, {
        ref: ref,
        style: {
          display: 'none'
        }
      }));
    },
    openFileDialog: openFileDialog,
    files: files,
    addFile: addFile,
    updateFileProgress: updateFileProgress,
    resetFiles: resetFiles
  };
};

var useUploader = function useUploader(strategy, uploader, oldOptions) {
  var _useUploadFiles = useUploadFiles(),
    addFile = _useUploadFiles.addFile,
    updateFileProgress = _useUploadFiles.updateFileProgress,
    FileInput = _useUploadFiles.FileInput,
    openFileDialog = _useUploadFiles.openFileDialog,
    files = _useUploadFiles.files,
    resetFiles = _useUploadFiles.resetFiles;
  var uploadToS3 = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(file, options) {
      var _options$endpoint;
      var params, result;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if (options === void 0) {
              options = {};
            }
            // combine old options and new options. remove after 1.0
            if (oldOptions != null && oldOptions.endpoint) {
              if (process.env.NODE_ENV === 'development') {
                console.warn('[Next S3 Upload] The `endpoint` option has been replaced by `endpoint.request.url`. For more information see: https://next-s3-upload.codingvalue.com/changes/endpoint');
              }
              if (options.endpoint) {
                options.endpoint.request.url = oldOptions.endpoint;
              } else {
                options.endpoint = {
                  request: {
                    url: oldOptions.endpoint
                  }
                };
              }
            }
            _context.next = 4;
            return getUploadParams(strategy, file, (_options$endpoint = options.endpoint) == null ? void 0 : _options$endpoint.request);
          case 4:
            params = _context.sent;
            if (!params.error) {
              _context.next = 8;
              break;
            }
            console.error(params.error);
            throw params.error;
          case 8:
            addFile(file);
            _context.next = 11;
            return uploader(file, params, {
              onProgress: function onProgress(uploaded) {
                return updateFileProgress(file, uploaded);
              }
            });
          case 11:
            result = _context.sent;
            return _context.abrupt("return", result);
          case 13:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function uploadToS3(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();
  return {
    FileInput: FileInput,
    openFileDialog: openFileDialog,
    uploadToS3: uploadToS3,
    files: files,
    resetFiles: resetFiles
  };
};
var getUploadParams = /*#__PURE__*/function () {
  var _ref2 = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(strategy, file, requestOptions) {
    var _requestOptions$body, _requestOptions$heade, _requestOptions$url;
    var additionalBody, additionalHeaders, apiRouteUrl, body, headers, res;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          additionalBody = (_requestOptions$body = requestOptions == null ? void 0 : requestOptions.body) != null ? _requestOptions$body : {};
          additionalHeaders = (_requestOptions$heade = requestOptions == null ? void 0 : requestOptions.headers) != null ? _requestOptions$heade : {};
          apiRouteUrl = (_requestOptions$url = requestOptions == null ? void 0 : requestOptions.url) != null ? _requestOptions$url : '/api/upload/s3';
          body = _extends({
            filename: file.name,
            filetype: file.type,
            strategy: strategy
          }, additionalBody);
          headers = _extends({}, additionalHeaders, {
            'Content-Type': 'application/json'
          });
          _context2.next = 7;
          return fetch(apiRouteUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
          });
        case 7:
          res = _context2.sent;
          _context2.next = 10;
          return res.json();
        case 10:
          return _context2.abrupt("return", _context2.sent);
        case 11:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function getUploadParams(_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();

var upload = /*#__PURE__*/function () {
  var _ref2 = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(file, params, _ref) {
    var _uploadResult$Bucket, _uploadResult$Key;
    var onProgress, key, bucket, token, region, client, uploadParams, s3Upload, uploadResult, url;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          onProgress = _ref.onProgress;
          key = params.key, bucket = params.bucket, token = params.token, region = params.region;
          client = new S3Client({
            credentials: {
              accessKeyId: token.Credentials.AccessKeyId,
              secretAccessKey: token.Credentials.SecretAccessKey,
              sessionToken: token.Credentials.SessionToken
            },
            region: region
          });
          uploadParams = {
            Bucket: bucket,
            Key: key,
            Body: file,
            CacheControl: 'max-age=630720000, public',
            ContentType: file.type
          }; // at some point make this configurable
          // let uploadOptions = {
          //   partSize: 100 * 1024 * 1024,
          //   queueSize: 1,
          // };
          s3Upload = new Upload({
            client: client,
            params: uploadParams
          });
          s3Upload.on('httpUploadProgress', function (progress) {
            var _progress$loaded;
            var uploaded = (_progress$loaded = progress.loaded) != null ? _progress$loaded : 0;
            onProgress(uploaded);
          });
          _context.next = 8;
          return s3Upload.done();
        case 8:
          uploadResult = _context.sent;
          url = uploadResult.Bucket && uploadResult.Key ? "https://" + uploadResult.Bucket + ".s3." + region + ".amazonaws.com/" + uploadResult.Key : '';
          return _context.abrupt("return", {
            url: url,
            bucket: (_uploadResult$Bucket = uploadResult.Bucket) != null ? _uploadResult$Bucket : '',
            key: (_uploadResult$Key = uploadResult.Key) != null ? _uploadResult$Key : ''
          });
        case 11:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function upload(_x, _x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();
var useS3Upload = function useS3Upload(options) {
  var hook = useUploader('aws-sdk', upload, options);
  return hook;
};

var upload$1 = /*#__PURE__*/function () {
  var _ref2 = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(file, params, _ref) {
    var onProgress, url, key, bucket, region, endpoint, buffer, resultUrl;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          onProgress = _ref.onProgress;
          url = params.url, key = params.key, bucket = params.bucket, region = params.region, endpoint = params.endpoint;
          _context.next = 4;
          return file.arrayBuffer();
        case 4:
          buffer = _context.sent;
          _context.next = 7;
          return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.upload.onprogress = function (event) {
              onProgress(event.loaded);
            };
            xhr.open('PUT', url, true);
            xhr.setRequestHeader('Content-Type', file.type);
            xhr.setRequestHeader('Cache-Control', 'max-age=630720000');
            xhr.onreadystatechange = function () {
              if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                  resolve();
                } else {
                  reject();
                }
              }
            };
            xhr.send(buffer);
          });
        case 7:
          resultUrl = endpoint ? endpoint + "/" + bucket + "/" + key : "https://" + bucket + ".s3." + region + ".amazonaws.com/" + key;
          return _context.abrupt("return", {
            url: resultUrl,
            bucket: bucket,
            key: key
          });
        case 9:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function upload(_x, _x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();
var usePresignedUpload = function usePresignedUpload() {
  var hook = useUploader('presigned', upload$1);
  return hook;
};

var getImageData = function getImageData(file) {
  return new Promise(function (resolve) {
    var _file$type$split;
    if (((_file$type$split = file.type.split('/')) == null ? void 0 : _file$type$split[0]) === 'image') {
      var img = new Image();
      var objectUrl = URL.createObjectURL(file);
      img.onload = function (event) {
        var image = event.target;
        resolve({
          height: image.height,
          width: image.width
        });
        URL.revokeObjectURL(objectUrl);
      };
      img.src = objectUrl;
    } else {
      resolve({
        height: undefined,
        width: undefined
      });
    }
  });
};

var generateTemporaryUrl = /*#__PURE__*/function () {
  var _ref = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(key, config) {
    var client, command, url;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          client = getClient(config);
          command = new GetObjectCommand({
            Bucket: config.bucket,
            Key: key
          });
          _context.next = 4;
          return getSignedUrl(client, command, {
            expiresIn: 3600
          });
        case 4:
          url = _context.sent;
          return _context.abrupt("return", url);
        case 6:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function generateTemporaryUrl(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

export { APIRoute, generateTemporaryUrl, getImageData, sanitizeKey, usePresignedUpload, useS3Upload, uuid };
//# sourceMappingURL=next-upload.esm.js.map
