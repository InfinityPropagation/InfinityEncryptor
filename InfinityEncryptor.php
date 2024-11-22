<?php
try {
    class InfinityEncryptor {
        private $nonstate = array(
            "alphaNumMap" => array(
                '0'=> 1,
                '1'=> 2,
                '2'=> 3,
                '3'=> 4,
                '4'=> 5,
                '5'=> 6,
                '6'=> 7,
                '7'=> 8,
                '8'=> 9,
                '9'=> 10,
                'a'=> 11,
                'b'=> 12,
                'c'=> 13,
                'd'=> 14,
                'e'=> 15,
                'f'=> 16,
                'g'=> 17,
                'h'=> 18,
                'i'=> 19,
                'j'=> 20,
                'k'=> 21,
                'l'=> 22,
                'm'=> 23,
                'n'=> 24,
                'o'=> 25,
                'p'=> 26,
                'q'=> 27,
                'r'=> 28,
                's'=> 29,
                't'=> 30,
                'u'=> 31,
                'v'=> 32,
                'w'=> 33,
                'x'=> 34,
                'y'=> 35,
                'z'=> 36,
                'A'=> 37,
                'B'=> 38,
                'C'=> 39,
                'D'=> 40,
                'E'=> 41,
                'F'=> 42,
                'G'=> 43,
                'H'=> 44,
                'I'=> 45,
                'J'=> 46,
                'K'=> 47,
                'L'=> 48,
                'M'=> 49,
                'N'=> 50,
                'O'=> 51,
                'P'=> 52,
                'Q'=> 53,
                'R'=> 54,
                'S'=> 55,
                'T'=> 56,
                'U'=> 57,
                'V'=> 58,
                'W'=> 59,
                'X'=> 60,
                'Y'=> 61,
                'Z'=> 62
            ),
            'keyIndexMin' => 1,
            'keyIndexMax' => 62,
            'prefix' => 'INFINITYENCRYPTOR'
        );

        public function __construct($key='88888888', $mode = 'YMDHI' /** default mode */) {
            $this->key = $key;
            $this->mode = $mode;
        }
        public function Encrypt($subject) {
            $enkey = str_replace('0', '1', $this->GenerateEncryptionKey());
            $subjectIndexArr = $this->ConvertToIndexArr($this->nonstate["prefix"] . ":;:" .$subject);
            $shuffledIndexArr = $this->ShuffleIndexArr($subjectIndexArr, $enkey);
            $encryptedString = $this->ConvertFromIndexArr($shuffledIndexArr);
            return $encryptedString;
        }
        public function Decrypt($subject) {
            $dekey;
            $subjectIndexArr; $unShuffledIndexArr; $decryptedString;
            $decryptedSubjectArr; $decryptedPrefix; $decryptedSubject = '';

            $dekey = str_replace('0', '1', $this->GenerateDecryptionKey(0));
            $subjectIndexArr = $this->ConvertToIndexArr($subject);
            $unShuffledIndexArr = $this->UnShuffleIndexArr($subjectIndexArr, $dekey);
            $decryptedString = $this->ConvertFromIndexArr($unShuffledIndexArr);
            $decryptedSubjectArr = explode(":;:", $decryptedString);
            $decryptedPrefix = $decryptedSubjectArr[0];

            if($decryptedPrefix == $this->nonstate["prefix"]) {
                //success decrypt at level 0
                $i = 0;
                foreach($decryptedSubjectArr as $decrypted) {
                    if($i != 0)
                        $decryptedSubject .= (strlen($decryptedSubject) == 0 ? $decrypted : ':;:' . $decrypted);
                    $i++;
                }
                return $decryptedSubject;
            } else {
                //trial decrypt at level 1
                //decrption level indicates whether the data is received ontime, or 1 minute late
                $dekey = str_replace('0', '1', $this->GenerateDecryptionKey(1)); 
                $subjectIndexArr = $this->ConvertToIndexArr($subject);
                $unShuffledIndexArr = $this->UnShuffleIndexArr($subjectIndexArr, $dekey);
                $decryptedString = $this->ConvertFromIndexArr($unShuffledIndexArr);
                $decryptedSubjectArr = explode(":;:", $decryptedString);
                $decryptedPrefix = $decryptedSubjectArr[0];
                
                if($decryptedPrefix == $this->nonstate["prefix"]) {
                    //success decrypt at level 1
                    $i = 0;
                    foreach($decryptedSubjectArr as $decrypted) {
                        if($i != 0)
                            $decryptedSubject .= (strlen($decryptedSubject) == 0 ? $decrypted : ':;:' . $decrypted);
                        $i++;
                    }
                    return $decryptedSubject;
                } else {
                    return 'IEncryptorDecrypt _false';
                }
            }

            // $dekey = $this->GenerateDecryptionKey();
            // $subjectIndexArr = $this->ConvertToIndexArr($subject);
            // $unShuffledIndexArr = $this->UnShuffleIndexArr($subjectIndexArr, $dekey);
            // $decryptedString = $this->ConvertFromIndexArr($unShuffledIndexArr);
            // return $decryptedString;
        }

        //privates
        private function GenerateEncryptionKey() {
            $timeCode = $this->mode != '' ? $this->GetTimeCode($this->mode, 0) : '';
    
            //your encryption key gen algorithm/pattern here
            return $this->key . $timeCode;
        }
        private function GenerateDecryptionKey($level) {
            $timeCode = $this->mode != '' ? $this->GetTimeCode($this->mode, $level) : '';
    
            //your decryption key gen algorithm/pattern here, must match encryption pattern
            return $this->ReverseSequence($this->key . $timeCode);
        }
        private function GetTimeCode($mode, $level) {
            $dateNow = date('Y-m-d H:i:s');
            $dateByLevel = new DateTime(date('Y-m-d H:i:s', strtotime($dateNow) - ($level * 60)));
            $dateByLevel->setTimeZone(new DateTimeZone('UTC'));

            $days = str_pad($dateByLevel->format('d'), 2, '0');
            $months = str_pad($dateByLevel->format('m'), 2, '0');
            $years = $dateByLevel->format('Y');
            $hours = str_pad($dateByLevel->format('H'), 2, '0');
            $minutes = str_pad($dateByLevel->format('i'), 2, '0');

            switch ($mode) {
                default:
                case 'YMDHI':
                    return $years . $months . $days . $hours . $minutes;
                case 'MYDHI':
                    return $months . $years . $days . $hours . $minutes;
                case 'MDYHI':
                    return $months . $days . $years . $hours . $minutes;
                case 'MDHYI':
                    return $months . $days . $hours . $years . $minutes;
                case 'MDHIY':
                    return $months . $days . $hours . $minutes . $years;
                case 'DMHIY':
                    return $days . $months . $hours . $minutes . $years;
                case 'DHMIY':
                    return $days . $hours . $months . $minutes . $years;
                case 'DHIMY':
                    return $days . $hours . $minutes . $months . $years;
                case 'DHIYM':
                    return $days . $hours . $minutes . $years . $months;
                case 'HDIYM':
                    return $hours . $days . $minutes . $years . $months;
                case 'HIDYM':
                    return $hours . $minutes . $days . $years . $months;
                case 'HIYDM':
                    return $hours . $minutes . $years . $days . $months;
                case 'HIYMD':
                    return $hours . $minutes . $years . $months . $days;
                case 'IHYMD':
                    return  $minutes . $hours  . $years. $months . $days;
                case 'IYHMD':
                    return  $minutes . $years . $hours . $months . $days;
                case 'IYMHD':
                    return  $minutes . $years . $months . $hours  . $days;
                case 'IYMDH':
                    return  $minutes . $years . $months . $days . $hours;
                case 'YIMDH':
                    return  $years . $minutes . $months . $days . $hours;
                case 'YMIDH':
                    return  $years . $months . $minutes . $days . $hours;
                case 'YMDIH':
                    return  $years . $months . $days  . $minutes . $hours;
            }
        }
        private function ReverseSequence($sequence) {
            $reversed = '';
            foreach(str_split($sequence) as $s) {
                $reversed = $s . $reversed;
            }
            return $reversed;
        }
        private function ConvertToIndexArr($subject) {
            $indexArr = []; //char not in alphaNumMap will remain same character
            foreach(str_split($subject) as $char) {
                if (array_key_exists($char, $this->nonstate["alphaNumMap"]))
                    array_push($indexArr, (string)$this->nonstate["alphaNumMap"][$char]);
                else
                    array_push($indexArr, $char);
            }
            return $indexArr;
        }
        private function ConvertFromIndexArr($indexArr) {
            $subjectArr = [];
            $alphaNumMapValues = array_values($this->nonstate["alphaNumMap"]);
            foreach($indexArr as  $index) {
                $indexInt = intval($index);

                if ($indexInt != 0 && in_array($indexInt, $alphaNumMapValues)) {
                    array_push($subjectArr, $this->GetAlphaNumMapKey($indexInt));
                }
                else
                    array_push($subjectArr, $index);
            }
            return implode('', $subjectArr);
        }
        private function GetAlphaNumMapKey($value) {
            $key = '';
            foreach(array_keys($this->nonstate["alphaNumMap"]) as $_key) {
                if($this->nonstate["alphaNumMap"][$_key] == $value) {
                    $key = $_key;
                    break;
                }
            }
            return $key;
        }
        private function ShuffleIndexArr($indexArr, $key) {
            $shuffled = [];
            $keyArr = [];
            foreach(str_split($key) as $k) {
                array_push($keyArr, intval($k));
            }

            foreach($indexArr as $index) {
                $indexInt = intval($index);
                if($indexInt != 0) {
                    $_indexInt = intval($index);
                    foreach($keyArr as $k) {
                        if ($_indexInt + $k <= $this->nonstate["keyIndexMax"]) {
                            $_indexInt += $k;
                        } else {
                            $_indexInt = ($_indexInt + $k - $this->nonstate["keyIndexMax"]);
                        }
                    }
                    array_push($shuffled, (string)$_indexInt);
                } else {
                    //not an index, put back as the same
                    array_push($shuffled, $index);
                }
            }
            return $shuffled;
        }
        private function UnShuffleIndexArr($indexArr, $key) {
            $unShuffled = [];
            $keyArr = [];
            foreach(str_split($key) as $k) {
                array_push($keyArr, intval($k));
            }

            foreach($indexArr as $index) {
                $indexInt = intval($index);
                if($indexInt != 0) {
                    $_indexInt = intval($index);
                    foreach($keyArr as $k) {
                        if ($_indexInt - $k >= $this->nonstate["keyIndexMin"]) {
                            $_indexInt -= $k;
                        } else {
                            $_indexInt = ($this->nonstate["keyIndexMax"]) - ($k - $_indexInt);
                        }
                    }
                    array_push($unShuffled, (string)$_indexInt);
                } else {
                    //not an index, put back as the same
                    array_push($unShuffled, $index);
                }
            }
            return $unShuffled;
        }
    }
} catch (Throwable $e) {
    echo $e;
}
?>