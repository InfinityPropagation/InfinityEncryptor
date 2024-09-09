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
    a: encryption key (key) represents the sequence of Alpha Numeric Mapping (The alphaNumMap is also modifiable).
    b: encryption mode (mode) represents the time considerations during encryption/decryption, mode = '' will
        turn of this layer of security.

2. Altering mode Y M D H I arrangement will result different encrypt/decrypt sequence. eg: DMYIH

3. InfinityEncryptor will only encrypt and decrypt Alphanumerics characters, symbols and special characters
    will  not be encrypted.

# TypeScript/Javascript
//import the library
import InfinityEncryptor from 'path/InfinityEncryptor.js';

//parameters declaration
const original = 'Infinity Propagation\n2024-09-06';

const key = '12345'; 
/* key has no length limit, the longer the length more exhaustive encryption/decryption to process. Key shall not have 0, any 0's will be autoremoved */

const mode = 'YMDHI'; //optional parameter, default will be 'YMDHI'

//initialize encyptor
const Encryptor = new InfinityEncryptor(key, mode);

//encrypt original text
const encrypted = Encryptor.Encrypt(original);

//decrypt original text
const decrypted = Encryptor.Decrypt(encrypted);

//test output
console.log(
    "Original: " + original + '\n' +
    "Encrypted: " + encrypted + '\n' +
    "Decrypted: " + decrypted + '\n'
);

# PHP
//import the library
require_once("../plugins/InfinityEncryptor.php");

//parameters declaration
$original = "Infinity Propagation\n2024-09-06";
$key = '12345'; //key shall not have 0, any 0's will be autoremoved
$mode = 'YMDHI'; //optional parameter, default will be 'YMDHI'

//initialize encyptor
$infinity_encryptor = new InfinityEncryptor($key, $mode);

//encrypt original text
$encrypted = $infinity_encryptor->Encrypt($original);

//decrypt encrypted text
$decrypted = $infinity_encryptor->Decrypt($encrypted);

//test output
echo "Original: $original<br/>";
echo "Encrypted: $encrypted<br/>";
echo "Decrypted: $decrypted<br/>";

## Contributing

studio: Infinity Propagation
programmer: Delon Twk

## License

This project is licensed under the [MIT License](LICENSE). See the [LICENSE](LICENSE) file for details.