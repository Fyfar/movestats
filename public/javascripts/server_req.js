/**
 * Created by Fyfar on 01.09.2014.
 */

$(document).ready(function () {
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
    var ctx = $('#canvas-area').get(0).getContext("2d");
    var chart = null;

    function addToData(item, arr) {
        if (item === null) {
            barChartData.labels.push(numericToDate(arr.date, true));
            barChartData.datasets[0].data.push(0);
        } else {
            if (item.steps !== undefined) {
                barChartData.labels.push(numericToDate(arr.date, true));
                barChartData.datasets[0].data.push(item.steps);
            }
        }
    }

    function addDataToChart(info, update) {
        if (update) {
            barChartData.labels = [];
            barChartData.datasets[0].data = [];
        }

        var results = info;
        for (var i = results.length - 1; i >= 0; i--) {
            if (results[i].summary === null) {
                addToData(null, results[i]);
            } else {
                for (var summ_index in results[i].summary) {
                    addToData(results[i].summary[summ_index], results[i]);
                }
            }
        }
        if (update) {
            chart.destroy();
        }
        document.getElementById('steps').innerHTML = sumSteps(info) + ' steps';
        document.getElementById('distance').innerHTML = sumDistance(info) + ' meters';
        chart = new Chart(ctx).Bar(barChartData);
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

    document.getElementById('month').onclick = function () {
        getMonthInfo(function (info) {
            addDataToChart(info, true);
        });
    };
    document.getElementById('week').onclick = function () {
        getWeekInfo(function (info) {
            addDataToChart(info, true);
        })
    };

    (function () {
        getWeekInfo(function (info) {
            addDataToTables(info.slice(-5), false);
            addDataToChart(info, false);
        });
    })();
});

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

function getWeekInfo(callback) {
    var weekNumber = new Date().getWeek();
    var date = new Date();
    var dateWeek = date.getFullYear() + '-W' + weekNumber;

    var xhr = new XMLHttpRequest();

    xhr.open('GET', '/api/summaries/week/' + dateWeek, true);
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

function getMonthInfo(callback) {
    var date = new Date();
    var dateWeek = date.getFullYear() + '';
    if (date.getMonth() < 9) {
        dateWeek += '0' + (date.getMonth() + 1);
    } else {
        dateWeek += (date.getMonth() + 1);
    }

    var xhr = new XMLHttpRequest();

    xhr.open('GET', '/api/summaries/month/' + dateWeek, true);
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

function sumSteps(info) {
    var steps = 0;
    for (var i = 0; i <= info.length - 1; i++) {
        if (info[i].summary === null) continue;
        if (info[i].summary[0].steps !== undefined) {
            steps += info[i].summary[0].steps;
        }
    }
    return steps;
}

function sumDistance(info) {
    var meters = 0;
    for (var i = 0; i <= info.length - 1; i++) {
        if (info[i].summary === null) continue;
        if (info[i].summary[0].distance !== undefined) {
            meters += info[i].summary[0].distance;
        }
    }
    return meters;
}

Date.prototype.getWeek = function () {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((this - onejan) / 86400000 / 7);
};