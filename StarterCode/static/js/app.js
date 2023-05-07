function initialize() {
  // function to initialize dashboard

  // access dropdown selector from index.html
  var select = d3.select("#selDataset");

  // load data from the .json
  d3.json("samples.json").then((data) => {
    // use d3.json to get the data
    let sampleNames = data.names;

    // use a for-each to create options for each sample
    sampleNames.forEach((sample) => {
      select.append("option").text(sample).property("value", sample);
    });
    // when initialized, pass info for first sample
    let sample1 = sampleNames[0];

    //call function to build metadata
    demoInfo(sample1);
    // call function to build bar chart
    buildBarChart(sample1);
    // call function to build bubble chart
    buildBubbleChart(sample1);
  });
}

function optionChanged(item) {
  // function to update dashboard

  // call update to metadata
  demoInfo(item);
  buildBarChart(item);
  buildBubbleChart(item);
}

function demoInfo(sample) {
  // function to populate metadata

  // use d3.json to get the data
  d3.json("samples.json").then((data) => {
    let metaData = data.metadata;

    // filter based on sample value
    let result = metaData.filter((sampleResult) => sampleResult.id == sample);

    //access index 0 in the array
    let resultData = result[0];

    // clear metadata
    d3.select("#sample-metadata").html("");

    Object.entries(resultData).forEach(([key, value]) => {
      // use Object.entries to get key-value pairs

      // add to the sample data/demographics section
      d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
    });
  });
}

function buildBarChart(sample) {
  // function to build bar chart

  d3.json("samples.json").then((data) => {
    let sampleData = data.samples;

    // filter based on sample value
    let result = sampleData.filter((sampleResult) => sampleResult.id == sample);

    //access index 0 in the array
    let resultData = result[0];

    // get the otu ids, labels, & sample values
    let otu_ids = resultData.otu_ids;
    let otu_labels = resultData.otu_labels;
    let sample_values = resultData.sample_values;

    // build bar chart
    let yTicks = otu_ids.slice(0, 10).map((id) => `OTU ${id}`);
    let xValues = sample_values.slice(0, 10);
    let textLabels = otu_labels.slice(0, 10);

    let barChart = {
      y: yTicks.reverse(),
      x: xValues.reverse(),
      text: textLabels.reverse(),
      type: "bar",
      orientation: "h",
    };

    let layout = {
      title: "Top 10 Belly Button Bacteria",
    };

    Plotly.newPlot("bar", [barChart], layout);
  });
}

function buildBubbleChart(sample) {
  // function to build bubble chart

  d3.json("samples.json").then((data) => {
    let sampleData = data.samples;

    // filter based on sample value
    let result = sampleData.filter((sampleResult) => sampleResult.id == sample);

    //access index 0 in the array
    let resultData = result[0];

    // get the otu ids, labels, & sample values
    let otu_ids = resultData.otu_ids;
    let otu_labels = resultData.otu_labels;
    let sample_values = resultData.sample_values;

    // build bubble chart

    let bubbleChart = {
      y: sample_values,
      x: otu_ids,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth",
      },
    };

    let layout = {
      title: "Bacterial Cultures Per Sample",
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
    };

    Plotly.newPlot("bubble", [bubbleChart], layout);
  });
}

initialize();
