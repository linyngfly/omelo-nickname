const head_url = require('./res/head_url');

const LAN = {
    chinesse: 'chinese',
    vietnam: 'vietnam'
};

const SEX = {
    male: 0,
    female: 1
};


class GenNickname {
    constructor(lan = LAN.chinesse) {
        this._data = null;
        this._initData(lan);
    }

    setLan(lan) {
        if (this.lan[lan] == null) {
            throw 'set lan err';
        }
        this._initData(lan);
    }

    gen_boy() {
        return this._genInfo(SEX.male);
    }

    gen_girl() {
        return this._genInfo(SEX.female);
    }

    gen_random() {
        let sex = this._random_int(0, 1);
        return this._genInfo(sex);
    }

    _initData(lan) {
        this._data = [{
            nickname: require(`./res/nickname/${lan}_boys`),
            headUrl: head_url.boys
        }, {
            nickname: require(`./res/nickname/${lan}_girls`),
            headUrl: head_url.girls
        }];
    }

    _genInfo(sex) {
        let info = this._data[sex];
        let nickname = info.nickname[this._random_int(0, info.nickname.length - 1)];
        let headUrl = info.headUrl[this._random_int(0, info.headUrl.length - 1)];
        return {
            sex: sex,
            nickname: nickname,
            headUrl: headUrl
        };
    }

    _random_int(begin, end) {
        var num = begin + Math.random() * (end - begin + 1);
        num = Math.floor(num);
        if (num > end) {
            num = end;
        }
        return num;
    }
}

const genNickname = new GenNickname();
genNickname.lan = LAN;
genNickname.sex = SEX;

module.exports = genNickname;