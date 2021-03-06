// get table references
var tbody = d3.select("tbody");

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {

  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    
    // 3. Create a variable that holds the samples array. 
    var sample_data = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleFilter= sample_data.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var resultArray = sampleFilter[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = resultArray.otu_ids
    var otu_labels = resultArray.otu_labels
    var sample_values = resultArray.sample_values

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var sorted_ids = otu_ids.sort((a,b)=>
    a.sample_values - b.sample_values);
    var top_10_ids = sorted_ids.slice(0,10);
    var mapped_ids = top_10_ids.map(String);

    for (var i=mapped_ids.length; i--;){
      mapped_ids[i] = 'Otu ' + mapped_ids[i];
    };

    var sorted_samples = sample_values.sort((a,b) =>
    a.sample_values - b.sample_values);

    var top_10_samples = sorted_samples.slice(0,10);
    var sorted_top_10_samples = top_10_samples.reverse()

 

    // 8. Create the trace for the bar chart. 
    var trace = {
      x: sorted_top_10_samples,
      y: mapped_ids,
      type: "bar",
      orientation: 'h'

      
  };
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: {title: 'Sample Values'}};
      //yaxis: {title: 'IDs'}
     
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar',[trace], barLayout);

    for (var i=mapped_ids.length; i--;){
      mapped_ids[i] = 'Otu ' + mapped_ids[i];
    };

    
    // 1. Create the trace for the bubble chart.
    var bubbleTrace = {
      type: 'scatter',
      mode: 'markers',
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      marker: {
        size: sample_values,
        color: otu_ids
      }
    };

    //var bubbleData = [bubbleTrace];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      axis: {title: 'OTU ID'},
      hovermode: 'closest'
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble',[bubbleTrace],bubbleLayout); 
    console.log(otu_ids);
    console.log(otu_ids);
    console.log(otu_labels);



    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadataFilter= data.metadata.filter(sampleObj => sampleObj.id == sample);
    
    // 2. Create a variable that holds the first sample in the metadata array.
    var metaArray = metadataFilter[0];

    // 3. Create a variable that holds the washing frequency.
    var wfreq = metaArray.wfreq;

    console.log(metaArray);
    console.log(wfreq);

    // Create the yticks for the bar chart.
    var washPerweek = wfreq;

    // 4. Create the trace for the gauge chart.
    var gaugeTrace = [{
      title: 'Scrubs Per Week',
      type : 'indicator',
      mode : 'gauge+number',
      domain : {'x': [0,1], 'y': [0,1]},
      value : washPerweek,
      gauge : {'axis': {'range': [0, 10], 'tickwidth': 1, 'tickcolor': "black"},
      'steps': [
        {'range': [0, 2], 'color': "red"},
        {'range': [2, 4], 'color': "orange"},
        {'range': [4, 6], 'color': "yellow"},
        {'range': [6, 8], 'color': "lightgreen"},
        {'range': [8, 10], 'color': "green"}],
      'bar': {'color': "black"}
      }}];

    var gaugeData = gaugeTrace;
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      title:'Belly Button Washing Frequency'
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge',gaugeData,gaugeLayout);
        
  });

};

