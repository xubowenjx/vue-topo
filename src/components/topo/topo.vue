<template>
  <div class="micro-topo">
    <div class="micro-topo-container"
         ref="topo"></div>
  </div>
</template>
<script lang="js">
import * as d3 from 'd3';
function lengthName (name, plus = 50) {
  let l = name.length;
  let res = name.match(/[0-9a-zA-Z]/g);
  let l1 = res ? res.length : 0;
  let l2 = l - l1;
  return l2 * 15 + l1 * 8 + plus;
}
/* eslint-disable */
/* tslint:disable */
const diagonal = d3.linkHorizontal().source(d => {
  d.sx = d.source.x;
  d.sy = d.source.y;
  //右边开始画
   d.sx = d.source.x +lengthName(d.source.name);
  return [d.source.x +lengthName(d.source.name), d.source.y];
  if (Math.abs(d.source.x - d.target.x) < 40){
    return [d.source.x, d.source.y];
  }
   if (Math.abs(d.source.x + lengthName(d.source.name) - d.target.x - lengthName(d.target.name)) < 40){
    d.sx = d.source.x +lengthName(d.source.name);
    return [d.source.x +lengthName(d.source.name), d.source.y];
  }
  if (d.source.x > d.target.x) {
    return [d.source.x, d.source.y];
  }
  d.sx = d.source.x +lengthName(d.source.name);
  return [d.source.x +lengthName(d.source.name), d.source.y];
}).target(d => {
  d.tx = d.target.x;
  d.ty = d.target.y;
  if (Math.abs(d.source.x - d.target.x) < 40){
    return [d.target.x, d.target.y];
  }
  if (Math.abs(d.source.x +lengthName(d.source.name) - d.target.x - lengthName(d.target.name)) < 40){
     d.tx = d.target.x + lengthName(d.target.name);
    return [d.target.x + lengthName(d.target.name), d.target.y];
  }
  if (d.source.x < d.target.x) {
    return [d.target.x, d.target.y];
  }
  d.tx = d.target.x + lengthName(d.target.name);
  return [d.target.x + lengthName(d.target.name), d.target.y];
});
const diagonalvertical = d3.linkVertical().source(d => {
  d.sx = d.source.x;
  d.sy = d.source.y;
  //从右边开始画
   d.sx = d.source.x +lengthName(d.source.name);
    return [d.source.x +lengthName(d.source.name), d.source.y];
  if (Math.abs(d.source.x - d.target.x) < 40){//起点在中单的相对
    return [d.source.x, d.source.y];
  }
  if (Math.abs(d.source.x +lengthName(d.source.name) - d.target.x - lengthName(d.target.name)) < 40){
    d.sx = d.source.x +lengthName(d.source.name);
    return [d.source.x +lengthName(d.source.name), d.source.y];
  }
  if (d.source.x > d.target.x) {
    return [d.source.x, d.source.y];
  }
  d.sx = d.source.x +lengthName(d.source.name);
  return [d.source.x +lengthName(d.source.name), d.source.y];
}).target(d => {
  d.tx = d.target.x;
  d.ty = d.target.y;
    if (Math.abs(d.source.x - d.target.x) < 40){
    return [d.target.x, d.target.y];
  }
  if (Math.abs(d.source.x +lengthName(d.source.name) - d.target.x - lengthName(d.target.name)) < 40){
    d.tx = d.target.x + lengthName(d.target.name);
    return [d.target.x + lengthName(d.target.name), d.target.y];
  }
  if (d.source.x < d.target.x) {
    return [d.target.x, d.target.y];
  }
  d.tx = d.target.x + lengthName(d.target.name);
  return [d.target.x + lengthName(d.target.name), d.target.y];
});
let assets_key = ['DATABASE','JBOSS','MARIADB','MYSQL','ORACLE','POSTGRESQL','REDIS','SPRING_BOOT','UNKNOWN','USER'];
let assets = assets_key.map(el=>{
  return {
    el:require('../../../assets/'+el)
  }
})
export default {
  props: {
    datas: {
      type: Object,
      default() {
        return {
          nodes: [],
          calls: [],
        };
      },
    },
  },
  data() {
    return {
      assets,
      width: 600,
      height: 600,
      force: '',
      svg: '',
      graph: '',
      link: '',
      node: '',
      zoom: '',
    };
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize);
    // this.$store.commit('skywalking/setCurrentNode', []);
  },
  mounted() {
    window.addEventListener('resize', this.resize);
    this.width = this.$refs.topo.offsetWidth;
    this.height = document.body.clientHeight - 64;
    this.svg = d3
      .select(this.$refs.topo)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);
      this.draw()
  },
  watch: {
    'datas.nodes': 'draw',
  },
  methods: {
    draw() {
       const codeId = this.datas.nodes.map(i => i.id);
      for (let i = 0; i < this.datas.calls.length; i += 1) {
        const element = this.datas.calls[i];
        if(codeId.indexOf(element.target) === -1 ) {
          this.datas.calls[i].target = this.datas.calls[i].source;
        }
      }
      this.svg.select('.graph').remove();
      this.force = d3
        .forceSimulation(this.datas.nodes)
        .force('collide', d3.forceCollide().radius(() => 90))
        .force('yPos', d3.forceY().strength(1))
        .force('xPos', d3.forceX().strength(1))
        .force('charge', d3.forceManyBody().strength(-500))
          // .force('cluster', d3.cluster().strength(0.2))

  // // apply collision with padding
  // .force('collide', d3.forceCollide()
  //   .strength(0.7))
        .force( 'link', d3.forceLink(this.datas.calls).id(d => d.id))
        .force('center', d3.forceCenter(this.width / 2, this.height / 2))
        .on('tick', this.tick)
        .stop();
      this.graph = this.svg.append('g').attr('class', 'graph');
      this.svg.call(this.getZoomBehavior(this.graph));
      this.svg.on('click', (d, i) => {
        //this.$emit('setCurrentApp', {name: '', id: ''});
        this.toggleNode(this.node, d, false);
        this.toggleLine(this.line, d, false);
        // this.toggleMarker(marker, currNode, true);
        this.toggleLineText(this.linkText, d, false);
      });
      this.defs = this.graph.append('defs');
      //normal marker
      this.arrowMarker = this.defs
        .append('marker')
        .attr('id', 'arrow')
        .attr('markerUnits', 'strokeWidth')
        .attr('markerWidth', '12')
        .attr('markerHeight', '12')
        .attr('viewBox', '0 0 12 12')
        .attr('refX', '11')
        .attr('refY', '6')
        .attr('orient', 'auto');
        //red marker
         this.arrowMarkerRed = this.defs
        .append('marker')
        .attr('id', 'arrowred')
        .attr('markerUnits', 'strokeWidth')
        .attr('markerWidth', '12')
        .attr('markerHeight', '12')
        .attr('viewBox', '0 0 12 12')
        .attr('refX', '11')
        .attr('refY', '6')
        .attr('orient', 'auto');
      const arrow_path = 'M2,2 L10,6 L2,10 L5,6 L2,2';
      this.glink = this.graph.append('g').selectAll('.link');
      this.link = this.glink.data(this.datas.calls).enter().append('g');
      this.line = this.link.append('path').attr('class', 'link')
      .attr('stroke-dasharray', d => d.cpm ? '30 3': '30 3')
      .attr('stroke', d => d.finish ? 'rgba(183, 28, 28, 0.9)':'rgba(255, 199, 31, 0.4)').
      attr("marker-end",d => {
        return d.finish? "url(#arrowred)":"url(#arrow)"//引用箭头
      });
      this.linkText = this.link.append('g');
      this.linkText
        .append('rect')
        .attr('rx', 10)
        .attr('ry', 10)
        .attr('width', d=>{
          let l1 = lengthName(d.cpm+'',0)
          if(l1==0)return 0;
          return l1>50?l1:50
        })
        .attr('height', 20)
        .attr('x',  d=>{
          let l1 = lengthName(d.cpm+'',0)
          return -(l1>50?l1:50)/2
        })
        .attr('y', -10)
        .attr('fill', '#292d34');
      this.linkText
        .append('text')
        .attr('font-size', 10)
        .attr('class', 'linkText')
        .attr('text-anchor', 'middle')
        .attr('y', 3)
        .text(d => d.cpm);
      this.arrowMarker.append('path').attr('d', arrow_path).attr('fill','rgba(230, 170, 20,.8)');
      this.arrowMarkerRed.append('path').attr('d', arrow_path).attr('fill','red');
      this.gnode = this.graph.append('g').selectAll('.node');
      const that = this;
      this.node = this.gnode.data(this.datas.nodes)
        .enter()
        .append('g')
        .call(d3.drag()
            .on('start', this.dragstart)
            .on('drag', this.dragged)
            .on('end', this.dragended)
        )
        .on('click', function(d, i) {
          event.stopPropagation();
          that.node.attr('class', '');
          d3.select(this).attr('class', 'node-active');
          const copyD = JSON.parse(JSON.stringify(d));
          delete copyD.x;
          delete copyD.y;
          delete copyD.vx;
          delete copyD.vy;
          delete copyD.fx;
          delete copyD.fy;
          delete copyD.index;
          that.$emit('setCurrentApp', copyD);
          that.toggleNode(that.node, d, true);
          that.toggleLine(that.line, d, true);
          // this.toggleMarker(marker, currNode, true);
          that.toggleLineText(that.linkText, d, true);
        });
      this.node
        .append('rect')
        .attr('class', d => {
          if(d.sla){
            if(d.sla < 100) {
              return 'node-error';
            } else if (d.sla > 100 && d.sla < 10000) {
              return 'node-error';
            }
          }
          return 'node';
        })
        .attr('rx', 17)
        .attr('ry', 17)
        .attr('width', function(d){
          let name  = d.name;
          let l  = name.length;
          let res = name.match(/[0-9a-zA-Z]/g);
          let l1 = res?res.length:0;
          let l2 = l-l1;
          return l2*15+l1*8+50;
        })
        .attr('height', 34);
      this.node
        .append('image')
        .attr('width', 20)
        .attr('height', 20)
        .attr('style', 'cursor: move;')
        .attr('x', 10)
        .attr('y', 7)
        .attr('xlink:href',d => {
          if( !d.type || d.type === 'N/A') {
            return this['UNKNOWN_CLOUD']
          }
          return this[d.type.toUpperCase().replace('-','')]|| this['UNKNOWN_CLOUD'];
        });
      this.node
        .append('text')
        .attr('font-size', 10)
        .attr('text-anchor', 'middle')
        .attr('x', d => d.name.length * 8 + 40)
        .attr('y', 21)
        .attr('font-weight', 600)
        .text(d => {
          if (!d.sla) return;
          const temp = d.sla > 100 ? d.sla/100 : d.sla;
          if(temp === 100) return;
          const rate = 100 - temp;
          return rate.toFixed(1) + '%' 
        })
        .attr('fill', 'rgb(240, 84, 20)');
      this.node
        .append('text')
        .attr('class', 'node-name ellipsis')
        .attr('x', 38)
        .attr('font-size', 13)
        .attr('y', 21)
         .attr('title', d => d.name)
        .text(d => d.name)
        .attr('fill', '#fafafa');
      d3.timeout(() => {
        for (
          let i = 0,
            n = Math.ceil(
              Math.log(this.force.alphaMin()) /
                Math.log(1 - this.force.alphaDecay())
            );
          i < n;
          i += 1
        ) {
          this.force.tick();
          this.tick();
        }
      });
    },
    isLinkNode(currNode, node) {
    if (currNode.id === node.id) {
        return true;
    }
    return this.datas.calls.filter(i => 
      (i.source.id === currNode.id || i.target.id === currNode.id) &&
      (i.source.id === node.id || i.target.id === node.id)
    ).length;
  },
    toggleNode(nodeCircle, currNode, isHover) {
    if (isHover) {
        // 提升节点层级 
      nodeCircle.sort((a, b) => a.id === currNode.id ? 1 : -1);
      nodeCircle
          .style('opacity', .2)
          .filter(node => this.isLinkNode(currNode, node))
          .style('opacity', 1);
    } else {
        nodeCircle.style('opacity', 1);
    }
},
toggleLine(linkLine, currNode, isHover) {
  if (isHover) {
    linkLine
      .style('opacity', .05)
      .style('animation', 'none')
      .filter(link => this.isLinkLine(currNode, link))
      .style('opacity', 1)
      .style('animation', 'dash 6s linear infinite');
      // .classed('link-active', true);
    } else {
      linkLine
        .style('opacity', 1)
        .style('animation', 'dash 6s linear infinite');
        // .classed('link-active', false);
    }
  },
isLinkLine(node, link) {
    return link.source.id == node.id || link.target.id == node.id;
},
toggleLineText(lineText, currNode, isHover) {
  if (isHover) {
    lineText
      .style('fill-opacity', link => this.isLinkLine(currNode, link) ? 1.0 : 0.0);
      } else {
      lineText
      .style('fill-opacity', '1.0');
    }
  },
    toggleMarker(marker, currNode, isHover) {
      if (isHover) {
        marker.filter(link => this.isLinkLine(currNode, link))
          .style('transform', 'scale(1.5)');
      } else {
        marker
          .attr('refX', nodeConf.radius.Company)
          .style('transform', 'scale(1)');
      }
    },
    resize() {
      this.svg.attr('width', this.$refs.topo.offsetWidth);
      this.svg.attr('height', document.body.clientHeight - 64);
    },
    tick() {
      this.line
        .attr('stroke-width', 1)
        .attr(
          'd',
          d => {
            let r = Math.abs(d.sx-d.tx) - Math.abs(d.sy-d.ty);
            if(r>0) return diagonal(d);
            if(r<0) return diagonalvertical(d);
            return diagonal(d);
          }
        );
      this.linkText.attr('transform',d => {
        let tagx = 1
        return `translate(${d.sx - (d.sx-d.tx)/2}, ${d.sy - (d.sy-d.ty)/2})`
      });
      this.node.attr('transform', d => `translate(${d.x},${d.y - 20})`);
    },
    getZoomBehavior(g) {
      return d3
        .zoom()
        .scaleExtent([0.3, 10])
        .on('zoom', () => {
          g.attr(
            'transform',
            `translate(${d3.event.transform.x},${d3.event.transform.y})scale(${
              d3.event.transform.k
            })`
          );
        });
    },
    dragstart(d) {
      this.node._groups[0].forEach(d => {
        d.__data__.fx = d.__data__.x;
        d.__data__.fy = d.__data__.y;
      });
      if (!d3.event.active) {
        this.force.alphaTarget(0.01).restart();
      }
      d3.event.sourceEvent.stopPropagation();
    },
    dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    },
    dragended() {
      if (!d3.event.active) {
        this.force.alphaTarget(0);
      }
    },
  },
};
</script>
<style lang="scss">
  @import url("./topo.scss");
</style>
