
function init() {

    d3.json("samples.json").then((sampleData) => {
        console.log(sampleData); 
    });
};


function dropdownMenu() {

d3.json("samples.json").then((sampleData) => {
    var names = sampleData.names;
    //console.log(names);

    var dropdownMenu = d3.select("#selDataset");
    var option;
    for (var i = 0; i < names.length; i++) {
        option = dropdownMenu.append("option").text(names[i]);
    }
});
};

dropdownMenu();


function getData(optionSelected) {

    d3.json("samples.json").then((sampleData) => {
        var filteredData = sampleData.samples.filter(row => row.id === optionSelected);
        console.log(filteredData);
        var sampleValues = filteredData[0].sample_values;
        //console.log(sampleValues);
        var otuIds = filteredData[0].otu_ids;
        //console.log(otuIds);
        var otuLabels = filteredData[0].otu_labels;
        //console.log(otuLabels);

        var opselected = sampleValues.map((value, index) => {
            return {
                sampleValues: value,
                otuIds: otuIds[index],
                otuLabels: otuLabels[index]
            }
        });
        

        // Sort the data array
        var sortedValues = opselected.sort((a, b) => b.sampleValues - a.sampleValues);
        // Slice the first 10 objects for plotting // Reverse the array due to Plotly's defaults
        var top_values = sortedValues.slice(0, 10).reverse()
    
        
        //Tracing the bar graph
        var trace1 = {
            x: top_values.map(d => d.sampleValues),
            y: top_values.map(d => `OTU ${d.otuIds}`),
            text: top_values.map(d => d.otuLabels),
            type: "bar",
            orientation: "h"
            };
    
        var barData = [trace1];

        var barLayout = {
            title: "Top 10 OTUs found in this individual"
        }
    
        Plotly.newPlot("bar", barData, barLayout)


        // Tracing the bubble chart
        var trace2 = {
            x: opselected.map(d => d.otuIds),
            y: opselected.map(d => d.sampleValues),
            text: opselected.map(d => d.otuLabels),
            mode: "markers",
            marker: {
                color: opselected.map(d => d.otuIds),
                size: opselected.map(d => d.sampleValues)
                }
            };
    
        var bubbleData = [trace2];
    
        var bubbleLayout = {
            title: "Bubble Chart",
            xaxis: { title: "OTU ID" },
        };
    
        Plotly.newPlot("bubble", bubbleData, bubbleLayout)


        //Demographic Info
        var demographic = sampleData.metadata;
        //console.log(demographic);
        var filteredDemo = demographic.filter(row => row.id == optionSelected)[0];
        //console.log(demo_info);
    
        var panelBody = d3.select(".panel-body").html("");

        Object.entries(filteredDemo).forEach(([key, value]) => {
            panelBody.append("p").text(`${key}: ${value}`)
        });


    });
};

function optionChanged(optionSelected) {
    getData(optionSelected)
};

init();