// Use D3 fetch to read JSON file
d3.json("data/samples.json").then((importedData) => {
    let data = importedData;

    d3.select('#selDataset')
    .selectAll("option")
    .data(data.names)
    .enter()
    .append("option")
    .text(d => d)
    .attr("value", d => d)

    console.log(data.samples[0].otu_ids.slice(0,10).reverse());

    updatePlot(0);

    function updatePlot(index) {
        let subjectOTU = data.samples[index].otu_ids;
        console.log(subjectOTU);
        let subjectFreq = data.samples[index].sample_values;
        let otuLabels = data.samples[index].otu_labels;

        // variable for the bonus assignment
        let washFreq = data.metadata[+index].wfreq;


        let demoEntries = Object.entries(data.metadata[index])
        let demoData = d3.select('#sample-metadata');

        console.log(demoEntries[0][0]);

        demoData.html("");

        for (let i = 0; i < demoEntries.length; ++i) {
            demoData.append("p").text(`${demoEntries[i][0]}:${demoEntries[i][1]}`)
        };

        

        let topTenOTU = subjectOTU.slice(0, 10).reverse();
        let topTenFreq = subjectFreq.slice(0, 10).reverse();
        let topTenToolTips = data.samples[0].otu_labels.slice(0, 10).reverse();
        let topTenLabel = topTenOTU.map((otu => "OTU " + otu));
        topTenLabel = topTenLabel.reverse();

        let trace1 = {
            x: topTenFreq,
            y: topTenLabel,
            text: topTenToolTips,
            type: "bar",
            orientation: "h"
        };

        let barData = [trace1];

        let layout = {
            title: "Top 10 OTUs",
            margin: {
                l: 75,
                r: 75,
                t: 75,
                b: 50
            }
        };

        Plotly.newPlot("bar", barData, layout);

        let trace2 = {
            x: subjectOTU,
            y: subjectFreq,
            text: otuLabels,
            mode: 'markers',
            marker: {
                color: subjectOTU,
                opacity: [1, 0.8, 0.6, 0.4],
                size: subjectFreq
            }
        };

        let bubbleData = [trace2];

        layout = {
            title: 'OTU Frequency',
            showlegend: false,
            height: 600,
            width: 930
        }

        Plotly.newPlot('bubble', bubbleData, layout)

        // Gauge plot for the bonus assignment :)

        let trace3 = {
            domain: {x: [0,1], y: [0,1]},
            type: 'indicator',
            mode: 'gauge+number',
            value: washFreq,
            title: {text: 'Belly Button Washes per week'},
            gauge: {
                axis: {range: [0,9], tickwidth: 0.5, tickcolor: 'black'},
                bar: {color: '#669999'},
                bgcolor: 'white',
                borderwidth: 2,
                bordercolor: 'transparent',
                steps: [
                    {range: [0,1], color: '#fff'},
                    { range: [1, 2], color: "#e6fff5" },
                    { range: [2, 3], color: "ccffeb" },
                    { range: [3, 4], color: "b3ffe0" },
                    { range: [4, 5], color: "#99ffd6" },
                    { range: [5, 6], color: "#80ffcc" },
                    { range: [6, 7], color: "#66ffc2" },
                    { range: [7, 8], color: "#4dffb8" },
                    { range: [8, 9], color: "#33ffad" }
                ]
            }
        }

        let gaugeData = [trace3];

        layout = {
            width: 600,
            height: 500,
            margin: {
                t: 0,
                b: 0
            }
        };

        Plotly.newPlot('gauge', gaugeData, layout)
    };

    d3.selectAll('#selDataset').on('change', refreshData)

    function refreshData() {
        let dropdownMenu = d3.select('#selDataset')
        let patientID = dropdownMenu.property('value')

        console.log(patientID);

        for (i = 0; i < data.names.length; ++i) {
            if (patientID === data.names[i]) {
                updatePlot(i)
            }
        }
    };
});
