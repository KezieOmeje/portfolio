import * as d3 from 'd3'
import d3Tip from 'd3-tip'
import d3Annotation from 'd3-svg-annotation'
d3.tip = d3Tip

const margin = { top: 30, left: 70, right: 30, bottom: 30 }
const height = 400 - margin.top - margin.bottom
const width = 680 - margin.left - margin.right

const svg = d3
  .select('#chart-cyclists')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3
  .scaleLinear()
  .domain([2012, 2019])
  .range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 5000])
  .range([height, 0])

const line = d3
  .line()
  .x(d => xPositionScale(d.year))
  .y(d => yPositionScale(d.injured))
// Import your data file
d3.csv(require('../data/cyclists.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  // Draw your dots

  svg
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('fill', 'none')
    .attr('stroke', '#addd8e')

  /* Add in your temperature circles */
  const tip = d3
    .tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return `${d.year} <span style='color:red'>${d.injured}</span>`
    })

  svg
    .selectAll('circle')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('r', 3)
    .attr('stroke', '#fdbb84')
    .attr('cx', d => {
      return xPositionScale(d.year)
    })
    .attr('cy', d => {
      return yPositionScale(d.injured)
    })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)

  svg.call(tip)

  // Draw your lines

  // Add your axes
  const annotations = [
    {
      note: {
        title: '',
        label: 'Less cyclists injured but more killed'
      },
      data: { year: 2019, injured: 1984 },
      dx: -5,
      dy: 20,
      color: 'black'
    }
  ]

  const makeAnnotations = d3Annotation
    .annotation()
    .accessors({
      x: d => xPositionScale(d.year),
      y: d => yPositionScale(d.injured)
    })
    .annotations(annotations)

  svg.call(makeAnnotations)

  const xAxis = d3.axisBottom(xPositionScale).tickFormat(d3.format('d'))
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  const yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
}
