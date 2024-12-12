import datetime;
import math;

class InfinityEncryptor:
    def __init__(self, key, mode):
        try:
            self.key = key.replace("0","");
        except:
            self.key = "88888888"; #0 is useless
        try:
            self.mode =  mode;
        except:
            self.mode = "YMDHI"; #Y-year, M-month, D-date, H-hour, I-minute, if mode set to '' (empty), no time code will be generated
        self.nonstate = {
            'alphaNumMap': {
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
                "a": 11,
                "b": 12,
                "c": 13,
                "d": 14,
                "e": 15,
                "f": 16,
                "g": 17,
                "h": 18,
                "i": 19,
                "j": 20,
                "k": 21,
                "l": 22,
                "m": 23,
                "n": 24,
                "o": 25,
                "p": 26,
                "q": 27,
                "r": 28,
                "s": 29,
                "t": 30,
                "u": 31,
                "v": 32,
                "w": 33,
                "x": 34,
                "y": 35,
                "z": 36,
                "A": 37,
                "B": 38,
                "C": 39,
                "D": 40,
                "E": 41,
                "F": 42,
                "G": 43,
                "H": 44,
                "I": 45,
                "J": 46,
                "K": 47,
                "L": 48,
                "M": 49,
                "N": 50,
                "O": 51,
                "P": 52,
                "Q": 53,
                "R": 54,
                "S": 55,
                "T": 56,
                "U": 57,
                "V": 58,
                "W": 59,
                "X": 60,
                "Y": 61,
                "Z": 62
            },
            "keyIndexMin": 1,
            "keyIndexMax": 62,
            "prefix": "INFINITYENCRYPTOR"
        };

    #PUBLICS
    def Encrypt(self, subject):
        enkey = self.GenerateEncryptionKey().replace("0", '1');
        subjectIndexArr  = self.ConvertToIndexArr(
            self.nonstate['prefix'] + ':;:' + subject
        );
        shuffledIndexArr = self.ShuffleIndexArr(subjectIndexArr, enkey);
        encryptedString = self.ConvertFromIndexArr(shuffledIndexArr)
        return encryptedString;

    def Decrypt(self, subject):
        dekey = self.GenerateDecryptionKey(0).replace('0', '1');
        subjectIndexArr  = self.GenerateDecryptionKey(0).replace('0', '1');
        unShuffledIndexArr = self.UnShuffleIndexArr(subjectIndexArr, dekey);
        decryptedString = self.ConvertFromIndexArr(unShuffledIndexArr);
        decryptedSubjectArr = decryptedString.split(":;:");
        decryptedPrefix = decryptedSubjectArr[0];
        decryptedSubject =  "";
        
        if decryptedPrefix == self.nonstate['prefix']:
            #success decrypt at level 0
            i = 0;
            for decrypted in decryptedSubjectArr:
                if i != 0:
                    if len(decryptedSubject) == 0:
                        decryptedSubject += decrypted;
                    else :
                        decryptedSubject += ':;:' + decrypted;
                i += 1;
            return decryptedSubject;
        else:
            # trial decrypt at level 1
            # decryption level indicates whethher the data is received ontime, or 1 minute late
            dekey = self.GenerateDecryptionKey(1).replace('0', '1');
            subjectIndexArr = self.ConvertToIndexArr(subject)
            unShuffledIndexArr = self.UnShuffleIndexArr(subjectIndexArr, dekey)
            decryptedString = self.ConvertFromIndexArr(unShuffledIndexArr)
            decryptedSubjectArr = decryptedString.split(":;:")
            decryptedPrefix = decryptedSubjectArr[0]
            if decryptedPrefix == self.nonstate['prefix']:
                # success decrypt at level 0
                i = 0;
                for decrypted in decryptedSubjectArr:
                    if i != 0:
                        if len(decryptedSubject) == 0:
                            decryptedSubject += decrypted;
                        else:
                            decryptedSubject += ':;:' + decrypted;
                    i += 1;
                return decryptedSubject
            else :
                return "IEncryptorDecrypt _false";

    #PRIVATES
    def GenerateEncryptionKey(self):
        if self.mode != "":
            timeCode = self.GetTimeCode(self.mode, 0);
        else:
            timeCode = "";
        
        #your encryption key gen algorithm/pattern here
        return str(self.key) + str(timeCode);

    def GenerateDecryptionKey(self, level):
        if self.mode != "":
            timeCode = self.GetTimeCode(self.mode, level);
        else:
            timeCode = "";

        # your decryption key gen algorithm/pattern here, must match encryption pattern
        return self.ReverseSequence(str(self.key) + str(timeCode));
        
    def GetTimecode(self, mode, level):
        dateNow = datetime.datetime.now();
        dateByLevel = dateNow - datetime.timedelta(minutes=level);
        dateByLevelUtc = dateByLevel.astimezone(datetime.timezone.utc);
        dateStr = dateByLevelUtc.strftime("%Y-%m-%d %H:%M:%S");
        dateTimeArr = dateStr.split(" ");
        dateArr = dateTimeArr[0].split('/');
        timeArr = dateTimeArr[1].split(':');
        months = dateArr[0].zfill(2);
        days = dateArr[1].zfill(2);
        years = dateArr[2];
        hours = timeArr[0].zfill(2);
        minutes = timeArr[1].zfill(2);

        if mode == "YMDHI":
            return (years + months + days + hours + minutes);
        elif mode == "MYDHI":
            return (months + years + days + hours + minutes);
        elif mode == "MDYHI":
            return (months + days + years + hours + minutes);
        elif mode == "MDHYI":
            return (months + days + hours + years + minutes);
        elif mode == "MDHIY":
            return (months + days + hours + minutes + years);
        elif mode == "DMHIY":
            return (days + months + hours + minutes + years);
        elif mode == "DHMIY":
            return (days + hours + months + minutes + years);
        elif mode == "DHIMY":
            return (days + hours + minutes + months + years);
        elif mode == "DHIYM":
            return (days + hours + minutes + years + months);
        elif mode == "HDIYM":
            return (hours + days + minutes + years + months);
        elif mode == "HIDYM":
            return (hours + minutes + days + years + months);
        elif mode == "HIYDM":
            return (hours + minutes + years + days + months);
        elif mode == "HIYMD":
            return (hours + minutes + years + months + days);
        elif mode == "IHYMD":
            return (minutes + hours + years + months + days);
        elif mode == "IYHMD":
            return (minutes + years + hours + months + days);
        elif mode == "IYMHD":
            return (minutes + years + months + hours + days);
        elif mode == "IYMDH":
            return (minutes + years + months + days + hours);
        elif mode == "YIMDH":
            return (years + minutes + months + days + hours);
        elif mode == "YMIDH":
            return (years + months + minutes + days + hours);
        elif mode == "YMDIH":
            return (years + months + days + minutes + hours);

    def ReverseSequence(self, sequence):
        reversed = "";
        sequences = sequence.split("");
        for s in sequences:
            reversed = s + reversed;
        return reversed;

    def ConvertToIndexArr(self, subject):
        indexArr = []; #char not in alphaNumMap will remain same character
        subjects = subject.split("");
        for char in subjects:
            if self.nonstate['alphaNumMap'].get(char) != None:
                indexArr.append(str(self.nonstate['alphaNumMap'][char]));
            else:
                indexArr.append(char);
        return indexArr;

    def  ConvertFormIndexArr(self, indexArr):
        subjectArr = [];
        alphaNumMapValues = self.nonstate['alphaNumMap'].values();
        for index in indexArr:
            indexInt = int(index);
            if not math.isnan(indexInt) and indexInt in alphaNumMapValues:
                subjectArr.append(self.GetAlphaNumMapKey(indexInt));
            else:
                subjectArr.append(index);
        return "".join(subjectArr);

    def GetAlphaNumMapKey(self, value):
        key= "";
        keys = self.nonstate['alphaNumMap'].keys();
        for _key in keys:
            if self.nonstate['alphaNumMap'][_key] == value:
                key = _key;
                break;
        return key;

    def ShuffleIndexArr(self, indexArr, key):
        shuffled = [];
        keys = key.split("");
        keyArr = [];
        for k in keys:
            keyArr.append(int(k));

        for index in indexArr:
            indexInt = int(index);
            if not math.isnan(indexInt):
                _indexInt = int(index);
                for k  in keyArr:
                    if _indexInt + k <= self.nonstate['keyIndexMax']:
                        _intedInt += k;
                    else:
                        _indexInt  = _indexInt + k - self.nonstate['keyIndexMax'];
                suffled.append(str(_indexInt));
            else:
                #not an index, put back as the same
                shuffled.append(index);
        return shuffled;

    def UnShuffleIndexArr(self, indexArr, key):
        unShuffled = [];
        keys = key.split("");
        keyArr = [];
        for k in keys:
            keyArr.append(k);

        for index in indexArr:
            indexInt = int(index);
            if not math.isnan(indexInt):
                _indexInt = int(index);
                for k in keyArr:
                    if _indexInt - k >= self.nonstate['keyIndexMin']:
                        _indexInt -= k;
                    else:
                        _indexInt = self.nonstate['keyIndexMax'] - (k - _indexInt);
                unShuffled.append(str(_indexInt));
            else:
                #non-index, put back as original
                unShuffled.append(index);
        return unShuffled;
