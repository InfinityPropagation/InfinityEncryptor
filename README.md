# INFINITY ENCRYPTOR

JS & PHP customizable Encryption/Decryption tool designed by InfinityPropagation

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/InfinityPropagation/InfinityEncryptor.git
    ```
2. According to your environment (JS, TSX, PHP), move the file with matched extension into your project.

## Usage
# Notes
1. This encryption/decryption tool has two layers of modifiable security,
- a: Encryption Key (key) represents the sequence of Alpha Numeric Mapping (The alphaNumMap is also modifiable).
- b: Encryption Mode (mode) represents the time considerations during encryption/decryption, mode = '' will turn of this layer of security.

2. Altering mode Y M D H I arrangement will result different encrypt/decrypt sequence. eg: DMYIH

3. InfinityEncryptor will only encrypt and decrypt Alphanumerics characters, symbols and special characters
    will  not be encrypted.

# TypeScript/Javascript
//import the library<br/>
import InfinityEncryptor from 'path/InfinityEncryptor.js';<br/>
<br/>
//parameters declaration<br/>
const original = 'Infinity Propagation\n2024-09-06';<br/>
<br/>
const key = '12345'; <br/>
/* key has no length limit, the longer the length more exhaustive encryption/decryption to process. Key shall not have 0, any 0's will be autoremoved */<br/>
<br/>
const mode = 'YMDHI'; //optional parameter, default will be 'YMDHI'<br/>
<br/>
//initialize encyptor<br/>
const Encryptor = new InfinityEncryptor(key, mode);<br/>
<br/>
//encrypt original text<br/>
const encrypted = Encryptor.Encrypt(original);<br/>
<br/>
//decrypt original text<br/>
const decrypted = Encryptor.Decrypt(encrypted);<br/>
<br/>
//test output<br/>
console.log(<br/>
    "Original: " + original + '\n' +<br/>
    "Encrypted: " + encrypted + '\n' +<br/>
    "Decrypted: " + decrypted + '\n'<br/>
);<br/>

# PHP
//import the library<br/>
require_once("../plugins/InfinityEncryptor.php");<br/>
<br/>
//parameters declaration<br/>
$original = "Infinity Propagation\n2024-09-06";<br/>
$key = '12345'; <br/>
/* key has no length limit, the longer the length more exhaustive encryption/decryption to process. Key shall not have 0, any 0's will be autoremoved */<br/>
$mode = 'YMDHI'; //optional parameter, default will be 'YMDHI'<br/>
<br/>
//initialize encyptor<br/>
$infinity_encryptor = new InfinityEncryptor($key, $mode);<br/>
<br/>
//encrypt original text<br/>
$encrypted = $infinity_encryptor->Encrypt($original);<br/>
<br/>
//decrypt encrypted text<br/>
$decrypted = $infinity_encryptor->Decrypt($encrypted);<br/>
<br/>
//test output<br/>
echo "Original: $original";<br/>
echo "Encrypted: $encrypted";<br/>
echo "Decrypted: $decrypted";<br/>

## Contributing

studio: Infinity Propagation<br/>
programmer: Delon Twk

## License

This project is licensed under the [MIT License](LICENSE). See the [LICENSE](LICENSE) file for details.
