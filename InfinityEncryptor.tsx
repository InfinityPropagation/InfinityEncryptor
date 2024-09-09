const nonstate = {
    alphaNumMap: {
        '0': 1,
        '1': 2,
        '2': 3,
        '3': 4,
        '4': 5,
        '5': 6,
        '6': 7,
        '7': 8,
        '8': 9,
        '9': 10,
        'a': 11,
        'b': 12,
        'c': 13,
        'd': 14,
        'e': 15,
        'f': 16,
        'g': 17,
        'h': 18,
        'i': 19,
        'j': 20,
        'k': 21,
        'l': 22,
        'm': 23,
        'n': 24,
        'o': 25,
        'p': 26,
        'q': 27,
        'r': 28,
        's': 29,
        't': 30,
        'u': 31,
        'v': 32,
        'w': 33,
        'x': 34,
        'y': 35,
        'z': 36,
        'A': 37,
        'B': 38,
        'C': 39,
        'D': 40,
        'E': 41,
        'F': 42,
        'G': 43,
        'H': 44,
        'I': 45,
        'J': 46,
        'K': 47,
        'L': 48,
        'M': 49,
        'N': 50,
        'O': 51,
        'P': 52,
        'Q': 53,
        'R': 54,
        'S': 55,
        'T': 56,
        'U': 57,
        'V': 58,
        'W': 59,
        'X': 60,
        'Y': 61,
        'Z': 62
    },
    keyIndexMin: 1,
    keyIndexMax: 62,
    prefix: 'INFINITYENCRYPTOR'
}

class InfinityEncryptor {
    private key: string = '88888888'; //0 is useless
    private mode: string = 'YMDHI'; //Y-year, M-month, D-date, H-hour, I-minute, if mode set to '' (empty), no time code will be generated

    constructor(key: string, mode?: string) {
        this.key = key.replace(/0/g, '');
        this.mode = (mode != undefined ? mode : 'YMDHI');
    }
    public Encrypt(subject: string) {
        const enkey = this.GenerateEncryptionKey();
        const subjectIndexArr = this.ConvertToIndexArr(nonstate.prefix + ':;:' + subject);
        const shuffledIndexArr = this.ShuffleIndexArr(subjectIndexArr, enkey);
        const encryptedString = this.ConvertFromIndexArr(shuffledIndexArr);
        return encryptedString;
    }
    public Decrypt(subject: string) {
        let dekey;
        let subjectIndexArr; let unShuffledIndexArr; let decryptedString;
        let decryptedSubjectArr; let decryptedPrefix; let decryptedSubject = '';

        //trial decrypt at level 0
        //decrption level indicates whether the data is received ontime, or 1 minute late
        dekey = this.GenerateDecryptionKey(0); 
        subjectIndexArr = this.ConvertToIndexArr(subject);
        unShuffledIndexArr = this.UnShuffleIndexArr(subjectIndexArr, dekey);
        decryptedString = this.ConvertFromIndexArr(unShuffledIndexArr);
        decryptedSubjectArr = decryptedString.split(':;:');
        decryptedPrefix = decryptedSubjectArr[0];

        if(decryptedPrefix == nonstate.prefix) {
            //success decrypt at level 0
            decryptedSubjectArr.map((decrypted: string, i: number) => {
                if(i != 0)
                    decryptedSubject += decrypted;
            });
            return decryptedSubject;
        } else {
            //trial decrypt at level 1
            //decrption level indicates whether the data is received ontime, or 1 minute late
            dekey = this.GenerateDecryptionKey(1); 
            subjectIndexArr = this.ConvertToIndexArr(subject);
            unShuffledIndexArr = this.UnShuffleIndexArr(subjectIndexArr, dekey);
            decryptedString = this.ConvertFromIndexArr(unShuffledIndexArr);
            decryptedSubjectArr = decryptedString.split(':;:');
            decryptedPrefix = decryptedSubjectArr[0];
            if(decryptedPrefix == nonstate.prefix) {
                //success decrypt at level 0
                decryptedSubjectArr.map((decrypted: string, i: number) => {
                    if(i != 0)
                        decryptedSubject += decrypted;
                });
                return decryptedSubject;
            } else {
                return '_false';
            }
        }
    }

    //privates
    private GenerateEncryptionKey() {
        const timeCode: string = (this.mode != '' ? this.GetTimeCode(this.mode, 0) : '');

        //your encryption key gen algorithm/pattern here
        return this.key + timeCode;
    }
    private GenerateDecryptionKey(level: number) {
        const timeCode: string = (this.mode != '' ? this.GetTimeCode(this.mode, level) : '');

        //your decryption key gen algorithm/pattern here, must match encryption pattern
        return this.ReverseSequence(this.key + timeCode);
    }
    private GetTimeCode(mode: string, level: number) {
        const dateNow = new Date();
        const dateByLevel = new Date(dateNow.getTime() - (level * 60 * 1000));
        const dateTimeArr = dateByLevel.toLocaleString('en-US', { hour12: false }).split(', ');
        const dateArr = dateTimeArr[0].split('/');
        const timeArr = dateTimeArr[1].split(':');
        const days = dateArr[0];
        const months = dateArr[1];
        const years = dateArr[2];
        const hours = timeArr[0];
        const minutes = timeArr[1];
        // const seconds = timeArr[2];

        /**
         * parseInt(years).toString()
         * parseInt(months).toString()
         * parseInt(days).toString()
         * (parseInt(hours) + 1).toString()   //0 isn't allowed, 1 - 24
         * (parseInt(minutes) + 1).toString() //0 isn't allowed, 1 - 61
         */

        switch (mode) {
            default:
            case 'YMDHI':
                return parseInt(years).toString() + parseInt(months).toString() + parseInt(days).toString() + (parseInt(hours) + 1).toString() + (parseInt(minutes) + 1).toString();
            case 'MYDHI':
                return parseInt(months).toString() + parseInt(years).toString() + parseInt(days).toString() + (parseInt(hours) + 1).toString() + (parseInt(minutes) + 1).toString();
            case 'MDYHI':
                return parseInt(months).toString() + parseInt(days).toString() + parseInt(years).toString() + (parseInt(hours) + 1).toString() + (parseInt(minutes) + 1).toString();
            case 'MDHYI':
                return parseInt(months).toString() + parseInt(days).toString() + (parseInt(hours) + 1).toString()  + parseInt(years).toString() + (parseInt(minutes) + 1).toString();
            case 'MDHIY':
                return parseInt(months).toString() + parseInt(days).toString() + (parseInt(hours) + 1).toString() + (parseInt(minutes) + 1).toString() + parseInt(years).toString();
            case 'DMHIY':
                return parseInt(days).toString() + parseInt(months).toString() + (parseInt(hours) + 1).toString() + (parseInt(minutes) + 1).toString() + parseInt(years).toString();
            case 'DHMIY':
                return parseInt(days).toString() + (parseInt(hours) + 1).toString() + parseInt(months).toString() + (parseInt(minutes) + 1).toString() + parseInt(years).toString();
            case 'DHIMY':
                return parseInt(days).toString() + (parseInt(hours) + 1).toString() + (parseInt(minutes) + 1).toString() + parseInt(months).toString() + parseInt(years).toString();
            case 'DHIYM':
                return parseInt(days).toString() + (parseInt(hours) + 1).toString() + (parseInt(minutes) + 1).toString() + parseInt(years).toString() + parseInt(months).toString();
            case 'HDIYM':
                return (parseInt(hours) + 1).toString() + parseInt(days).toString() + (parseInt(minutes) + 1).toString() + parseInt(years).toString() + parseInt(months).toString();
            case 'HIDYM':
                return (parseInt(hours) + 1).toString() + (parseInt(minutes) + 1).toString() + parseInt(days).toString() + parseInt(years).toString() + parseInt(months).toString();
            case 'HIYDM':
                return (parseInt(hours) + 1).toString() + (parseInt(minutes) + 1).toString() + parseInt(years).toString() + parseInt(days).toString() + parseInt(months).toString();
            case 'HIYMD':
                return (parseInt(hours) + 1).toString() + (parseInt(minutes) + 1).toString() + parseInt(years).toString() + parseInt(months).toString() + parseInt(days).toString();
            case 'IHYMD':
                return  (parseInt(minutes) + 1).toString() + (parseInt(hours) + 1).toString() + parseInt(years).toString() + parseInt(months).toString() + parseInt(days).toString();
            case 'IYHMD':
                return  (parseInt(minutes) + 1).toString() + parseInt(years).toString() + (parseInt(hours) + 1).toString() + parseInt(months).toString() + parseInt(days).toString();
            case 'IYMHD':
                return  (parseInt(minutes) + 1).toString() + parseInt(years).toString() + parseInt(months).toString() + (parseInt(hours) + 1).toString() + parseInt(days).toString();
            case 'IYMDH':
                return  (parseInt(minutes) + 1).toString() + parseInt(years).toString() + parseInt(months).toString() + parseInt(days).toString() + (parseInt(hours) + 1).toString();
            case 'YIMDH':
                return  parseInt(years).toString() + (parseInt(minutes) + 1).toString() + parseInt(months).toString() + parseInt(days).toString() + (parseInt(hours) + 1).toString();
            case 'YMIDH':
                return  parseInt(years).toString() + parseInt(months).toString() + (parseInt(minutes) + 1).toString() + parseInt(days).toString() + (parseInt(hours) + 1).toString();
            case 'YMDIH':
                return  parseInt(years).toString() + parseInt(months).toString() + parseInt(days).toString()  + (parseInt(minutes) + 1).toString() + (parseInt(hours) + 1).toString();
        }
    }
    private ReverseSequence(sequence: string) {
        let reversed: string = '';
        sequence.split('').map((s: string) => {
            reversed = s + reversed;
        });
        return reversed;
    }
    private ConvertToIndexArr(subject: string) {
        const indexArr: string[] = []; //char not in alphaNumMap will remain same character
        subject.split('').map((char: string) => {
            if (nonstate.alphaNumMap.hasOwnProperty(char))
                indexArr.push(nonstate.alphaNumMap[char as keyof typeof nonstate.alphaNumMap].toString());
            else
                indexArr.push(char);
        });
        return indexArr;
    }
    private ConvertFromIndexArr(indexArr: string[]) {
        const subjectArr: string[] = [];
        const alphaNumMapValues = Object.values(nonstate.alphaNumMap);
        indexArr.map((index: string) => {
            const indexInt = parseInt(index);
            if (!Number.isNaN(indexInt) && alphaNumMapValues.includes(indexInt)) {
                subjectArr.push(this.GetAlphaNumMapKey(indexInt));
            }
            else
                subjectArr.push(index);
        });
        return subjectArr.join('');
    }
    private GetAlphaNumMapKey(value: number) {
        let key: string = '';
        Object.keys(nonstate.alphaNumMap).map((_key: string) => {
            if (nonstate.alphaNumMap[_key as keyof typeof nonstate.alphaNumMap] == value)
                key = _key;
        });
        return key;
    }
    private ShuffleIndexArr(indexArr: string[], key: string) {
        const shuffled: string[] = [];
        const keyArr: number[] = key.split('').map((k: string) => parseInt(k));

        indexArr.map((index: string) => {
            const indexInt = parseInt(index);
            if (!Number.isNaN(indexInt)) {
                let _indexInt = parseInt(index);
                keyArr.map((k: number) => {
                    if (_indexInt + k <= nonstate.keyIndexMax) {
                        _indexInt += k;
                    } else {
                        _indexInt = (_indexInt + k - nonstate.keyIndexMax);
                    }
                });
                shuffled.push(_indexInt.toString());
            } else {
                //not an index, put back as the same
                shuffled.push(index);
            }
        });
        return shuffled;
    }
    private UnShuffleIndexArr(indexArr: string[], key: string) {
        const unShuffled: string[] = [];
        const keyArr: number[] = key.split('').map((k: string) => parseInt(k));

        indexArr.map((index: string) => {
            const indexInt = parseInt(index);
            if (!Number.isNaN(indexInt)) {
                let _indexInt = parseInt(index);
                keyArr.map((k: number) => {
                    if (_indexInt - k >= nonstate.keyIndexMin) {
                        _indexInt -= k;
                    } else {
                        _indexInt = (nonstate.keyIndexMax) - (k - _indexInt);
                    }
                });
                unShuffled.push(_indexInt.toString());
            } else {
                //non-index, put back as original
                unShuffled.push(index);
            }
        });
        return unShuffled;
    }
}
export default InfinityEncryptor;