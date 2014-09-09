/**
 * Created by Fyfar on 01.09.2014.
 */
function getProfile() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/profile/', true);
    xhr.onreadystatechange = function () {
        if (this.readyState != 4) return;
        if (this.status != 200) {
            alert('Error ' + xhr.status + ' ' + xhr.statusText);
            return;
        }
        alert(xhr.responseText);
    };
    xhr.send(null);
}

function addDataToTables(info) {
    var list = document.getElementById('list');
    var result = info;

    function addToList(item, arr) {
        var sub_li1 = document.createElement('li');
        var sub_li2 = document.createElement('li');
        var sub_li3 = document.createElement('li');

        sub_li1.appendChild(document.createTextNode(numericToDate(arr.date)));
        sub_li2.appendChild(document.createTextNode(capitalize(item.activity)));
        sub_li3.innerHTML = secondToHHMM(item.duration);
        sub_li3.onmouseover = function () {
            if (item.steps !== undefined) {
                this.innerHTML = '<span>' + item.steps + '</span>' + ' steps';
            } else {
                this.innerHTML = '<span>' + item.distance + '</span>' + ' meters';
            }
        };
        sub_li3.onmouseout = function () {
            this.innerHTML = secondToHHMM(item.duration);
        };

        var sub_list = document.createElement('ul');
        sub_list.className = 'sub-list';

        sub_list.appendChild(sub_li1);
        sub_list.appendChild(sub_li2);
        sub_list.appendChild(sub_li3);

        var li = document.createElement('li');
        li.appendChild(sub_list);
        list.appendChild(li);
    }

    var index = result.length;
    for (var el_index in result) {
        for (var summ_index in result[--index].summary) {
            addToList(result[index].summary[summ_index], result[index]);
        }
    }
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function numericToDate(numeric, pretty) {
    if (pretty) {
        return new Date(
            numeric.substring(0, 4),
            (numeric.substring(4, 6) - 1),
            numeric.substring(6, 8)
        ).toDateString();
    }
    return new Date(
        numeric.substring(0, 4),
        (numeric.substring(4, 6) - 1),
        numeric.substring(6, 8)
    ).toLocaleDateString();
}

function secondToHHMM(second) {
    var totalSec = second;
    var hours = parseInt(totalSec / 3600) % 24;
    var minutes = parseInt(totalSec / 60) % 60;
    var result = '';

    if (hours > 0) {
        result += '<span>' + hours + '</span>' + ' hr ';
    }
    if (minutes > 0) {
        result += '<span>' + minutes + '</span>' + ' min';
    }

    return result;
}

function addDataToChart(info) {
    var ctx = document.getElementById("canvas-area").getContext("2d");
    var barChartData = {
        labels: [],
        datasets: [
            {
                fillColor: "rgba(0,200,88,0.8)",
                strokeColor: "rgba(220,220,220,0.8)",
                highlightFill: "rgba(0,200,88,1)",
                highlightStroke: "rgba(220,220,220,1)",
                data: []
            }
        ]
    };

    var results = info;

    function addToChart(item, arr) {
        if (item.steps !== undefined) {
            barChartData.labels.push(numericToDate(arr.date, true));
            barChartData.datasets[0].data.push(item.steps);
        }
    }

    var index = results.length;
    for (var el_index in results) {
        for (var summ_index in results[--index].summary) {
            addToChart(results[index].summary[summ_index], results[index]);
        }
    }
    window.chart = new Chart(ctx).Bar(barChartData);
}

function getPastDaysInfo(countDays, callback) {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', '/api/summaries/past_days/' + countDays, true);
    xhr.onreadystatechange = function () {
        if (this.readyState != 4) return;
        if (this.status != 200) {
            console.log('Error ' + xhr.status + ' ' + xhr.statusText);
            return;
        }

        callback(JSON.parse(xhr.responseText));
    };
    xhr.send(null);
}

function setInfo() {
    getPastDaysInfo(10, function (info) {
        addDataToTables(info.slice(-5));
        addDataToChart(info);
    });
}

window.onload = setInfo();