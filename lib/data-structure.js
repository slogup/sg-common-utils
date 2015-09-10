
var fs = require('fs');

function DataStructure() {

    this.binarySearch = function (value, orderedList) {

        if (orderedList.length == 0) {
            return -1;
        }

        if (orderedList.length == 1) {
            if (orderedList[0] == value) {
                return 0;
            }
            else {
                return -1;
            }
        }

        var start = 0;
        var end = orderedList.length - 1;
        var mid;

        while(start <= end) {

            mid = Math.floor((start + end) / 2);

            var comparedValue = orderedList[mid];

            if (comparedValue == value) {
                return mid;
            }
            else if (comparedValue < value) {
                start = mid + 1;
            }
            else {
                end = mid - 1;
            }
        }

        return -1;
    };

    this.Heap = function(aType){

        var _data = [];
        var _idx = 0;
        var _type = aType || 'min';

        function swap(aIdx1, aIdx2){

            var temp = _data[aIdx1];
            _data[aIdx1] = _data[aIdx2];
            _data[aIdx2] = temp;
        }

        this.sort = function(){
            var data = _data;
        };

        this.reset = function(){
            delete _data;
            _data = [];
            _idx = 0;
        };

        this.size = function(){
            return _idx;
        };

        this.insert = function(aVal, aObj){

            var curIdx = _idx;

            _data[curIdx] = {
                value : aVal,
                object : aObj
            };

            while(curIdx > 0){
                var comparedIdx;
                if (curIdx % 2 === 0) {
                    comparedIdx = (curIdx - 2) / 2;
                } else {
                    comparedIdx = (curIdx - 1) / 2;
                }

                var bSwap = false;
                if(_type === 'max'){
                    if(_data[curIdx].value > _data[comparedIdx].value){
                        bSwap = true;
                    }
                } else {
                    if(_data[curIdx].value < _data[comparedIdx].value){
                        bSwap = true;
                    }
                }

                if(bSwap){
                    swap(curIdx, comparedIdx);
                } else {
                    break;
                }

                curIdx = comparedIdx;
            }
            _idx++;
        };

        this.delete = function(){


            if(_idx === 0 && !_data[0]){
                return null;
            }

            var retObj = _data[0].object;

            var maxIdx = --_idx;

            _data[0] = _data[maxIdx];
            delete _data[maxIdx];
            maxIdx--;

            var curIdx = 0;

            while(curIdx < maxIdx){
                var comparedIdx;
                if(maxIdx >= curIdx * 2 + 2){
                    var bPlusOne = false;
                    if(_type === 'max'){
                        if (_data[curIdx * 2 + 1].value > _data[curIdx * 2 + 2].value){
                            bPlusOne = true;
                        }
                    } else {
                        if (_data[curIdx * 2 + 1].value <= _data[curIdx * 2 + 2].value){
                            bPlusOne = true;
                        }
                    }
                    if(bPlusOne){
                        comparedIdx = curIdx * 2 + 1;
                    } else {
                        comparedIdx = curIdx * 2 + 2;
                    }
                } else if(maxIdx === curIdx + 1){
                    comparedIdx = curIdx + 1;
                } else {
                    break;
                }

                var bSwap = false;
                if(_type === 'max'){
                    if(_data[curIdx].value < _data[comparedIdx].value){
                        bSwap = true;
                    }
                } else {
                    if(_data[curIdx].value > _data[comparedIdx].value){
                        bSwap = true;
                    }
                }

                if(bSwap){
                    swap(curIdx, comparedIdx);
                } else {
                    break;
                }

                curIdx = comparedIdx;
            }
            return retObj;
        };
    }
}

module.exports = new DataStructure();
