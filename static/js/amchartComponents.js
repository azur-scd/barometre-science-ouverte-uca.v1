function stackedBar(divid, t, d) {
    am4core.ready(function () { // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end
        // Create chart instance
        var chart = am4core.create(divid, am4charts.XYChart);

        var title = chart.titles.create();
        title.text = t;
        title.fontSize = 20;
        title.marginBottom = 30;

        // export menu
        chart.exporting.menu = new am4core.ExportMenu();
        chart.exporting.menu.align = "right";
        chart.exporting.menu.verticalAlign = "top";
        // Add data
        chart.data = d;

        // Create axes
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "key";
        categoryAxis.renderer.grid.template.location = 0;


        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.inside = true;
        valueAxis.renderer.labels.template.disabled = true;
        valueAxis.min = 0;

        // Create series
        function createSeries(field, name) { // Set up series
            var series = chart.series.push(new am4charts.ColumnSeries());
            series.name = name;
            series.dataFields.valueY = field;
            series.dataFields.categoryX = "key";
            series.sequencedInterpolation = true;

            // Make it stacked
            series.stacked = true;

            // Configure columns
            series.columns.template.width = am4core.percent(60);
            series.columns.template.tooltipText = "[bold]{name}[/]\n[font-size:14px]{categoryX}: {valueY}";

            // Add label
            var labelBullet = series.bullets.push(new am4charts.LabelBullet());
            labelBullet.label.text = "{valueY}";
            labelBullet.locationY = 0.5;
            labelBullet.label.hideOversized = true;

            return series;
        }

        Object.keys(d[0]).filter(function (d) {
            return d != "key"
        }).map(function (d) {
            return createSeries(d, d)
        })
        /*createSeries("europe", "Europe");
        createSeries("namerica", "North America");
        createSeries("asia", "Asia-Pacific");
        createSeries("lamerica", "Latin America");
        createSeries("meast", "Middle-East");
        createSeries("africa", "Africa");*/

        // Legend
        chart.legend = new am4charts.Legend();

    }); // end am4core.ready()

}
function stackedarea(divid, d) {
    am4core.ready(function () {

        // Themes begin
        // am4core.useTheme(am4themes_dataviz);
        am4core.useTheme(am4themes_animated);
        // Themes end

        var chart = am4core.create(divid, am4charts.XYChart);

        // export menu
        chart.exporting.menu = new am4core.ExportMenu();
        chart.exporting.menu.align = "right";
        chart.exporting.menu.verticalAlign = "top";

        chart.data = d;

        chart.dateFormatter.inputDateFormat = "yyyy";
        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.minGridDistance = 60;
        dateAxis.startLocation = 0.5;
        dateAxis.endLocation = 0.5;
        dateAxis.baseInterval = {
            timeUnit: "year",
            count: 1
        }

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = true;

        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.dateX = "key";
        series.name = "Accès ouvert";
        series.dataFields.valueY = "Accès ouvert";
        series.tooltipHTML = "<img src='https://bu.univ-cotedazur.fr/fr/contents/images/openacces.png/@@images/a9c4ab17-72e4-4c0e-b800-e3b89207cb73.png' style='vertical-align:bottom; margin-right: 10px; width:18px; height:21px;'><span style='font-size:14px; color:#000000;'><b>{valueY.value}</b></span>";
        series.tooltipText = "[#000]{valueY.value}[/]";
        series.tooltip.background.fill = am4core.color("#FFF");
        series.tooltip.getStrokeFromObject = true;
        series.tooltip.background.strokeWidth = 3;
        series.tooltip.getFillFromObject = false;
        series.fillOpacity = 0.6;
        series.strokeWidth = 2;
        series.stacked = true;

        var series2 = chart.series.push(new am4charts.LineSeries());
        series2.name = "Accès fermé";
        series2.dataFields.dateX = "key";
        series2.dataFields.valueY = "Accès fermé";
        series2.tooltipHTML = "<img src='https://upload.wikimedia.org/wikipedia/commons/0/0e/Closed_Access_logo_transparent.svg' style='vertical-align:bottom; margin-right: 10px; width:18px; height:21px;'><span style='font-size:14px; color:#000000;'><b>{valueY.value}</b></span>";
        series2.tooltipText = "[#000]{valueY.value}[/]";
        series2.tooltip.background.fill = am4core.color("#FFF");
        series2.tooltip.getFillFromObject = false;
        series2.tooltip.getStrokeFromObject = true;
        series2.tooltip.background.strokeWidth = 3;
        series2.sequencedInterpolation = true;
        series2.fillOpacity = 0.6;
        series2.stacked = true;
        series2.strokeWidth = 2;

        chart.cursor = new am4charts.XYCursor();
        chart.cursor.xAxis = dateAxis;
        chart.scrollbarX = new am4core.Scrollbar();

        // Add a legend
        chart.legend = new am4charts.Legend();
        chart.legend.position = "top";

    });
}
function stackedbar100percent(divid, d, unique_keys) {
    am4core.ready(function () { // Themes begin
        am4core.useTheme(am4themes_animated);
        // am4core.useTheme(am4themes_dataviz);
        // Themes end

        var chart = am4core.create(divid, am4charts.XYChart);
        chart.hiddenState.properties.opacity = 0;
        // this creates initial fade-in

        // export menu
        chart.exporting.menu = new am4core.ExportMenu();
        chart.exporting.menu.align = "right";
        chart.exporting.menu.verticalAlign = "top";

        chart.data = d
        chart.colors.step = 2;
        chart.padding(30, 30, 10, 30);
        chart.legend = new am4charts.Legend();

        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "key";
        categoryAxis.renderer.grid.template.location = 0;
        // the following line makes value axes to be arranged horizontaly.
        chart.rotate = true;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.min = 0;
        valueAxis.max = 100;
        valueAxis.strictMinMax = true;
        valueAxis.calculateTotals = true;
        valueAxis.renderer.minWidth = 50;

        for (var k of unique_keys) {
            k_norm = k.replace(/\s+/g, '_').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            console.log(k_norm)
            window['series' + k_norm] = chart.series.push(new am4charts.ColumnSeries());
            window['series' + k_norm].columns.template.width = am4core.percent(80);
            window['series' + k_norm].columns.template.tooltipText = "{name} en {categoryX} : {valueY.totalPercent.formatNumber('#.00')}%";
            window['series' + k_norm].name = k;
            window['series' + k_norm].dataFields.categoryX = "key";
            window['series' + k_norm].dataFields.valueY = k;
            window['series' + k_norm].dataFields.valueYShow = "totalPercent";
            window['series' + k_norm].dataItems.template.locations.categoryX = 0.5;
            window['series' + k_norm].stacked = true;
            window['series' + k_norm].tooltip.pointerOrientation = "vertical";

            window['bullet' + k_norm] = window['series' + k_norm].bullets.push(new am4charts.LabelBullet());
            window['bullet' + k_norm].interactionsEnabled = false;
            window['bullet' + k_norm].label.text = "{valueY.totalPercent.formatNumber('#.')}%";
            window['bullet' + k_norm].label.fill = am4core.color("#ffffff");
            window['bullet' + k_norm].locationY = 0.5;

            if (k_norm == "acces_ferme") {
                window['series' + k_norm].columns.template.fill = am4core.color("#b22222"); // firebrik (or tomato ->#ff6347)
            }
            if (k_norm == "acces_ouvert") {
                window['series' + k_norm].columns.template.fill = am4core.color("#00FF7F"); // springgreen
            }
            if (k_norm == "editeur") {
                window['series' + k_norm].columns.template.fill = am4core.color("#FFD700"); // gold
            }
            if (k_norm == "editeur_et_archives_ouvertes") {
                window['series' + k_norm].columns.template.fill = am4core.color("#ADFF2F"); // greenyellow
            }
            if (k_norm == "archives_ouvertes") {
                window['series' + k_norm].columns.template.fill = am4core.color("#2E8B57"); // seagreen
            }

        }

        chart.scrollbarX = new am4core.Scrollbar();

    }); // end am4core.ready()
}

function stackedbar100percentHorizontal(divid, d, unique_keys) {
    am4core.ready(function () { // Themes begin
        am4core.useTheme(am4themes_animated);
        // am4core.useTheme(am4themes_dataviz);
        // Themes end

        var chart = am4core.create(divid, am4charts.XYChart);
        chart.hiddenState.properties.opacity = 0;
        // this creates initial fade-in

        // export menu
        chart.exporting.menu = new am4core.ExportMenu();
        chart.exporting.menu.align = "right";
        chart.exporting.menu.verticalAlign = "top";

        chart.data = d
        chart.colors.step = 2;
        chart.padding(30, 30, 10, 30);
        chart.legend = new am4charts.Legend();

        var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "key";
        categoryAxis.renderer.grid.template.location = 0;

        var label = categoryAxis.renderer.labels.template;
           label.truncate = true;
           label.maxWidth = 200;
           label.fontSize = 15;

        var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
        valueAxis.min = 0;
        valueAxis.max = 100;
        valueAxis.strictMinMax = true;
        valueAxis.calculateTotals = true;
        valueAxis.renderer.minWidth = 50;

        for (var k of unique_keys) {
            k_norm = k.replace(/\s+/g, '_').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            console.log(k_norm)
            window['series' + k_norm] = chart.series.push(new am4charts.ColumnSeries());
            window['series' + k_norm].columns.template.width = am4core.percent(80);
            window['series' + k_norm].columns.template.tooltipText = "{categoryY} / {name} : {valueX.totalPercent.formatNumber('#.00')}%";
            window['series' + k_norm].name = k;
            window['series' + k_norm].dataFields.categoryY = "key";
            window['series' + k_norm].dataFields.valueX = k;
            window['series' + k_norm].dataFields.valueXShow = "totalPercent";
            window['series' + k_norm].dataItems.template.locations.categoryY = 0.5;
            window['series' + k_norm].stacked = true;
            window['series' + k_norm].tooltip.pointerOrientation = "vertical";

            window['bullet' + k_norm] = window['series' + k_norm].bullets.push(new am4charts.LabelBullet());
            window['bullet' + k_norm].interactionsEnabled = false;
            window['bullet' + k_norm].label.text = "{valueX.totalPercent.formatNumber('#.')}%";
            window['bullet' + k_norm].label.fill = am4core.color("#ffffff");
            window['bullet' + k_norm].locationX = 0.5;

            if (k_norm == "acces_ferme") {
                window['series' + k_norm].columns.template.fill = am4core.color("#b22222"); // firebrik (or tomato ->#ff6347)
            }
            if (k_norm == "acces_ouvert") {
                window['series' + k_norm].columns.template.fill = am4core.color("#00FF7F"); // springgreen
            }
            if (k_norm == "editeur") {
                window['series' + k_norm].columns.template.fill = am4core.color("#FFD700"); // gold
            }
            if (k_norm == "editeur_et_archives_ouvertes") {
                window['series' + k_norm].columns.template.fill = am4core.color("#ADFF2F"); // greenyellow
            }
            if (k_norm == "archives_ouvertes") {
                window['series' + k_norm].columns.template.fill = am4core.color("#2E8B57"); // seagreen
            }

        }

        chart.scrollbarX = new am4core.Scrollbar();

    }); // end am4core.ready()
}

function donut3D(divid, data) {
    am4core.ready(function () { // Themes begin
        am4core.useTheme(am4themes_animated);
        // am4core.useTheme(am4themes_dataviz);
        // Themes end
        var chart = am4core.create(divid, am4charts.PieChart3D);
        chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
        //chart.legend = new am4charts.Legend();

        // export menu
        chart.exporting.menu = new am4core.ExportMenu();
        chart.exporting.menu.align = "right";
        chart.exporting.menu.verticalAlign = "top";

        chart.data = data

        chart.innerRadius = 100;

        var series = chart.series.push(new am4charts.PieSeries3D());
        series.dataFields.value = "value";
        series.dataFields.category = "key";

        series.ticks.template.disabled = true;
        series.alignLabels = false;
        series.labels.template.text = "{category} {value.percent.formatNumber('#.')}%";
        series.labels.template.radius = am4core.percent(-10);
        series.labels.template.fill = am4core.color("black");

    }); // end am4core.ready()
}

function semicircle(divid, data) {
    am4core.ready(function () { // Themes begin
        //am4core.useTheme(am4themes_animated);
        am4core.useTheme(am4themes_kelly);
        // Themes end

        var chart = am4core.create(divid, am4charts.PieChart);
        chart.hiddenState.properties.opacity = 0;
        // this creates initial fade-in

        // export menu
        chart.exporting.menu = new am4core.ExportMenu();
        chart.exporting.menu.align = "right";
        chart.exporting.menu.verticalAlign = "top";

        chart.data = data
        chart.radius = am4core.percent(70);
        chart.innerRadius = am4core.percent(40);
        chart.startAngle = 180;
        chart.endAngle = 360;

        var series = chart.series.push(new am4charts.PieSeries());
        series.dataFields.value = "value";
        series.dataFields.category = "key";

        series.slices.template.cornerRadius = 10;
        series.slices.template.innerCornerRadius = 7;
        series.slices.template.draggable = true;
        series.slices.template.inert = true;

        series.ticks.template.disabled = true;
        series.alignLabels = false;
        series.labels.template.text = "{value.percent.formatNumber('#.')}%";
        series.labels.template.radius = am4core.percent(-10);
        series.labels.template.fill = am4core.color("black");

        series.hiddenState.properties.startAngle = 90;
        series.hiddenState.properties.endAngle = 90;

        chart.legend = new am4charts.Legend();

    }); // end am4core.ready()
}

function nestedDonut(divid, data) {
    am4core.ready(function () { // Themes begin
        am4core.useTheme(am4themes_animated);

        // Create chart instance
        var chart = am4core.create(divid, am4charts.PieChart);

        chart.width = am4core.percent(100);
        chart.height = am4core.percent(100);
        // Let's cut a hole in our Pie chart the size of 40% the radius
        chart.innerRadius = am4core.percent(40);
        // legend
        //chart.legend = new am4charts.Legend();
        //chart.legend.layout = "horizontal";
        //chart.legend.fontSize = 11; 
        //chart.legend.maxHeight = 100;
        //chart.legend.scrollable = true;
        //chart.legend.contentAlign = "left";

        // export menu
        chart.exporting.menu = new am4core.ExportMenu();
        chart.exporting.menu.align = "right";
        chart.exporting.menu.verticalAlign = "top";

        // Add data
        chart.data = data

        // Add and configure Series
        var pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "value";
        pieSeries.dataFields.category = "key";
        pieSeries.slices.template.stroke = am4core.color("#fff");
        pieSeries.slices.template.strokeWidth = 2;
        pieSeries.slices.template.strokeOpacity = 1;

        // Disabling labels and ticks on inner circle
        /*pieSeries.labels.template.disabled = false;
        pieSeries.ticks.template.disabled = true;
        pieSeries.alignLabels = false;
        pieSeries.labels.template.text = "{value.percent.formatNumber('#.')}%";*/
        pieSeries.ticks.template.disabled = true;
        pieSeries.alignLabels = false;
        pieSeries.labels.template.text = "{value.percent.formatNumber('#.')}%";
        pieSeries.labels.template.radius = am4core.percent(-15);
        pieSeries.labels.template.fill = am4core.color("black");

        // Disable sliding out of slices
        pieSeries.slices.template.states.getKey("hover").properties.shiftRadius = 0;
        pieSeries.slices.template.states.getKey("hover").properties.scale = 0.9;

        // Add second series
        var pieSeries2 = chart.series.push(new am4charts.PieSeries());
        pieSeries2.dataFields.value = "global_value";
        pieSeries2.dataFields.category = "global_key";
        pieSeries2.slices.template.stroke = am4core.color("#fff");
        pieSeries2.slices.template.strokeWidth = 2;
        pieSeries2.slices.template.strokeOpacity = 1;
        pieSeries2.slices.template.states.getKey("hover").properties.shiftRadius = 0;
        pieSeries2.slices.template.states.getKey("hover").properties.scale = 1.1;

        // Disabling labels and ticks on outer circle
        /*pieSeries2.labels.template.disabled = false;
        pieSeries2.ticks.template.disabled = false;*/
        pieSeries2.ticks.template.disabled = true;
        pieSeries2.alignLabels = false;
        pieSeries2.labels.template.text = "{category} {value.percent.formatNumber('#.')}%";
        pieSeries2.labels.template.radius = am4core.percent(-5);
        pieSeries2.labels.template.fill = am4core.color("black");

        pieSeries.colors.list = [
            am4core.color("#b22222"), // fermé -> firebrick
            am4core.color("#2E8B57"), // archives -> seagreen
            am4core.color("#FFD700"), // editeur -> gold
            am4core.color("#ADFF2F"), // editeur&archives -> greenyellow

        ];
        pieSeries2.colors.list = [
            am4core.color("#ff6347"), // tomato
            am4core.color("#00FF7F"), // springgreen

        ];
    })
}

function treeMap(divid,d){
    am4core.ready(function() {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end
        
        var data = d
        
        function processData(data) {
            var treeData = [];
        
            var smallBrands = { name: "Other", children: [] };
        
            for (var brand in data) {
                var brandData = { name: brand, children: [] }
                var brandTotal = 0;
                for (var model in data[brand]) {
                    brandTotal += data[brand][model];
                }
        
                for (var model in data[brand]) {
                    // do not add null
                    if (data[brand][model] != 0) {
                        brandData.children.push({ name: model, count: data[brand][model] });
                    }
                }
                treeData.push(brandData);
                // only bigger brands
               /* if (brandTotal > 200000) {
                    treeData.push(brandData);
                }*/
            }
        
            return treeData;
        }
        
        // create chart
        var chart = am4core.create(divid, am4charts.TreeMap);
        chart.padding(0,0,0,0);
        chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect
        
        // only one level visible initially
        chart.maxLevels = 2;
        // define data fields
        chart.dataFields.value = "count";
        chart.dataFields.name = "name";
        chart.dataFields.children = "children";
        
        // enable navigation
        chart.navigationBar = new am4charts.NavigationBar();
        chart.zoomable = false;
        
        // level 0 series template
        var level0SeriesTemplate = chart.seriesTemplates.create("0");
        level0SeriesTemplate.strokeWidth = 2;
        
        // by default only current level series bullets are visible, but as we need brand bullets to be visible all the time, we modify it's hidden state
        //level0SeriesTemplate.bulletsContainer.hiddenState.properties.opacity = 1;
        //level0SeriesTemplate.bulletsContainer.hiddenState.properties.visible = true;
        // create hover state
        var columnTemplate = level0SeriesTemplate.columns.template;
        var hoverState = columnTemplate.states.create("hover");

        var bullet0 = level0SeriesTemplate.bullets.push(new am4charts.LabelBullet());
        bullet0.locationX = 0.5;
        bullet0.locationY = 0.8;
        bullet0.label.text = "{name}";
        bullet0.label.fill = am4core.color("#ffffff");
        bullet0.label.fontSize = 20;
        bullet0.label.fillOpacity = 0.7;
        
        // darken
        hoverState.adapter.add("fill", function (fill, target) {
            if (fill instanceof am4core.Color) {
                return am4core.color(am4core.colors.brighten(fill.rgb, -0.2));
            }
            return fill;
        })
        
        // level1 series template
        var level1SeriesTemplate = chart.seriesTemplates.create("1");
        level1SeriesTemplate.columns.template.fillOpacity = 0;
        level1SeriesTemplate.columns.template.strokeOpacity = 0.4;
        
        var bullet1 = level1SeriesTemplate.bullets.push(new am4charts.LabelBullet());
        bullet1.locationX = 0.5;
        bullet1.locationY = 0.5;
        bullet1.label.text = "{name}";
        bullet1.label.fill = am4core.color("#ffffff");
        bullet1.label.fontSize = 15;
        bullet1.label.fillOpacity = 0.7;
        
        chart.data = processData(data);
        
        }); // end am4core.ready()
}
/*----voir plus tard----*/
function draggablePie(divid, d) {
    am4core.ready(function () { // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end
        var data = d

        // cointainer to hold both charts
        var container = am4core.create(divid, am4core.Container);
        container.width = am4core.percent(100);
        container.height = am4core.percent(100);
        container.layout = "horizontal";

        container.events.on("maxsizechanged", function () {
            chart1.zIndex = 0;
            separatorLine.zIndex = 1;
            dragText.zIndex = 2;
            chart2.zIndex = 3;
        })

        var chart1 = container.createChild(am4charts.PieChart);
        chart1.fontSize = 11;
        chart1.hiddenState.properties.opacity = 0; // this makes initial fade in effect
        chart1.data = data;
        chart1.radius = am4core.percent(70);
        chart1.innerRadius = am4core.percent(40);
        chart1.zIndex = 1;

        var series1 = chart1.series.push(new am4charts.PieSeries());
        series1.dataFields.value = "value";
        series1.dataFields.category = "key";
        series1.colors.step = 2;
        series1.alignLabels = false;
        series1.labels.template.bent = true;
        series1.labels.template.radius = 3;
        series1.labels.template.padding(0, 0, 0, 0);

        var sliceTemplate1 = series1.slices.template;
        sliceTemplate1.cornerRadius = 5;
        sliceTemplate1.draggable = true;
        sliceTemplate1.inert = true;
        sliceTemplate1.propertyFields.fill = "color";
        sliceTemplate1.propertyFields.fillOpacity = "opacity";
        sliceTemplate1.propertyFields.stroke = "color";
        sliceTemplate1.propertyFields.strokeDasharray = "strokeDasharray";
        sliceTemplate1.strokeWidth = 1;
        sliceTemplate1.strokeOpacity = 1;

        var zIndex = 5;

        sliceTemplate1.events.on("down", function (event) {
            event.target.toFront();
            // also put chart to front
            var series = event.target.dataItem.component;
            series.chart.zIndex = zIndex++;
        })

        series1.ticks.template.disabled = true;

        sliceTemplate1.states.getKey("active").properties.shiftRadius = 0;

        sliceTemplate1.events.on("dragstop", function (event) {
            handleDragStop(event);
        })

        // separator line and text
        var separatorLine = container.createChild(am4core.Line);
        separatorLine.x1 = 0;
        separatorLine.y2 = 300;
        separatorLine.strokeWidth = 3;
        separatorLine.stroke = am4core.color("#dadada");
        separatorLine.valign = "middle";
        separatorLine.strokeDasharray = "5,5";


        var dragText = container.createChild(am4core.Label);
        dragText.text = "Drag slices over the line";
        dragText.rotation = 90;
        dragText.valign = "middle";
        dragText.align = "center";
        dragText.paddingBottom = 5;

        // second chart
        var chart2 = container.createChild(am4charts.PieChart);
        chart2.hiddenState.properties.opacity = 0; // this makes initial fade in effect
        chart2.fontSize = 11;
        chart2.radius = am4core.percent(70);
        chart2.data = data;
        chart2.innerRadius = am4core.percent(40);
        chart2.zIndex = 1;

        var series2 = chart2.series.push(new am4charts.PieSeries());
        series2.dataFields.value = "value";
        series2.dataFields.category = "key";
        series2.colors.step = 2;

        series2.alignLabels = false;
        series2.labels.template.bent = true;
        series2.labels.template.radius = 3;
        series2.labels.template.padding(0, 0, 0, 0);
        series2.labels.template.propertyFields.disabled = "disabled";

        var sliceTemplate2 = series2.slices.template;
        sliceTemplate2.copyFrom(sliceTemplate1);

        series2.ticks.template.disabled = true;

        function handleDragStop(event) {
            var targetSlice = event.target;
            var dataItem1;
            var dataItem2;
            var slice1;
            var slice2;

            if (series1.slices.indexOf(targetSlice) != -1) {
                slice1 = targetSlice;
                slice2 = series2.dataItems.getIndex(targetSlice.dataItem.index).slice;
            } else if (series2.slices.indexOf(targetSlice) != -1) {
                slice1 = series1.dataItems.getIndex(targetSlice.dataItem.index).slice;
                slice2 = targetSlice;
            }


            dataItem1 = slice1.dataItem;
            dataItem2 = slice2.dataItem;

            var series1Center = am4core.utils.spritePointToSvg({
                x: 0,
                y: 0
            }, series1.slicesContainer);
            var series2Center = am4core.utils.spritePointToSvg({
                x: 0,
                y: 0
            }, series2.slicesContainer);

            var series1CenterConverted = am4core.utils.svgPointToSprite(series1Center, series2.slicesContainer);
            var series2CenterConverted = am4core.utils.svgPointToSprite(series2Center, series1.slicesContainer);

            // tooltipY and tooltipY are in the middle of the slice, so we use them to avoid extra calculations
            var targetSlicePoint = am4core.utils.spritePointToSvg({
                x: targetSlice.tooltipX,
                y: targetSlice.tooltipY
            }, targetSlice);

            if (targetSlice == slice1) {
                if (targetSlicePoint.x > container.pixelWidth / 2) {
                    var value = dataItem1.value;

                    dataItem1.hide();

                    var animation = slice1.animate([
                        {
                            property: "x",
                            to: series2CenterConverted.x
                        }, {
                            property: "y",
                            to: series2CenterConverted.y
                        }
                    ], 400);
                    animation.events.on("animationprogress", function (event) {
                        slice1.hideTooltip();
                    })

                    slice2.x = 0;
                    slice2.y = 0;

                    dataItem2.show();
                } else {
                    slice1.animate([
                        {
                            property: "x",
                            to: 0
                        }, {
                            property: "y",
                            to: 0
                        }
                    ], 400);
                }
            }
            if (targetSlice == slice2) {
                if (targetSlicePoint.x < container.pixelWidth / 2) {

                    var value = dataItem2.value;

                    dataItem2.hide();

                    var animation = slice2.animate([
                        {
                            property: "x",
                            to: series1CenterConverted.x
                        }, {
                            property: "y",
                            to: series1CenterConverted.y
                        }
                    ], 400);
                    animation.events.on("animationprogress", function (event) {
                        slice2.hideTooltip();
                    })

                    slice1.x = 0;
                    slice1.y = 0;
                    dataItem1.show();
                } else {
                    slice2.animate([
                        {
                            property: "x",
                            to: 0
                        }, {
                            property: "y",
                            to: 0
                        }
                    ], 400);
                }
            }

            toggleDummySlice(series1);
            toggleDummySlice(series2);

            series1.hideTooltip();
            series2.hideTooltip();
        }

        function toggleDummySlice(series) {
            var show = true;
            for (var i = 1; i < series.dataItems.length; i++) {
                var dataItem = series.dataItems.getIndex(i);
                if (dataItem.slice.visible && ! dataItem.slice.isHiding) {
                    show = false;
                }
            }

            var dummySlice = series.dataItems.getIndex(0);
            if (show) {
                dummySlice.show();
            } else {
                dummySlice.hide();
            }
        }

        series2.events.on("datavalidated", function () {

            var dummyDataItem = series2.dataItems.getIndex(0);
            dummyDataItem.show(0);
            dummyDataItem.slice.draggable = false;
            dummyDataItem.slice.tooltipText = undefined;

            for (var i = 1; i < series2.dataItems.length; i++) {
                series2.dataItems.getIndex(i).hide(0);
            }
        })

        series1.events.on("datavalidated", function () {
            var dummyDataItem = series1.dataItems.getIndex(0);
            dummyDataItem.hide(0);
            dummyDataItem.slice.draggable = false;
            dummyDataItem.slice.tooltipText = undefined;
        })
    }); // end am4core.ready()
}
