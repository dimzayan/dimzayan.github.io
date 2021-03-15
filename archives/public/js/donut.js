var slice = function (cx, cy, r, startAngle, endAngle, rad, rin) {
  var x1 = cx + r * Math.cos(-startAngle * rad),
      x2 = cx + r * Math.cos(-endAngle * rad),
      y1 = cy + r * Math.sin(-startAngle * rad),
      y2 = cy + r * Math.sin(-endAngle * rad),
      xx1 = cx + rin * Math.cos(-startAngle * rad),
      xx2 = cx + rin * Math.cos(-endAngle * rad),
      yy1 = cy + rin * Math.sin(-startAngle * rad),
      yy2 = cy + rin * Math.sin(-endAngle * rad);
      
  return [ "M", xx1, yy1,
           "L", x1, y1, 
           "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, 
           "L", xx2, yy2, 
           "A", rin, rin, 0, +(endAngle - startAngle > 180), 1, xx1, yy1, "z"]
}

var getSlice = function(cx, cy, r, rin, value ) {
  var startAngle  = 0
    , total       = 100
    , endAngle    = 360 * value / total;

  return slice(cx,cy,r,startAngle,endAngle,Math.PI / 180, rin)
}

Raphael.fn.donutChart = function (cx, cy, r, rin, values, labels, colors) {
    var paper = this,
        rad = Math.PI / 180,  
        chart = this.set();
        
        
    
        
    function sector(cx, cy, r, startAngle, endAngle, params) {
        
        return paper.path(slice(cx,cy,r,startAngle,endAngle, rad, rin)).attr(params);
        
    }
    
    var angle = 0,
        total = 0,
        start = 0,
        stroke = '#454545',
        process = function (j) {
            var value = values[j],
                angleplus = 360 * value / total,
                popangle = angle + (angleplus / 2),
                color = colors[j],
                ms = 500,
                delta = 30,
                p = sector(cx, cy, r, angle, angle + angleplus, {fill: color, stroke: stroke, "stroke-width": 0})
                
                
              angle += angleplus;
            chart.push(p);
            
            start += .1;
            
            return p;
        };
    for (var i = 0, ii = values.length; i < ii; i++) {
        total += values[i];
    }
    for (i = 0; i < ii; i++) {
        App.charts.push(process(i));
    }
    return chart;
};