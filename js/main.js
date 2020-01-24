var wb, excelJson, rolling = -1,
    times, t, anti_cheat = false,
    name_number, duration = 200;

if (window.localStorage.data) {
    excelJson = JSON.parse(window.localStorage.data);
} else {
    $(".alert").alert();
}

if (window.localStorage.anti_cheat == "true") {
    anti_cheat = true;
    document.getElementById("defaultCheck1").checked = true;
}

if (window.localStorage.name_number) {
    name_number = window.localStorage.name_number;
    document.getElementById("name_number").selectedIndex = window.localStorage.name_number - 1;
}

function setting_apply() {
    if (document.getElementById("defaultCheck1").checked) {
        window.localStorage.anti_cheat = anti_cheat = true;
    } else {
        window.localStorage.anti_cheat = anti_cheat = false;
    }
    let obj = document.getElementById("name_number");
    let index = obj.selectedIndex;
    window.localStorage.name_number = name_number = obj.options[index].value;
}

function refresh_card() {
    times = 0;
    tail = $("div.card.align-middle");
    let child = document.getElementsByClassName("card card-roll");
    //console.log(child);
    let len = child.length - 1;
    while (len--) child[1].parentNode.removeChild(child[1]);
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
    return data["type"] + '<br>' + data["no"] + '<br>' + data["name"];
}


function roll() {
    let cardString;
    let cardText = new Array();
    cardString = '<div class="card card-roll" id="id-' +
        parseInt(times) +
        '">' +
        '<div class="row">';
    times++;
    for (let i = 1; i <= name_number; i++) {
        cardText[i] = getCard(excelJson);
        for (let j = 1; j < i; j++) {
            while (cardText[i] == cardText[j]) {
                cardText[i] = getCard(excelJson);
                j = 0;
            }
        }
        cardString += '<div class="title col-sm">' +
            cardText[i] +
            '</div>';
    }
    cardString += '</div>' + '</div>'
    //console.log(cardString);
    card = $(cardString);
    //if (times == 100) rolling = false;
    //card.addId(`id-${times}`);
    tail.after(card);
    tail = card;
    if (times > 3) {
        let str = "id-" + parseInt(times - 3);
        //console.log(str);
        let child = document.getElementById(str);
        //console.log(child);
        child.parentNode.removeChild(child);
    }
}

function startroll() {
    //console.log("gugugu");
    rolling = 1;
    times = 0;
    t = setInterval(roll, duration);
}

function endroll() {
    rolling = 0;
    clearInterval(t);
    if (anti_cheat) {
        console.log("anti-cheat!");
        setTimeout(function() {
            roll();
        }, duration / 1.5);
    }
}