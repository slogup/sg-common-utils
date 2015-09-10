var fs = require('fs');

function LogWriter() {

    this.write = function(filePath, data) {
        var date = new Date();
        date = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        data.date = date;
        var dataStr = JSON.stringify(data, null, 2) + '\n';
        console.error('logWriter error. filePath : ', filePath, ' ,filePath : ',dataStr);

        fs.open(filePath, 'a+', function(err, fd) {

            if (!err) {
                var buf = new Buffer(dataStr);
                var bufPos = 0;
                var bufLen = buf.length;
                var filePos = null;

                fs.write(fd, buf, bufPos, bufLen, filePos, function(err, data) {
                    if (err) return console.error('fail to writing file!!');
                });

            } else {
                console.error('logWirter error. file open : ', err);
            }
        });
    };

    this.write500 = function(data) {
        this.write('./logs/500.log', data);
    };

    this.writeAWS = function(data) {
        this.write('./logs/aws.log', data);
    };
}

module.exports = new LogWriter();
