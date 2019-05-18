const width = 1000,
    height = 640,
    margin = 40,
    scaleSize = d3.scaleSqrt()  .domain([0, 51000])        .range([1.2, 13]),
    scaleAcc =  d3.scaleLinear().domain([1, 0.67, 0.33, 0]).range(["red", "orange", "yellow", "green"]),
    centerx =   d3.scaleLinear().range([width / 2 - height / 2 + margin, width / 2 + height / 2 - margin]),
    centery =   d3.scaleLinear().range([margin, height - margin]);

const MAIN_KEY = 'Admission Rate'
const LOCALE_TYPES = ['Rural', 'Suburb', 'Town', 'City'];
const LOCALE_SIZES = ['Remote', 'Distant', 'Fringe', 'Small', 'Mid-size', 'Large'];
const toLocaleType = loc => {
    if (loc) {
        const type = loc.toString().split(' ')[1];
        return LOCALE_TYPES.findIndex(t => t === type)
    }
    return -1;
};
const toLocaleSize = loc => {
    if (loc) {
        const size = loc.toString().split(' ')[0];
        return LOCALE_SIZES.findIndex(s => s === size)
    }
    return -1;
};


const parseDatum = (d) => {
    return toLocaleType(d['Locale']), toLocaleSize(d['Locale']),[d['Name'], d['Control'], d['Region'], d['Locale'], +d['Admission Rate'], +d['ACT Median'], +d['SAT Average'], 
        +d['Undergrad Population'], +d['% White'], +d['% Black'], +d['% Hispanic'], +d['% Asian'], +d['% American Indian'], 
        +d['% Pacific Islander'], +d['% Biracial'], +d['% Nonresident Aliens'], +d['% Part-time Undergrads'], +d['Average Cost'],
        +d['Expenditure Per Student'], +d['Average Faculty Salary'], +d['% Full-time Faculty'], +d['% Undergrads with Pell Grant'],
        +d['Completion Rate 150% time'], +d['Retention Rate (First Time Students)'], +d['% Undergrads 25+ y.o.'], 
        +d['3 Year Default Rate'], +d['Median Debt'], +d['Median Debt on Graduation'], +d['Median Debt on Withdrawal'], 
        +d['% Federal Loans'], +d['% Pell Grant Recipients'], +d['Average Age of Entry'], +d['Average Family Income'], 
        +d['Median Family Income'], +d['Poverty Rate'], +d['Number of Unemployed 8 years after entry'], 
        +d['Number of Employed 8 years after entry'], +d['Mean Earnings 8 years After Entry'], +d['Median Earnings 8 years After Entry'],
    ];
}
const indexOfKey = (key) => parseDatum({[key]: 5}).findIndex(d => d === 5);

const ACC_INDEX = indexOfKey(MAIN_KEY);
const SIZE_INDEX = indexOfKey('Undergrad Population');
const LOCALE_INDEX = indexOfKey('Locale');

const LOCALE_TYPE_INDEX = 0;
const LOCALE_SIZE_INDEX = 1;
const LOCALE_TYPE_DISTANCE = (t1, t2) => 5 * (t1 - t2) ^ 1.5;
const LOCALE_SIZE_DISTANCE = (s1, s2) => 2 * (s1 - s2) ^ 1.1;

const PER_WHITE_INDEX = indexOfKey('% White');

const LOCALE_FACTOR = 1000;

var key;
var visible = ["Average Cost", "Admission Rate", "ACT Median", "SAT Average"];

const generalDistanceFunction = (d1, d2, index) => {
    return Math.abs(d1[index] - d2[index]) * 100;
}

const localeDistance = (d1, d2) => {
    return LOCALE_SIZE_DISTANCE(d1[LOCALE_SIZE_INDEX], d2[LOCALE_SIZE_INDEX])
         + LOCALE_TYPE_DISTANCE(d1[LOCALE_TYPE_INDEX], d2[LOCALE_TYPE_INDEX]);
}

function setTextBoxes(d) {
    document.getElementById("name").innerHTML = d[0];
    document.getElementById("control").innerHTML = d[1];
    document.getElementById("acceptance_rate").innerHTML = (d[4] * 100).toFixed(2);
    document.getElementById("average_cost").innerHTML = numberWithCommas(d[17]);
    document.getElementById("region").innerHTML = d[2];
    document.getElementById("locale").innerHTML = d[3];
    document.getElementById("act").innerHTML = d[5];
    document.getElementById("sat").innerHTML = d[6];
    if (!visible.includes(key)) document.getElementById("active-key").innerHTML = d[indexOfKey(key)].toFixed(4);
}

function clearTextBoxes() {
    document.getElementById("name").innerHTML = "";
    document.getElementById("control").innerHTML = "";
    document.getElementById("acceptance_rate").innerHTML = "";
    document.getElementById("average_cost").innerHTML = "";
    document.getElementById("region").innerHTML = "";
    document.getElementById("locale").innerHTML = "";
    document.getElementById("act").innerHTML = "";
    document.getElementById("sat").innerHTML = "";
    if (!visible.includes(key)) document.getElementById("active-key").innerHTML = "";
}

let data;
d3.csv('colleges.csv', function (colleges) {
    data = colleges.map(parseDatum);
    startGraph();
});

let simulation;
function startGraph() {
    if (!data) return;
    if (simulation) simulation.stop();
    d3.select("svg").remove();
    key = document.getElementById("cluster-key");
    key = key.options[key.selectedIndex].value;
    console.log("loading graph with key " + key);
    if (!visible.includes(key)) document.getElementById("active-key-label").innerHTML = key + ":";
    if (visible.includes(key)) document.getElementById("active-key-label").innerHTML = "";

        const svg = d3.select('#wrapper')
            .append('svg')
            //responsive SVG needs these 2 attributes and no width and height attr
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 " + width + " " + height)
            .append('g');

        const cost = svg.append('path')
            .attr('fill', '#aaa');

        const model = new tsnejs.tSNE({
            epsilon: 1,
            dim: 2,
            perplexity: 100,
        });

        var dists;
        // initialize data with pairwise distances
        const index = indexOfKey(key);
        dists = data.map(d1 => data.map(d2 => generalDistanceFunction(d1, d2, index)));
        model.initDataDist(dists);

        simulation = d3.forceSimulation(data
            .map(d => (d.x = width / 2, d.y = height / 2, d)))
            .alphaDecay(0.01)
            .alpha(0.1)
            .force('tsne', function (alpha) {
                // every time you call this, solution gets better
                model.step();

                // Y is an array of 2-D points that you can plot
                let pos = model.getSolution();

                centerx.domain(d3.extent(pos.map(d => d[0])));
                centery.domain(d3.extent(pos.map(d => d[1])));

                data.forEach((d, i) => {
                    d.x += alpha * (centerx(pos[i][0]) - d.x);
                    d.y += alpha * (centery(pos[i][1]) - d.y);
                });
            })
            .force('collide', d3.forceCollide().radius(d => 1.5 + scaleSize(d[SIZE_INDEX])))
            .on('tick', function () {
                circles
                    .attr('cx', d => d.x)
                    .attr('cy', d => d.y)
            });

        /******************************************

                       BRUSHING CODE

        ******************************************/

        var brushContainer = svg.append('g')
            .attr('id', 'brush-container');

        var brush = d3.brush()
            .extent([[-10, -10], [width + 10, height + 10]]);

        brush.on('start', handleBrushStart)
            .on('brush', handleBrushMove)
            .on('end', handleBrushEnd);

        brushContainer.call(brush);

        function handleBrushStart() {
            brush.move(brushContainer, null);
            d3.selectAll('.dot').classed('dot-selected', false);
            clearTextBoxes();
        }

        function handleBrushMove() {
            var sel = d3.event.selection;
            if (!sel) {
                return;
            }

            document.getElementById("college-filter").value = "";

            var [[left, top], [right, bottom]] = sel;

            var num = 0;
            var total_cost = 0;
            var total_acceptance_rate = 0;
            var total_act = 0;
            var total_sat = 0;
            var total_key = 0;
            d3.selectAll('.dot')
                .classed('dot-not-dragged', function(d) {
                    var cx = d.x;
                    var cy = d.y;
                    if (left <= cx && cx <= right && top <= cy && cy <= bottom) {
                        num++;
                        total_cost += d[17];
                        total_acceptance_rate += d[4];
                        total_act += d[5];
                        total_sat += d[6];
                        total_key += d[indexOfKey(key)];
                        return false;
                    } else {
                        return true;
                    }
                });
            
            var avg_cost = total_cost/num;
            var avg_accpt_rate = total_acceptance_rate/num;
            var avg_act = total_act/num;
            var avg_sat = total_sat/num;
            var avg_key = total_key/num;

            if (!avg_cost) avg_cost = 0;
            if (!avg_accpt_rate) avg_accpt_rate = 0;
            if (!avg_act) avg_act = 0;
            if (!avg_sat) avg_sat = 0;
            if (!avg_key) avg_key = 0;

            document.getElementById("acceptance_rate").innerHTML = (avg_accpt_rate * 100).toFixed(2);
            document.getElementById("average_cost").innerHTML = numberWithCommas(avg_cost.toFixed(0));
            document.getElementById("act").innerHTML = avg_act.toFixed(0);
            document.getElementById("sat").innerHTML = avg_sat.toFixed(0);
            if (!visible.includes(key)) document.getElementById("active-key").innerHTML = avg_key.toFixed(4);
        }

        function handleBrushEnd() {
            if (!d3.event.selection && !document.getElementById("college-filter").value) {
                clearSelected();
                clearTextBoxes();
            }
        }

        function clearSelected() {
            d3.selectAll('.dot').classed('dot-not-dragged', false);
        }

        /******************************************

                    END BRUSHING CODE

        ******************************************/

        const circles = svg.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('r', d => scaleSize(d[SIZE_INDEX]))
            .attr('fill', d => scaleAcc(d[ACC_INDEX]))
            .attr("id",function(d,i) {return "dot" + i;} )
            .classed('dot', true)
            .on("click", function(d,i){
                d3.selectAll('.dot').classed('dot-selected', false);
                d3.select("#dot"+i.toString()).classed('dot-selected', true);
                setTextBoxes(d);
            });
    
}

function filter() {
    // Iterates through all categories
    var filterValue = document.getElementById("college-filter").value;
    d3.selectAll(".dot")
        .classed('dot-not-dragged', function(d) {
            return !d[0].toLowerCase().includes(filterValue.toLowerCase());
        });
}

function highlightIvy() {
    var ivy = ["Brown University", "Columbia University in the City of New York",
        "Cornell University", "Dartmouth College", "Harvard University", 
        "University of Pennsylvania", "Princeton University", "Yale University"];
    d3.selectAll(".dot")
        .classed('dot-not-dragged', function(d) {
            return !ivy.includes(d[0]);
        });
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

startGraph(MAIN_KEY);