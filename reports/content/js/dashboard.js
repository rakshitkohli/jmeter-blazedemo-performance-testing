/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5953846153846154, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.66, 500, 1500, "02_Search_Flights-1"], "isController": false}, {"data": [1.0, 500, 1500, "02_Search_Flights-0"], "isController": false}, {"data": [0.32, 500, 1500, "01_Open_Home_Page"], "isController": false}, {"data": [0.995, 500, 1500, "04_Complete_Purchase-0"], "isController": false}, {"data": [0.0, 500, 1500, "Complete_Flight_Booking_Flow"], "isController": true}, {"data": [0.44, 500, 1500, "04_Complete_Purchase"], "isController": false}, {"data": [0.645, 500, 1500, "04_Complete_Purchase-1"], "isController": false}, {"data": [0.99, 500, 1500, "03_Select_Flight-0"], "isController": false}, {"data": [0.615, 500, 1500, "03_Select_Flight-1"], "isController": false}, {"data": [0.455, 500, 1500, "02_Search_Flights"], "isController": false}, {"data": [0.73, 500, 1500, "01_Open_Home_Page-0"], "isController": false}, {"data": [0.45, 500, 1500, "01_Open_Home_Page-1"], "isController": false}, {"data": [0.44, 500, 1500, "03_Select_Flight"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1200, 0, 0.0, 783.6608333333328, 293, 4486, 665.0, 1431.6000000000004, 1763.95, 3165.82, 17.378459399574226, 71.87848474316085, 3.8566942368684014], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["02_Search_Flights-1", 100, 0, 0.0, 719.6, 387, 4075, 543.0, 1169.6000000000001, 1936.649999999999, 4064.899999999995, 1.6828500748868283, 11.906492961479561, 0.2070694428083402], "isController": false}, {"data": ["02_Search_Flights-0", 100, 0, 0.0, 326.0699999999998, 294, 476, 315.0, 363.9, 393.5999999999999, 475.86999999999995, 1.6893889480175022, 0.37945259574611867, 0.3996625709543358], "isController": false}, {"data": ["01_Open_Home_Page", 100, 0, 0.0, 1544.3000000000002, 936, 4460, 1395.5, 2330.5000000000005, 2884.5, 4454.789999999997, 1.6498655359588192, 8.017315338799888, 0.3705752668657505], "isController": false}, {"data": ["04_Complete_Purchase-0", 100, 0, 0.0, 327.47999999999996, 293, 846, 314.0, 360.8, 387.4499999999999, 842.2299999999981, 1.691703884152118, 0.3882328249763161, 0.4613362398920693], "isController": false}, {"data": ["Complete_Flight_Booking_Flow", 100, 0, 0.0, 4703.589999999998, 3296, 8642, 4519.5, 6274.3, 6695.749999999999, 8630.179999999993, 1.5826791592808305, 39.27640898012155, 2.1074053063275513], "isController": true}, {"data": ["04_Complete_Purchase", 100, 0, 0.0, 1048.02, 684, 3492, 880.5, 1550.6000000000004, 1912.1, 3489.2199999999984, 1.6784155756965424, 9.859052429506546, 0.6724316307905338], "isController": false}, {"data": ["04_Complete_Purchase-1", 100, 0, 0.0, 720.18, 389, 3148, 544.5, 1201.0000000000002, 1579.1999999999996, 3145.5799999999986, 1.6870234158850126, 9.522456390444699, 0.21582037839935217], "isController": false}, {"data": ["03_Select_Flight-0", 100, 0, 0.0, 333.16999999999985, 295, 961, 315.5, 367.0, 406.24999999999983, 957.3099999999981, 1.6912175074836375, 0.38151488694210967, 0.3765601481506537], "isController": false}, {"data": ["03_Select_Flight-1", 100, 0, 0.0, 731.5199999999996, 389, 3166, 560.0, 1249.6000000000001, 1923.849999999994, 3158.159999999996, 1.687108801646618, 11.06341367486039, 0.20924103301671923], "isController": false}, {"data": ["02_Search_Flights", 100, 0, 0.0, 1046.1600000000003, 707, 4486, 875.0, 1484.2000000000003, 2268.6499999999987, 4474.779999999994, 1.673976363453748, 12.219700504703873, 0.6019939412517995], "isController": false}, {"data": ["01_Open_Home_Page-0", 100, 0, 0.0, 597.71, 341, 2801, 628.0, 755.9000000000001, 1398.4499999999932, 2795.049999999997, 1.6791483359639992, 0.35911473200792554, 0.18857622913658192], "isController": false}, {"data": ["01_Open_Home_Page-1", 100, 0, 0.0, 944.6099999999998, 574, 3779, 795.5, 1691.4000000000021, 1880.5999999999997, 3767.019999999994, 1.6627591825875858, 7.724360773016744, 0.18673565038825427], "isController": false}, {"data": ["03_Select_Flight", 100, 0, 0.0, 1065.11, 685, 3512, 893.5, 1590.2, 2272.249999999994, 3503.819999999996, 1.6784437469578206, 11.385224869500998, 0.5818823536816663], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1200, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
