// Fetch the JSON data
d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    // Populate the dropdown
    var select = d3.select('#selDataset');
    data.names.forEach((name) => {
        select.append('option').text(name).property('value', name);
    });

    // Add in event listener for dropdown
    select.on('change', function () {
        var newSample = d3.select(this).property('value');
        optionChanged(newSample);
    });

    // Initialize page with sample1
    var sample1 = data.names[0];
    buildCharts(sample1);
    buildMetadata(sample1);
});

// Build the charts
function buildCharts(sample) {
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
        var samples = data.samples;
        var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        var results = resultArray[0];
        var otu_ids = results.otu_ids;
        var otu_labels = results.otu_labels;
        var sample_values = results.sample_values;

        // Bar Chart
        var barData = [{
            type: 'bar',
            orientation: 'h',
            x: sample_values.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
            text: otu_labels.slice(0,10).reverse(),
        }];

        var barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: {t:30, l:150}
        };

        Plotly.newPlot('bar', barData, barLayout);

        // Bubble Chart
        var bubbleData = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                color: otu_ids,
                size: sample_values,
                colorscale: 'Rainbow'
            }
        }];

        var bubbleLayout = {
            title: 'Bacteria Cultures Per Sample',
            xaxis: {title: 'OTU ID'},
            yaxis: {title: 'Number of Bacteria'},
            height: 600,
            width: 1200,
            hovermode: 'closest',
            showlegend: false
        };

        Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    });
};

// Build metadata panel
function buildMetadata(sample) {
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var results = resultArray[0];
        var panel = d3.select("#sample-metadata");

        // Clear metadata
        panel.html("");

        // Add key-value pairs to panel
        Object.entries(results).forEach(([key, value]) => {
            panel.append('h6').text(`${key.toUpperCase()}: ${value}`);
        });
    });
};


// Apply changes using dropdown
function optionChanged(newSample) {
    console.log('Sample selected:', newSample);
    buildCharts(newSample);
    buildMetadata(newSample);
};