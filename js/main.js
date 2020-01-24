var wb, excelJson, rolling = -1,
    times, t, anti_cheat = false;

if (window.localStorage.data) {
    excelJson = JSON.parse(window.localStorage.data);
} else {
    $(".alert").alert();
}

if (window.localStorage.anti_cheat == "true") {
    anti_cheat = true;
    document.getElementById("defaultCheck1").checked = true;
}

function setting_apply() {
    if (document.getElementById("defaultCheck1").checked) {
        window.localStorage.anti_cheat = anti_cheat = true;
    } else {
        window.localStorage.anti_cheat = anti_cheat = false;
    }

}

function importf(obj) {
    if (!obj.files) {
        return;
    }
    let f = obj.files[0];
    document.querySelector(".custom-file-label").textContent = f.name;
    let reader = new FileReader();
    reader.onload = function(e) {
        let data = e.target.result;
        wb = XLSX.read(data, { type: 'binary' });
        excelJson = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        window.localStorage.data = JSON.stringify(excelJson);
    };
    reader.readAsBinaryString(f);
}

document.onkeydown = function(event) {
    if (event && event.keyCode == 13) {
        if (rolling == 1) {
            console.log("end");
            endroll();
        } else {
            console.log("start");
            if (rolling == -1) tail = $("div.card.align-middle");
            startroll();
        }
    }
}

function getCard(datas) {
    let data = datas[parseInt(Math.random() * datas.length, 10)];
    return data["no"] + '<br>' + data["name"];
}

function roll() {
    let cardText = getCard(excelJson);
    times++;
    card = $(
        '<div class="card card-roll" id="id-' +
        parseInt(times) +
        '">' +
        '<div class="title">' +
        cardText +
        '</div>' +
        '</div>'
    );
    //if (times == 100) rolling = false;
    //card.addId(`id-${times}`);
    if (times > 2) {
        let str = "id-" + parseInt(times - 2);
        console.log(str);
        let child = document.getElementById(str);
        //console.log(child);
        child.parentNode.removeChild(child);
    }
    //showCard(card, duration, slide);
    tail.after(card);
    tail = card;
}

function startroll() {
    console.log("gugugu");
    const duration = 200;
    rolling = 1;
    times = 0;
    t = setInterval(roll, duration);
}

function endroll() {
    rolling = 0;
    clearInterval(t);
    if (anti_cheat) {
        console.log("anti-cheat!");
        roll();
    }
}