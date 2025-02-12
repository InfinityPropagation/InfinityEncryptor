const nonstate = {
  alphaNumMap: {
    "0": 1,
    "1": 2,
    "2": 3,
    "3": 4,
    "4": 5,
    "5": 6,
    "6": 7,
    "7": 8,
    "8": 9,
    "9": 10,
    a: 11,
    b: 12,
    c: 13,
    d: 14,
    e: 15,
    f: 16,
    g: 17,
    h: 18,
    i: 19,
    j: 20,
    k: 21,
    l: 22,
    m: 23,
    n: 24,
    o: 25,
    p: 26,
    q: 27,
    r: 28,
    s: 29,
    t: 30,
    u: 31,
    v: 32,
    w: 33,
    x: 34,
    y: 35,
    z: 36,
    A: 37,
    B: 38,
    C: 39,
    D: 40,
    E: 41,
    F: 42,
    G: 43,
    H: 44,
    I: 45,
    J: 46,
    K: 47,
    L: 48,
    M: 49,
    N: 50,
    O: 51,
    P: 52,
    Q: 53,
    R: 54,
    S: 55,
    T: 56,
    U: 57,
    V: 58,
    W: 59,
    X: 60,
    Y: 61,
    Z: 62
  },
  keyIndexMin: 1,
  keyIndexMax: 62,
  prefix: "INFINITYENCRYPTOR"
}

class InfinityEncryptor {
  key = "88888888" //0 is useless
  mode = "YMDHI" //Y-year, M-month, D-date, H-hour, I-minute, if mode set to '' (empty), no time code will be generated

  constructor(key, mode) {
    if(key != undefined)
      this.key = key.replace(/0/g, "");
    
    this.mode = mode != undefined ? mode : "YMDHI"
  }
  Encrypt(subject) {
    const enkey = this.GenerateEncryptionKey().replace(/0/g, '1');
    const subjectIndexArr = this.ConvertToIndexArr(
      nonstate.prefix + ":;:" + subject
    )
    const shuffledIndexArr = this.ShuffleIndexArr(subjectIndexArr, enkey)
    const encryptedString = this.ConvertFromIndexArr(shuffledIndexArr)
    return encryptedString
  }
  Encrypt_GenKey(subject) {
    const enkey = this.GenerateEncryptionKey().replace(/0/g, '1');
    const subjectIndexArr = this.ConvertToIndexArr(nonstate.prefix + ':;:' + subject);
    const shuffledIndexArr = this.ShuffleIndexArr(subjectIndexArr, enkey);
    const encryptedString = this.ConvertFromIndexArr(shuffledIndexArr);
    return {key: enkey, encrypted: encryptedString};
  }
  Decrypt(subject) {
    let dekey
    let subjectIndexArr
    let unShuffledIndexArr
    let decryptedString
    let decryptedSubjectArr
    let decryptedPrefix
    let decryptedSubject = ""

    //trial decrypt at level 0
    //decrption level indicates whether the data is received ontime, or 1 minute late
    dekey = this.GenerateDecryptionKey(0).replace(/0/g, '1');
    subjectIndexArr = this.ConvertToIndexArr(subject)
    unShuffledIndexArr = this.UnShuffleIndexArr(subjectIndexArr, dekey)
    decryptedString = this.ConvertFromIndexArr(unShuffledIndexArr)
    decryptedSubjectArr = decryptedString.split(":;:")
    decryptedPrefix = decryptedSubjectArr[0]

    if (decryptedPrefix == nonstate.prefix) {
      //success decrypt at level 0
      decryptedSubjectArr.map((decrypted, i) => {
        if (i != 0) decryptedSubject += (decryptedSubject.length == 0 ? decrypted : ':;:' + decrypted)
      })
      return decryptedSubject
    } else {
      //trial decrypt at level 1
      //decrption level indicates whether the data is received ontime, or 1 minute late
      dekey = this.GenerateDecryptionKey(1).replace(/0/g, '1');
      subjectIndexArr = this.ConvertToIndexArr(subject)
      unShuffledIndexArr = this.UnShuffleIndexArr(subjectIndexArr, dekey)
      decryptedString = this.ConvertFromIndexArr(unShuffledIndexArr)
      decryptedSubjectArr = decryptedString.split(":;:")
      decryptedPrefix = decryptedSubjectArr[0]
      if (decryptedPrefix == nonstate.prefix) {
        //success decrypt at level 1
        decryptedSubjectArr.map((decrypted, i) => {
          if (i != 0) decryptedSubject += (decryptedSubject.length == 0 ? decrypted : ':;:' + decrypted)
        })
        return decryptedSubject
      } else {
        return "IEncryptorDecrypt _false"
      }
    }
  }
  Decrypt_Enkey(subject, enkey) {
    const dekey = this.GenerateDecryptionKey_Enkey(enkey);
    const subjectIndexArr = this.ConvertToIndexArr(subject);
    const unShuffledIndexArr = this.UnShuffleIndexArr(subjectIndexArr, dekey);
    const decryptedString = this.ConvertFromIndexArr(unShuffledIndexArr);
    const decryptedSubjectArr = decryptedString.split(':;:');
    const decryptedPrefix = decryptedSubjectArr[0];
    let decryptedSubject = "";
    if(decryptedPrefix == nonstate.prefix) {
        decryptedSubjectArr.map((decrypted, i) => {
            if(i != 0)
                decryptedSubject += (decryptedSubject.length == 0 ? decrypted : ':;:' + decrypted);
        });
    } else {
        return 'IEncryptorDecryptWithEnkeyErr prefixUnMatch _false';
    }
    return decryptedSubject;
  }

  //privates
  GenerateEncryptionKey() {
    const timeCode = this.mode != "" ? this.GetTimeCode(this.mode, 0) : ""

    //your encryption key gen algorithm/pattern here
    return this.key.toString() + timeCode.toString();
  }
  GenerateDecryptionKey(level) {
    const timeCode = this.mode != "" ? this.GetTimeCode(this.mode, level) : ""

    //your decryption key gen algorithm/pattern here, must match encryption pattern
    return this.ReverseSequence(this.key + timeCode)
  }
  GenerateDecryptionKey_Enkey(enkey) {
    return this.ReverseSequence(enkey);
  }
  GetTimeCode(mode, level) {
    const dateNow = new Date()
    const dateByLevel = new Date(dateNow.getTime() - level * 60 * 1000)
    const dateTimeArr = dateByLevel
      .toLocaleString("en-US", { hour12: false, timeZone: 'UTC' })
      .split(", ")
    const dateArr = dateTimeArr[0].split("/")
    const timeArr = dateTimeArr[1].split(":")
    const months = dateArr[0].padStart(2, '0');
    const days = dateArr[1].padStart(2, '0');
    const years = dateArr[2]
    const hours = timeArr[0].padStart(2, '0');
    const minutes = timeArr[1].padStart(2, '0');

    switch (mode) {
      default:
      case "YMDHI":
        return (years + months + days + hours + minutes);
      case "MYDHI":
        return (months + years + days + hours + minutes);
      case "MDYHI":
        return (months + days + years + hours + minutes);
      case "MDHYI":
        return (months + days + hours + years + minutes);
      case "MDHIY":
        return (months + days + hours + minutes + years);
      case "DMHIY":
        return (days + months + hours + minutes + years);
      case "DHMIY":
        return (days + hours + months + minutes + years);
      case "DHIMY":
        return (days + hours + minutes + months + years);
      case "DHIYM":
        return (days + hours + minutes + years + months);
      case "HDIYM":
        return (hours + days + minutes + years + months);
      case "HIDYM":
        return (hours + minutes + days + years + months);
      case "HIYDM":
        return (hours + minutes + years + days + months);
      case "HIYMD":
        return (hours + minutes + years + months + days);
      case "IHYMD":
        return (minutes + hours + years + months + days);
      case "IYHMD":
        return (minutes + years + hours + months + days);
      case "IYMHD":
        return (minutes + years + months + hours + days);
      case "IYMDH":
        return (minutes + years + months + days + hours);
      case "YIMDH":
        return (years + minutes + months + days + hours);
      case "YMIDH":
        return (years + months + minutes + days + hours);
      case "YMDIH":
        return (years + months + days + minutes + hours);
    }
  }
  ReverseSequence(sequence) {
    let reversed = ""
    sequence.split("").map(s => {
      reversed = s + reversed
    })
    return reversed
  }
  ConvertToIndexArr(subject) {
    const indexArr = [] //char not in alphaNumMap will remain same character
    subject.split("").map(char => {
      if (nonstate.alphaNumMap.hasOwnProperty(char))
        indexArr.push(nonstate.alphaNumMap[char].toString())
      else indexArr.push(char)
    })
    return indexArr
  }
  ConvertFromIndexArr(indexArr) {
    const subjectArr = []
    const alphaNumMapValues = Object.values(nonstate.alphaNumMap)
    indexArr.map(index => {
      const indexInt = parseInt(index)
      if (!Number.isNaN(indexInt) && alphaNumMapValues.includes(indexInt)) {
        subjectArr.push(this.GetAlphaNumMapKey(indexInt))
      } else subjectArr.push(index)
    })
    return subjectArr.join("")
  }
  GetAlphaNumMapKey(value) {
    let key = ""
    Object.keys(nonstate.alphaNumMap).map(_key => {
      if (nonstate.alphaNumMap[_key] == value) key = _key
    })
    return key
  }
  ShuffleIndexArr(indexArr, key) {
    const shuffled = []
    const keyArr = key.split("").map(k => parseInt(k))

    indexArr.map(index => {
      const indexInt = parseInt(index)
      if (!Number.isNaN(indexInt)) {
        let _indexInt = parseInt(index)
        keyArr.map(k => {
          if (_indexInt + k <= nonstate.keyIndexMax) {
            _indexInt += k
          } else {
            _indexInt = _indexInt + k - nonstate.keyIndexMax
          }
        })
        shuffled.push(_indexInt.toString())
      } else {
        //not an index, put back as the same
        shuffled.push(index)
      }
    })
    return shuffled
  }
  UnShuffleIndexArr(indexArr, key) {
    const unShuffled = []
    const keyArr = key.split("").map(k => parseInt(k))

    indexArr.map(index => {
      const indexInt = parseInt(index)
      if (!Number.isNaN(indexInt)) {
        let _indexInt = parseInt(index)
        keyArr.map(k => {
          if (_indexInt - k >= nonstate.keyIndexMin) {
            _indexInt -= k
          } else {
            _indexInt = nonstate.keyIndexMax - (k - _indexInt)
          }
        })
        unShuffled.push(_indexInt.toString())
      } else {
        //non-index, put back as original
        unShuffled.push(index)
      }
    })
    return unShuffled
  }
}
export default InfinityEncryptor
