function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}const w = 1200;
const h = 800;
const url = "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json";
const margin = {
  top: 0,
  bottom: 0,
  left: 0,
  right: 0 };

const width = w - margin.left - margin.right;
const height = h - margin.top - margin.bottom;

const tooltip = d3.select('body').
append('div').
attr("id", "tooltip").
classed('tooltip', true);

const svg = d3.select('.container').append('svg').
attr('id', 'chart').
attr('width', w).
attr('height', h);

const chart = svg.append('g').
classed('display', true).
attr('transform', `translate(${margin.left}, ${margin.top})`);

const palette = ['#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#fabebe', '#469990', '#e6beff', '#9A6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075'];

const colors = color => d3.interpolateRgb(color, "#ffffff")(0.2);
const color = d3.scaleOrdinal(palette.map(colors));

const treemap = d3.treemap().
size([width, height]).
paddingInner(5);

init.call(chart);

async function init() {
  try {
    const data = await d3.json(url);

    console.log(data);

    const root = d3.hierarchy(data).eachBefore(d => {
      d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name;
    }).
    sum(d => d.value).
    sort((a, b) => b.height - a.height || b.value - a.value);

    treemap(root);

    const cell = this.selectAll("g").
    data(root.leaves()).
    enter().append("g").
    attr("class", "group").
    attr("transform", d => `translate(${d.x0}, ${d.y0} )`);

    cell.append("rect").
    attr("id", d => d.data.id).
    attr("class", "tile").
    attr("height", 0).
    transition().
    duration(200).
    delay((d, i) => i * 10).
    attr("width", d => d.x1 - d.x0).
    attr("height", d => d.y1 - d.y0).
    attr("data-name", d => d.data.name).
    attr("data-category", d => d.data.category).
    attr("data-value", d => d.data.value).
    attr("fill", d => color(d.data.category));

    cell.selectAll("rect").
    on('mouseover', showTooltip).
    on('touchstart', showTooltip).
    on('mouseout', hideTooltip).
    on('touchend', hideTooltip);

    cell.append("text").
    attr('class', 'tile-text').
    selectAll("tspan").
    data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g)).
    enter().append("tspan").
    attr("x", 4).
    attr("y", (d, i) => 13 + i * 12).
    text(d => d);


    const categories = Array.from(new Set(root.leaves().map(elm => elm.data.category)));

    const legend = d3.select("#legend").attr('width', w);

    const legendElm = legend.append("g").
    classed("legend", true).
    attr("id", "legend").
    attr("transform", "translate(" + 0 + "," + 0 + ")").
    selectAll("g").
    data(categories).
    enter().append("g").
    attr("transform", (d, i) => 'translate(' + i * (w / 18) + ',' + 0 + ')');

    legendElm.append("rect").
    attr('width', 15).
    attr('height', 15).
    attr('class', 'legend-item').
    attr('fill', d => color(d));

    legendElm.append("text").
    attr('x', 15 + 3).
    attr('y', 15 + -2).
    text(d => d);


    function showTooltip(d, i) {
      tooltip.
      style('opacity', 1).
      style('left', d3.event.x - tooltip.node().offsetWidth / 2 + 'px').
      style('top', d3.event.y + -90 + 'px').
      attr("data-value", d.data.value).
      html(
      'Name: ' + d.data.name +
      '<br>Category: ' + d.data.category +
      '<br>Value: ' + d.data.value);

    }

    function hideTooltip() {
      tooltip.
      style('opacity', 0);
    }

  } catch (e) {
    console.log(e);
  }
}

// ***********
// SlideMenu
// ***********

class SlideMenu extends React.Component {constructor(...args) {super(...args);_defineProperty(this, "state",
    {
      showMenu: false });_defineProperty(this, "DOMElms",


    {
      hamburger: React.createRef(),
      lineOne: React.createRef(),
      lineTwo: React.createRef(),
      lineThree: React.createRef() });_defineProperty(this, "animations",


    {
      toggleMenu: new TimelineMax({ paused: true, reversed: true }) });_defineProperty(this, "toggleMenu",


















    () => {
      this.setState(prevState => ({
        showMenu: !prevState.showMenu }),
      this.triggerMenu());
    });_defineProperty(this, "triggerMenu",


    () => {
      const { showMenu } = this.state;
      const { toggleMenu } = this.animations;
      showMenu ? toggleMenu.reverse() : toggleMenu.play();
    });_defineProperty(this, "closeMenu",


    () => {
      this.setState({ showMenu: false });
      this.triggerCloseMenu();
    });_defineProperty(this, "triggerCloseMenu",


    () => {
      const { toggleMenu } = this.animations;
      toggleMenu.reverse();
    });}componentDidMount() {const { hamburger, lineOne, lineTwo, lineThree } = this.DOMElms;const { toggleMenu } = this.animations;toggleMenu.to(lineTwo.current, .125, { transformOrigin: "50% 50%", scaleX: 0 }).to(lineOne.current, .250, { transformOrigin: "50% 50%", y: 8, ease: Power2.easeInOut }, "slide").to(lineThree.current, .250, { transformOrigin: "50% 50%", y: -8, ease: Power2.easeInOut }, "slide").to(hamburger.current, .3, { rotation: 90, ease: Power4.easeInOut }, "spin").to(lineOne.current, .250, { rotation: 45, ease: Power4.easeInOut }, "cross").to(lineThree.current, .250, { rotation: -45, ease: Power4.easeInOut }, "cross");hamburger.current.addEventListener('click', this.toggleMenu);}


  render() {
    const { showMenu } = this.state;
    const { hamburger, lineOne, lineTwo, lineThree } = this.DOMElms;

    return (
      React.createElement(React.Fragment, null,
      React.createElement(Menu, {
        showMenu: showMenu,
        hamburger: hamburger,
        lineOne: lineOne,
        lineTwo: lineTwo,
        lineThree: lineThree }),


      React.createElement(NavBar, {
        showMenu: showMenu,
        closeMenu: this.closeMenu })));



  }}



const Menu = ({ hamburger, lineOne, lineTwo, lineThree, showMenu }) => {
  const svgClass = showMenu ? 'hamburger js-change-color' : 'hamburger';

  return (
    React.createElement("div", { className: "menu" },
    React.createElement("svg", { ref: hamburger, className: svgClass, xmlns: "http://www.w3.org/2000/svg", viewBox: "17 28 45 45" },
    React.createElement("line", { ref: lineOne, className: "line-one", x1: "25", y1: "42", x2: "55", y2: "42", fill: "none", strokeMiterlimit: "10", strokeWidth: "4" }),
    React.createElement("line", { ref: lineTwo, className: "line-two", x1: "20", y1: "50", x2: "55", y2: "50", fill: "none", strokeMiterlimit: "10", strokeWidth: "4" }),
    React.createElement("line", { ref: lineThree, className: "line-three", x1: "25", y1: "58", x2: "55", y2: "58", fill: "none", strokeMiterlimit: "10", strokeWidth: "4" }))));



};

const NavBar = ({ showMenu, closeMenu }) => {
  const certifications = ['Responsive Web Design', 'Front End Libraries', 'Data Visualization'];
  const projects = [
  ['Tribute Page', 'Survey Form', 'Product Landing', 'Technical Doc', 'Portfolio'],
  ['Quote Machine', 'Markdown Previewer', 'Drum Machine', 'Calculator', 'Pomodoro Clock'],
  ['Bar Chart', 'Scatterplot Graph', 'Heat Map', 'Choropleth Map', 'Treemap Diagram']];

  const links = [
  [
  ['oRWLEy', 'fcc-projects_Build-Tribute-Page-MUHAMMAD-ALI'],
  ['bJPLPg', 'fcc-projects_Build-a-Survey-Form'],
  ['YoKJQm', 'fcc-projects_Build-Landing-Page-NOICETIMER'],
  ['yWJmgd', 'fcc-projects_Technical-Documentation-Page'],
  ['zYxzewJ', 'Portfolio']],

  [
  ['drbXqO', 'fcc-projects_Build-a-Random-Quote-Machine'],
  ['WmNePp', 'fcc-projects_Build-a-Markdown-Previewer'],
  ['WWZONw', 'fcc-projects_Build-a-Drum-Machine'],
  ['axaRwL', 'fcc-projects_Build-a-JavaScript-Calculator'],
  ['BEmaVK', 'fcc-projects_Build-a-Pomodoro-Clock']],

  [
  ['qvNaVM', 'fcc-projects_Visualize-Data-with-Bar-Chart'],
  ['ZPLaaq', 'fcc-projects_Visualize-Data-with-Scatterplot-Graph'],
  ['WmRYgM', 'fcc-projects_Visualize-Data-with-Heat-Map'],
  ['pYeOWG', 'fcc-projects_Visualize-Data-with-Choropleth-Map'],
  ['VRbZyd', 'fcc-projects_Visualize-Data-with-Treemap-Diagram']]];


  const nav = certifications.map((certification, i) => {
    const li = projects[i].map((project, j) =>
    React.createElement("li", null,
    project,
    React.createElement("a", { onClick: closeMenu, className: "nav-link", target: "_blanc", rel: "noopener noreferrer", href: 'https://codepen.io/B-Tarik/full/' + links[i][j][0] }, "codepen"), "|",
    React.createElement("a", { onClick: closeMenu, className: "nav-link", target: "_blanc", rel: "noopener noreferrer", href: 'https://github.com/B-Tarik/' + links[i][j][1] }, "github")));



    return (
      React.createElement("ul", { key: i }, " ", certification,
      li));


  });

  return (
    React.createElement(React.Fragment, null,
    React.createElement("nav", { id: "navbar", className: "navbar", role: "navigation", style: { transform: showMenu ? 'translateX(0px)' : null } },
    nav),

    React.createElement("div", {
      className: "dark-bg",
      onClick: closeMenu,
      style: { zIndex: showMenu ? 1 : -1, opacity: showMenu ? 1 : 0 } })));



};

ReactDOM.render(React.createElement(SlideMenu, null), document.getElementById("root"));