function nextPage() {
    let {page, baseUri} = getCurrentPage();

    if (page >= 100) {
        alert('执行完成')
    } else {
        let nextUrl = baseUri + '&page=' + (page + 1);

        location.href = nextUrl;
    }

}

function getCurrentPage() {

    const d = /(\S+?)(?:\&page\=(\d+))/.exec(location.href);

    if (d) {
        return {
            baseUri: d[1],
            page: parseInt(d[2], 10),
        };
    } else {
        return {
            baseUri: location.href,
            page: 1,
        };
    }
}



function getDB() {
    const symbol = Symbol.for('db');
    if (! window[symbol]) {
        window[symbol] = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
    }
    return window[symbol];
}


function getTableName() {
    const symbol = Symbol.for('tableName');
    if (! window[symbol]) {
        const date = new Date();
        window[symbol] = 'caoliu_' + date.getYear() + (date.getMonth() + 1 ) + date.getDate();
    }
    return window[symbol];
}

function storeData(db, tableName, callback = null) {
    // body...

// db.transaction((tx) => tx.executeSql(`drop table ${tableName}`))

db.transaction(function (tx) {

    const fileds = ['id', 'link', 'fid', 'title', 'date', 'createTime', 'replyNum', 'authorName', 'authorLink'];

    tx.executeSql(`CREATE TABLE IF NOT EXISTS ${tableName} (${fileds.join(',')})`);

    const data = getData();


    let sql = `INSERT INTO ${tableName} (${fileds.join(',')}) VALUES `;

    sql += data
    .map((d) => {
        let s = [];
        for (const filed of fileds) {
            if (filed === 'id') {
                s.push(parseInt(d[filed], 10));
            } else {
                s.push(`"${(d[filed] + '').replace('"', '『')}"`);
            }

        }
        return `(${s.join(',')})`;
    })
    .join(',');

    tx.executeSql(sql, [], callback);


    // const ids = data.map((d) => d.id);

    // sql = `select id from ${tableName} where id in (${ids.join(',')})`;


    // var re = tx.executeSql(sql, [], function (tx, rs) {
    //     // body...
    //     console.log(rs);
    // });

});


}


function getData() {
    let data = [];
    document
    .getElementById('ajaxtable')
    .tBodies[1]
    .querySelectorAll('tr.tr3')
    .forEach((tr, i) => {
        let a = tr.querySelectorAll('td');
        if(a.length === 0) {
            return ;
        }
        const titleDOM = tr.children[1].querySelector('h3 a');
        const title = titleDOM.innerText;
        const link = titleDOM.href;
        const author = tr.children[2].querySelector('a');
        const createTime = tr.children[2].querySelector('.f10').innerText;
        const replyNum = parseInt(tr.children[3].innerText, 10);

        const pattern = /htm_data\/(\d+)\/(\d+)\/(\d+)\.html/;
        const re = pattern.exec(link);
        const [, fid, date, id] = re || [];

        data.push({
            id,
            link,
            fid,
            title,
            date,
            createTime,
            replyNum,
            authorName: author.innerText,
            authorLink: author.href,

        });

        //      || parseInt(a[0].innerText, 10) < 10
    });
    return data;
}

storeData(getDB(), getTableName(), function () {
    nextPage();
});


