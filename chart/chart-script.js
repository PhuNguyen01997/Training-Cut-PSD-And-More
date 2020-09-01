$(document).ready(function(){
    var chartPara = {
        bar: {
            year: {
                // sum: getSumArr(chartPara.bar.year.data),
                sum: 1829,
                data: [
                    getRandomNum(100,400),
                    getRandomNum(100,400),
                    getRandomNum(100,400),
                    getRandomNum(100,400),
                    getRandomNum(100,400),
                    getRandomNum(100,400),
                ]
            },
            month: {
                // sum: getSumArr(chartPara.bar.month.data),
                sum: 1173,
                data: [
                    getRandomNum(100,400),
                    getRandomNum(100,400),
                    getRandomNum(100,400),
                    getRandomNum(100,400),
                    getRandomNum(100,400),
                    getRandomNum(100,400),
                ]
            },
            day: {
                // sum: getSumArr(chartPara.bar.daily.data),
                sum: 486,
                data: [
                    getRandomNum(100,400),
                    getRandomNum(100,400),
                    getRandomNum(100,400),
                    getRandomNum(100,400),
                    getRandomNum(100,400),
                    getRandomNum(100,400),
                ]
            },
        },
        doughnut: {
            year: {
                sum: "13,6",
                data: [50, 24, 20, 6],
                revenue: getRandomNum(30,100),
                sales: getRandomNum(100,400),
                contracts: getRandomNum(5,18),
            },
            month: {
                sum: "8,25",
                data: [36, 13, 7, 44],
                revenue: getRandomNum(30,100),
                sales: getRandomNum(100,400),
                contracts: getRandomNum(5,18),
            },
            day: {
                sum: "10,74",
                data: [30, 32, 20, 18],
                revenue: getRandomNum(30,100),
                sales: getRandomNum(100,400),
                contracts: getRandomNum(5,18),
            },
        },
    };
    var barSum = document.querySelector(".chart__column-2 .chart__content--sum h2");
    var arrDoughnutNote = document.querySelectorAll(".chart__column-3 .chart__content--note li:not(.note-from-chart) span");
    var doughnutRevenue = document.querySelector(".chart__column-3 .chart__footer--item:nth-child(1) h3 span");
    var doughnutSales = document.querySelector(".chart__column-3 .chart__footer--item:nth-child(2) h3");
    var doughnutContracts = document.querySelector(".chart__column-3 .chart__footer--item:nth-child(3) h3");
    const timeAni = 800;

    function animateValue(domElem, start, end, duration) {        // This function make animation change value number
        // assumes integer values for start and end

        var obj = domElem;
        var range = end - start;
        // no timer shorter than 50ms (not really visible any way)
        var minTimer = 50;
        // calc step time to show all interediate values
        var stepTime = Math.abs(Math.floor(duration / range));

        // never go below minTimer
        stepTime = Math.max(stepTime, minTimer);

        // get current time and calculate desired end time
        var startTime = new Date().getTime();
        var endTime = startTime + duration;
        var timer;

        function run() {
            var now = new Date().getTime();
            var remaining = Math.max((endTime - now) / duration, 0);
            var value = Math.round(end - (remaining * range));
            obj.innerHTML = value;
            if (value == end) {
                clearInterval(timer);
            }
        }

        timer = setInterval(run, stepTime);
        run();
    }
    function getRandomNum(min, max){
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    function setValue(elemContainer){
        let range;
        let type = elemContainer.dataset.type; // bar, doughnut
        if( !event.target.dataset ){ // Khi click thì mới có target.dataset, còn khi mới load trang thì target = #document, mà #document thì k có attr [data-...]
            range = "year";
        }else{
            range = event.target.dataset.value; // year, month, day
        }
        
        const objValue = chartPara[type][range];
        if(type === "bar"){
            // edit value in DomHTML
            animateValue(barSum, barSum.textContent, objValue.sum, timeAni);
            //Edit value from chart
            myChartBar.data.datasets[0].data = objValue.data;
            myChartBar.update({
                duration: timeAni,
                easing: 'easeOutBounce'
            });
        }
        if(type === "doughnut"){
            // edit value in DomHTML
            animateValue(doughnutRevenue, doughnutRevenue.textContent, objValue.revenue, timeAni);
            animateValue(doughnutSales, doughnutSales.textContent, objValue.sales, timeAni);
            animateValue(doughnutContracts, doughnutContracts.textContent, objValue.contracts, timeAni);
            arrDoughnutNote.forEach( (li,index) => {
                animateValue(li, li.textContent, objValue.data[index], timeAni);
            });
            //Edit value from chart
            myChartDoughnut.data.datasets[0].data = objValue.data;
            myChartDoughnut.options.elements.center.text = `$${objValue.sum}k`;
            myChartDoughnut.update({
                duration: timeAni,
                easing: 'easeOutBounce'
            });
        }
    };
    document.querySelectorAll(".chart__grid-item--pagi").forEach( pagiContainer => setValue(pagiContainer));
    document.querySelectorAll(".chart__grid-item--pagi").forEach( pagiContainer => pagiContainer.addEventListener("click",
        () => {
            setValue(pagiContainer);
        }
    ));
    
});

// - Text In Center Doughnut chart
Chart.pluginService.register({
    beforeDraw: function (chart) {
        if (chart.config.options.elements.center) {
            // Get ctx from string
            var ctx = chart.chart.ctx;

            // Get options from the center object in options
            var centerConfig = chart.config.options.elements.center;
            var fontStyle = centerConfig.fontStyle || 'Arial';
            var txt = centerConfig.text;
            var color = centerConfig.color || '#000';
            var maxFontSize = centerConfig.maxFontSize || 75;
            var sidePadding = centerConfig.sidePadding || 20;
            var sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)
            // Start with a base font of 30px
            ctx.font = "30px " + fontStyle;

            // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
            var stringWidth = ctx.measureText(txt).width;
            var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

            // Find out how much the font can grow in width.
            var widthRatio = elementWidth / stringWidth;
            var newFontSize = Math.floor(30 * widthRatio);
            var elementHeight = (chart.innerRadius * 2);

            // Pick a new font size so it will not be larger than the height of label.
            var fontSizeToUse = Math.min(newFontSize, elementHeight, maxFontSize);
            var minFontSize = centerConfig.minFontSize;
            var lineHeight = centerConfig.lineHeight || 25;
            var wrapText = false;

            if (minFontSize === undefined) {
                minFontSize = 20;
            }

            if (minFontSize && fontSizeToUse < minFontSize) {
                fontSizeToUse = minFontSize;
                wrapText = true;
            }

            // Set font settings to draw it correctly.
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
            var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
            ctx.font = fontSizeToUse + "px " + fontStyle;
            ctx.fillStyle = color;

            if (!wrapText) {
                ctx.fillText(txt, centerX, centerY);
                return;
            }

            var words = txt.split(' ');
            var line = '';
            var lines = [];

            // Break words up into multiple lines if necessary
            for (var n = 0; n < words.length; n++) {
                var testLine = line + words[n] + ' ';
                var metrics = ctx.measureText(testLine);
                var testWidth = metrics.width;
                if (testWidth > elementWidth && n > 0) {
                    lines.push(line);
                    line = words[n] + ' ';
                } else {
                    line = testLine;
                }
            }

            // Move the center up depending on line height and number of lines
            centerY -= (lines.length / 2) * lineHeight;

            for (var n = 0; n < lines.length; n++) {
                ctx.fillText(lines[n], centerX, centerY);
                centerY += lineHeight;
            }
            //Draw text in center
            ctx.fillText(line, centerX, centerY);
        }
    }
});
  //------------------------------------------------------------------------------------
var ctxLine = document.getElementById('chart-column-1').getContext('2d');
var myChartLine = new Chart(ctxLine, {
    type: 'line',
    data: {
        labels: ['MON', 'TUE', 'WEB', 'THU', 'FRI', 'SAT', 'SUN'],
        datasets: [
            {
                data: [71, 70, 43, 30, 49, 55, 38],
                label: "ASD",
                tension: 0,
                borderColor: "#bb4fd2",
                pointRadius: 5,
                pointBorderWidth: 3,
                pointBackgroundColor: "white",
                fill: false,
            },
            {
                data: [123, 103, 123, 158, 134, 157, 190],
                label: "RTYS",
                tension: 0,
                borderColor: "#1cc327",
                pointRadius: 5,
                pointBorderWidth: 3,
                pointBackgroundColor: "white",
                fill: false,
            }
        ]
    },
    options: {
        legend: {
            display: false
        },
        layout: {
            padding: {
                left: 40,
                right: 40,
                top: 0,
                bottom: 0
            }
        },
        scales: {
            xAxes: [{
                ticks: {
                    // beginAtZero: false,
                    // display: false,
                    fontSize: 12,
                    color: "#6a6f7b",
                },
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: false,
                },
                display: false,
                gridLines: {
                    display: false,
                },
            }],
        }
    }
});


var ctxBar = document.getElementById('chart-column-2').getContext('2d');
var myChartBar = new Chart(ctxBar, {
    type: 'bar',
    data: {
        labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
        datasets: [
            {
                data: [92, 233, 199, 316, 126, 150],
                label: "ASD",
                backgroundColor: "#b5dff5",
                barPercentage: 0.5,
                hoverBackgroundColor: "#0a95dd",
                borderRadius: 5,
                // fill: false,
            },
        ]
    },
    options: {
        legend: {
            display: false
        },
        layout: {
            padding: {
                left: 40,
                right: 40,
                top: 0,
                bottom: 0
            }
        },
        scales: {
            xAxes: [{
                ticks: {
                    fontSize: 12,
                    color: "#6a6f7b",
                },
                gridLines: {
                    display: false,
                },
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: false,
                },
                display: false,
                gridLines: {
                    display: false,
                },
            }],
        }
    }
});

var ctxDoughnut = document.getElementById('chart-column-3').getContext('2d');
var myChartDoughnut = new Chart(ctxDoughnut, {
    type: 'doughnut',
    data: {
        labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
        datasets: [
            {
                data: [48, 24, 16,12],
                label: "ASD",
                backgroundColor: [
                    "#b80add","#0a95dd","#1cc327","#eceff2"
                ]
                // fill: false,
            },
        ]
    },
    options: {
        maintainAspectRatio: false, // Thay đổi kích thước dc phụ thuộc parent container
        responsive: true, // Thay đổi kích thước dc phụ thuộc parent container
        cutoutPercentage: 85,
        legend: {
            display: false
        },
        layout: {
            padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }
        },
        elements: {
            center: {
                text: '$13,6k',
                color: 'Black', // Default is #000000
                fontStyle: 'Lato', // Default is Arial
                sidePadding: 20, // Default is 20 (as a percentage)
                minFontSize: false, // Default is 20 (in px), set to false and text will not wrap.
                lineHeight: 25 // Default is 25 (in px), used for when text wraps
            }
        }
    }
});