var addthis_share = {
  templates: { 
      twitter   : '{{description}} Grow your knowledge at http://surveyofthestates.com #CEE' 
    
    , email     : '{{title}} | Grow your knowledge and get the facts on Financial and Economic Education at http://surveyofthestates.com'
    
  }
}

var updateAddThis = function(obj) {
  if(addthis === undefined) { return false; }
  addthis.update('share', 'description', obj.description);
};

var offset = '40%';

var App = {
  
  section       : null,
  map           : {},
  usRaphael     : {},
  charts        : [],
  years         : [2002, 2004, 2007, 2009, 2011, 2014, 2016],
  
  currentSection : function() {
    return $('#' + $('body').data('section'));
  },
  
  currentStat    : function() {
    return App.currentSection().find('.active');
  },
  
  selectSection : function(section, callback) {  
    
    var callback    = callback || function() {};
    
    if(!section || section == App.section) return;
    
    App.clearSection(App.section);
    App.section = section;

    $('body').data('section', section);
    $('body').removeClass().addClass('section-'+section);

    App.updateHeader(section);

    App.quotes.update();
    
    App.animations[section](callback);

    App.usRaphael.line.toFront();

  },
  
  showMapOverlay    : function(state) {
   
    var data      = MapTimeline.states[state]
      , statuses  = data[App.category][App.year_id]
      , status1   = Number(statuses[0])
      , status2   = Number(statuses[1])
      , link1     = MapTimeline.links[state][App.category][0]
      , link2     = MapTimeline.links[state][App.category][1]
      , link3     = MapTimeline.links[state][App.category][2]
      
    $('#map-overlay .title').html(data.title + ' - ' + App.years[App.year_id]);
    $('#map-overlay .status').hide();
    $('#map-overlay .exception').hide();
    $('#map-overlay').removeClass().addClass(App.category)
    $('#map-overlay #testing-link').hide();
    $('#map-overlay #status-x').hide();

    if(!status1) {

      $('#map-overlay #status-'+status1).show();
    } else {
      for(var i=1;i<= status1;i++) {
  
        
        $('#map-overlay #status-'+i).show();
       
        
      }
    }
    
    if(data.messages && data.messages[App.category] && App.year_id === 6 && state !== 'il') {
      $('#map-overlay .message').html(data.messages[App.category]).show()
    } else {
      $('#map-overlay .message').hide()
    }

    if(data.messages && data.messages[App.category] && state === 'il' && App.year_id === 5) {
      $('#map-overlay .message').html(data.messages[App.category]).show()
    }


    
    // Hard-coded hack for exceptions!
  
    var hideStandardsImplementedByDistricts = false;
    var cat = App.category;
    var yid = App.year_id;

    switch(state) {
      case 'ca':
        if(cat === 'economy' && yid === 0) {
          hideStandardsImplementedByDistricts = true;
        }
        break;
      case 'il':
        if(cat === 'finance' && yid === 0) {
          hideStandardsImplementedByDistricts = true;
        }
        break;
      case 'ms':
        if(cat === 'finance' && yid === 3) {
          hideStandardsImplementedByDistricts = true;
        }
        break;
      case 'nm':
        if(cat === 'finance' && (yid == 3 ||  yid==5 ||yid==6) ) {
          $('#map-overlay #status-3').show();
        }

        if(cat === 'finance' && yid === 2) {
          hideStandardsImplementedByDistricts = true;
        }

        break;
      case 'nh':
        if(cat === 'economy' && (yid === 2 || yid === 3 || yid === 5)) {
          hideStandardsImplementedByDistricts = true;
        }
        if(cat === 'finance' && (yid === 4 || yid === 5)) {
          hideStandardsImplementedByDistricts = true;
        }
        break;

      case 'ny': 
        if((cat === 'finance' && yid === 1) || (yid === 0)) {
           hideStandardsImplementedByDistricts = true;
        }
        break;
      case 'nv':
        if(cat === 'economy' && yid === 0) {
          hideStandardsImplementedByDistricts = true;
        }
        break;
      case 'ok':
        if(cat === 'finance' && yid === 5) {
          $('#map-overlay #status-3').hide();
        }
    }

    if(hideStandardsImplementedByDistricts) {
      $('#map-overlay #status-2').hide();
    }
    
    
    if(status2) {
      $('#map-overlay #status-5').show();

      if(App.year_id === 6 && link3) {
     
        $('#map-overlay #testing-link').attr('href',link3);
        $('#map-overlay #testing-link').show();
      } else {

        $('#map-overlay #testing-link').hide();
      }
    }
    

    if(link1 && status1 && App.year_id === 6) {
      $('#map-overlay #standards-link').attr('href',link1).show();
    } else {
      $('#map-overlay #standards-link').hide();
    }
    
    if(link2 && status1 && App.year_id === 6) {
      $('#map-overlay #course-link').attr('href',link2).show();
    } else {
      $('#map-overlay #course-link').hide();
    }
 
     if(yid === 6 && state === 'nm' && App.category=== 'finance') {

      $('#map-overlay #course-link').attr('href',link2).show()
    }


    if(data.video) {
      $('#map-overlay .video').show();
    } else {
      $('#map-overlay .video').hide();
    }
    
    
    $('#map-overlay').show().css({
        marginTop   : - $('#map-overlay').height() / 2
      , display     : 'block'
    });
    
      
    $('#map-overlay').show();
    
    
    $('html').one('click', function(e) {
      e.preventDefault();
      
      $('#map-overlay').hide();
    });
  }
  
}

// Quote Engine
App.quotes = {
  next : function() {

    var $section = $('#' + App.section)
      , i        = $section.data('i')

    if($section.data('i') == undefined) {
      i = -1;
    }

    if(App.quotes.data[App.section][i+1]) {
      App.quotes.select(i+1);
    }

  },
  
  previous  : function() {

    var $section = $('#' + App.section)
      , i        = $section.data('i')


    if(App.quotes.data[App.section][i-1]) {
      App.quotes.select(i-1);
    }
  },
  
  select : function(pos) {
    var quotes  = App.quotes.data[App.section]
      , pos     = (pos == 'last' ? quotes.length - 1 : pos)
      , quote   = quotes[pos];

  
    $('#quotes blockquote').html('<span >"' + quote.quote + '"</span><legend>' + quote.author + '</legend>');
    $('#' + App.section).data('i', pos);
    
    if(pos == 0) {
      $('#previous-quote').addClass('hidden');
      $('#next-quote').removeClass('hidden');
    } else if(pos == (quotes.length - 1)) {
      $('#previous-quote').removeClass('hidden');
      $('#next-quote').addClass('hidden');
    } else {
      $('#previous-quote').removeClass('hidden');
      $('#next-quote').removeClass('hidden');
    }
    
    $('#quotes .share').css({
      left    : $('#quotes blockquote span').offset().left + $('#quotes blockquote span').width()
    });

    updateAddThis(quote.share);
  },
  
  update : function() {
    
    if(App.section == 'map') {
      $('#quotes').addClass('collapsed');
      $('#map-footer').removeClass('collapsed');
    } else if(App.quotes.data[App.section] ) {
      $('#map-footer').addClass('collapsed');
      $('#quotes').removeClass('collapsed');
      App.quotes.select(0);
    } else {
      $('#map-footer').addClass('collapsed');
      $('#quotes').addClass('collapsed');
    }
    
  }
}


// App.counter

// DEBT COUNTER
// debt: $1.2 Trillion in student loan debt outstanding as of 7/1/2013
// debtPerSec: Increase in student loan debt outstanding per second since 6/30/2010
// timestamp: in seconds since midnight 1/1/1970 as of 6/30/2010

App.counter = {
  
  settings : {
      debt         : 833000000000
    , debtPerSec   : 2853.88
    , timeStamp    : 1277956800
  },
  
  getDebtIncrease : function() {
    var today = new Date();
    var newSeconds = today.getTime() / 1000 - App.counter.settings.timeStamp;
    return newSeconds * App.counter.settings.debtPerSec
  },
  
  getDebt         : function() {
    return Math.round(App.counter.settings.debt + App.counter.getDebtIncrease());
  },
  
  render      : function() {
    App.counter.debt = App.counter.getDebt();
      var debt = String(App.counter.debt);
      for(var i=0; i < debt.length; i++) {
        var digit = '<dd class="digit"><span>' + debt[i] + '</span></dd>';
        // Adding commas
        if(i%3 == 0 && i != (debt.length - 1)) {
          digit += '<dd class="comma">,</dd>';
        }
        $('#debt-counter').append($(digit));
        $('#header-counter').append($(digit).clone());
        $('#header-counter .digit:last').after($('#header-counter .share'));
      }
      
      clearInterval(App.counter.it);
      App.counter.it = setInterval(App.counter.update, 2000);
  },
  
  update      : function() {
    var debt      = String(App.counter.getDebt())
        , digits    = debt.split('') 
        , changed   = false;
        
    
      $.each(digits, function(i) {
        var t     = debt.length - i
          , _this = this;
        if(this != App.counter.debt[i] || changed) {
        
          $('#debt-counter dd.digit:eq(' + i + ') span, .counter dd.digit:eq(' + i + ') span').delay(t * 100).fadeOut(200, function() {
            $(this).html(debt[i]);
          }).fadeIn(500);
          changed = true;
        }
      })
    
      
      App.counter.debt = debt;
  }
  
  
}


App.updateHeader = function(section) {
    
  var navLink   = $('#nav-'+ section);
  var showMenu = Boolean($('#'+section).data('menu'));
  
  if(navLink.length > 0) {
    
   navLink.siblings('.selected').stop(true, false).removeClass('selected');
   navLink.addClass('selected');
   

   
  } else {
   $('header nav .selected').removeClass('selected');
   
  }

  if(showMenu) {
    $('header').addClass('expanded');
  } else {
    $('header').removeClass('expanded');
  }
  

}

App.clearSection = function(section) {
  $('.asset').removeClass('visible');
  
  switch(section) {
    case 'cost':
      $('#student').stop(1,1).animate({
        right : -300
      })
      $('#red-pig').stop(true, false).css({bottom:-200}).removeClass('broken');
      // $('#clock').stop(1,0).hide().removeClass('fixed');
      
      $('#clock').stop(1,0).animate({
        left      : -250
      }, {
        duration  : 700
      })
      break;
    
    case 'situation':
      App.animations.removeBooks();
      break;
      
    case 'challenge':
       // App.animations.blackboard(true);
       
       $('#apple, #globe, #book').stop(1,0).animate({
          bottom  : -200
        }, {
          duration  : 800,
          easing    : 'easeInOutBack'
        })
       
      break;
    case 'benefits':
      App.animations.piggybank(true);
      // App.animations.blackboard(true);
      break;
    case 'map':
    
      break;
    case 'act':
      $('.character').removeClass('visible intro');
      break
  }
}

var goToStat = function(stat) {
  
}

var first = true;
var showStat = function(stat) {


  var statObj = stat.data('statObj')
    , section = stat.data('section')
    , hash    = stat.attr('id')
    , anim;

  $('.stat').removeClass('active');
  stat.addClass('active');
  
  if(statObj && statObj.animation) {
    anim = App.animations[statObj.animation];
  } else {
    anim = function() {
      
    }
  }
  
  if(section != $('body').data('section')) {
    App.selectSection(section, anim);
  } else {
    anim();
  }
  
  stat.attr('id', hash+'-');
  window.location.href  = '#' + hash;
  stat.attr('id', hash);

  if(section != undefined && !$('#'+section).hasClass('noshare')) {
   
    $('#stat-share').offset({
      left        : stat.offset().left  + stat.width(),
      top         : stat.offset().top   + Number(stat.css('padding-top').replace('px',''))
    });
    
  }

  if(first) {
    first = false;
    $('#stat-share .share-menu').stop(1,1).delay(1000).fadeIn().delay(2000).fadeOut();
  }

}


var nextStat = function() {
  var next          = App.currentStat().next('.stat')
    , nextSection   = App.currentSection().next('section')
     
  if(App.currentStat() && next.length > 0 ) {
    showStat(next);
  } else {
    if(nextSection.length) {
      window.location.href = '#' + nextSection.attr('id');
    }
    
  }
}

function refreshDisplay() {

  $('#cover section').css({
      minHeight   : $(window).height()
    , height      : $(window).height()
  });
  
  $.each($('section .stat'), function(i) {
    if(!$(this).parents('section').hasClass('noresize') && !$(this).hasClass('nopadding')) {
      var p  = ($(window).height() - $(this).height() - 100) / 2;
     $(this).css({
        padding       : p +'px 0 ' + p + 'px 0'
      }) 
    }
  });
  
    
  var h   = $(window).height() - $('#map-footer').height() - $('#header').height() - 130
    , hp  = Math.min(.90, h / 800)
    , sc  = 'scale('+ hp + ',' + hp + ')';
    

  $('#map-wrap').css({
    'padding-top'               : ($(window).height() - $('#map-wrap').height())/2
    
  })
  App.usRaphael.line.toFront();
}

var resizeTimer = 0;


var onResizeEnd = function() {
  window.location.href = window.location.href
}

var lastScrollTop = 0
  , scrollDir     = null
  , lastScroll    = 0;
  
$(window).scroll(function(event){
  $('#map-overlay').hide()
  var st = $(this).scrollTop();

  var prevScrollDir = scrollDir;

  if (st > lastScrollTop && scrollDir != 'down') {  
    scrollDir = 'down';
  } else if(st < lastScrollTop && scrollDir != 'up') {
    scrollDir = 'up';
  }
  if(prevScrollDir !== scrollDir) {
    createWaypoints(scrollDir);
  };
  
  lastScroll     = st - lastScrollTop; 
  lastScrollTop  = st;
   
  $('#map-wrap').css({
    top : Math.max(60, $('#map').offset().top  - $(window).scrollTop() )
  });
  
   
});

$(window).resize(function() {
  refreshDisplay();
  if(!$.browser.msie) {
    if (resizeTimer) {
      clearTimeout(resizeTimer);      
    }
    resizeTimer = setTimeout(onResizeEnd, 500);
  }

});

App.buildMap = function() {

  $('#map-footer .wrap').append($('<div class="map-donuts"/>'));
  $.each(MapTimeline.stats, function(i) {
    var donut = $('#templates .donut').clone();
    donut.find('label').html(this.economy.label);
    donut.attr('id', 'donut-'+i);
    donut.find('.amount').attr('id', 'donut-'+i+'-amount');
    $('#map-footer .map-donuts').append(donut);
    Raphael('donut-'+i+'-amount', 60,60).donutChart(30,30, 30,20, [50,50], ['',''],['#FFF','#CCC']);
  });
  
  
  App.map = Raphael("us-map", 1000, 800);
  
  var attr = {
        "fill": "#eee",
        "stroke": "#333",
        "stroke-opacity": ".5",
        "stroke-linejoin": "round",
        "stroke-miterlimit": "4",
        "stroke-width": "2",
        "stroke-dasharray": "none"
      }
    //Draw Map and store Raphael paths
    for (var state in usMap) {
      if(state === 'xinetodc') {

        App.usRaphael.line = App.map.path(usMap['xinetodc']).attr({
          "stroke": "#FFF",
           "fill": "#FFF",
          "stroke-opacity": "0",
          "stroke-width": "2",
          "stroke-dasharray": "0.5"
        });

      } else {
        var p = App.map.path(usMap[state])
        App.usRaphael[state] = App.map.path(usMap[state]).attr(attr);
        App.usRaphael[state + '-pattern'] = App.map.path(usMap[state]).attr(attr).attr({
          'fill'  : 'url(./images/dot-pattern.png)'
        });
        
        (function (st, st2, state) {
          st[0].style.cursor = "pointer";
          st2[0].style.cursor = "pointer";
          st[0].onclick = function (e) {
            e.stopPropagation();
            App.showMapOverlay(state);
          };
          
          st2[0].onclick = function(e) {
            e.stopPropagation();
            App.showMapOverlay(state);
          };

          
        })(App.usRaphael[state],App.usRaphael[state + '-pattern'], state);
      }
    }

    App.usRaphael.line.toFront();
    
    
    $('#map-overlay .link').bind('click', function(e) {
      e.stopPropagation(); 
    });

}


function createWaypoints(scrollDir) {

  Waypoint.destroyAll();

  var offset = (scrollDir === 'up') ? '20%' : '50%';

  var waypoints = $('.stat').waypoint({
    handler: App.onStat, 
    offset : offset, 
    continuous : false, 
    onlyOnScroll : true
  });
  
  // Triggers for Cover and map
  $('#debt').waypoint({
    handler: function(dir) {
      if(dir === 'down') { 
        $.each($(this).find('.fact span'), function(i) {
          $(this).delay(i*800 + 2000).fadeIn()
        });
      }
      window.location.href  = '#debt';
    }, 
    continuous : false, 
    onlyOnScroll : true
    
  });

  
  $('#cover > footer').waypoint({
    handler: function(dir) {
      if(dir === 'up') {
        $('header').removeClass('expanded');
        $('#header nav .selected').removeClass('selected');
      } else {
        // $('header').addClass('expanded');
      }

    },
    offset:0
  });
}


$(document).ready(function() {
 
  var hash = window.location.hash.split('#')[1];
  
  $.each($('#intro h1 span'), function(i) {
    $(this).hide().delay(i*700).fadeIn(1400)
  });
  
  $.each($('#intro .bg'), function(i) {
    $(this).addClass('rotated')
  });
  
  $('#categories a').bind('click', function(e) {
    e.preventDefault();
    if(App.category) {
      $('#map').removeClass(App.category);
    }
    
    App.category    = $(this).data('category');
    $('#map').addClass(App.category)
    App.animations.updateMap();
    $('#switch').toggleClass('toggled');
    $(this).siblings('a').removeClass('active');
    $(this).addClass('active');
    
    $('#map').removeClass('')
  });
  
  $('#categories span').bind('click', function(e) {
    e.preventDefault();
   
    $('#categories a.active').siblings('a:first').trigger('click');
  });

  
  // $.waypoints.settings.scrollThrottle = 20;
  

   
  // Attaches events to the "next" links
  $('a.next-stat').live('click', function(e) {
    e.preventDefault();
    var target = $(this).parents('.stat').next('.stat');
    if(App.section == 'map') {
      target  = $('#map .stat.active').next('.stat'); 
    }
    
    if(target.length == 0) {
      target = $(this).parents('section').next();
    } 
    
    $.smoothScroll({
        scrollTarget  : target
      , speed         : 800
      , easing        : 'easeOutQuart'
      , afterScroll   : function() {
        window.location.href  = '#'+target.attr('id')
      }
    })
  });
  
  App.buildMap();
  
  // For each section, generate and append matching stats
  $.each($('#storyline section'), function(i) {
    
    var sectionId = $(this).attr('id')
    
    if(App.stats[sectionId]) {
      for(var i = 0; i< App.stats[sectionId].length; i++ ) { 
        var statObj = App.stats[sectionId][i]
          , statId  = statObj.id || sectionId + '-' + i
          , stat;
          
       
        if(statObj.html) {
          if(statObj.href === undefined) {
            block = '<p>' + statObj.html +'</p>';
          } else {
            block = '<a href="'+statObj.href+'" target="_blank">'+ statObj.html +'</a>';
          }

          stat = $('<div class="stat" id="' + statId +'">' + block + '<a href="#next-stat" class="next-stat">Next</a></div>');  
        } else {
          stat = $('#'+statObj.id);
        }
        
        if(!$(this).has(stat).length) {
          $(this).append(stat);
        }
        
        stat.data({
            'i'     : i
          , section : sectionId
          , statObj : statObj
        });
        
      }
      
    }
    
    refreshDisplay();  

    // $('.stat').waypoint(App.onStat, {offset : $(window).height() - 250, continuous : false, onlyOnScroll : true});

  });

  createWaypoints();

  // Adds a smooth scrolling to the next buttons on the cover
  $('a.next-section').smoothScroll({
      speed  : 1000
  });
  
  // Make First "next" button pulse
  $('#start span').fadeIn(500).fadeOut(1500);
    setInterval(function(){
        $('#start span').fadeIn(500).fadeOut(1500);
        $('#debt .next-section span').fadeIn(500).fadeOut(1500);
    }, 3000);
  
  // Generate and renders both counters
  App.counter.render();

  // Attaches events to the quotes navigation
  $('a#next-quote').bind('click', function(e) { e.preventDefault(); App.quotes.next() } );
  $('a#previous-quote').bind('click',  function(e) { e.preventDefault(); App.quotes.previous() });
  
  $('header nav a').on('click', function(e) {
    scrollDir = null;
    var section = $($(this).attr('href'))
    showStat(section.find('.stat:first'));
  });


   
  // Enable all share functionalities
  $('.share').live({
    'mouseenter': function(e) {
       if($(this).hasClass('permanent')) {
          return;
        }
      $(this).find('.share-menu').stop(1,1).fadeIn();
    },
    
    'mouseleave' : function(e) {
      if($(this).hasClass('permanent')) {
        return;
      }
      $(this).find('.share-menu').stop(1,1).delay(1000).fadeOut();
    }
  });
  
  $('#header-counter .toggle-share').bind('click', function(e) {
    e.preventDefault();
    
  });
  
  $('#quotes .toggle-share').bind('click', function(e) {
    e.preventDefault();
  });
  
  $('#header-counter a').bind('click', function(e) {
    updateAddThis({description: 'The State of Financial & Economic Education. '});
  });

  $('#stat-share a').bind('click', function(e) {
    e.preventDefault();
    updateAddThis({description: $('#storyline .stat.active').data('statObj').share});
  });
  
  $('#footer .permanent a').bind('mousedown', function(e) { 
    updateAddThis({description: "The state of economic and financial education in 2014. "})
    
  });
  
  $('#loader').hide();

  setTimeout(function(e) {
    
    if(!isNaN(hash)) {
      App.animations[hash]();
    }
    
  }, 800);
  
});


App.onStat = function(dir) {

  var $el = $(this.element);
  
  if($el.hasClass('active')) {
    return;
  }
  showStat($el);
  App.usRaphael.line.toFront();
  if(!App.quotes.data[App.section]) { return; }


  if(scrollDir === 'down' && $el.prev('.stat').length) {
    App.quotes.next();
  } else if(scrollDir === 'up') {
    if ($el.next('.stat').length) {
      App.quotes.previous();
    } else {
      App.quotes.select('last');
    }
  }



}

App.quotes.data = {
    cost      : [
      {
          quote   : "The amount of debt students are taking on reflects the ever-skyrocketing price of a college education, but it also illustrates the need to increase financial literacy among students entering college, and that&#8217;s something we should address head-on."
        , author  : "(Jack Reed, US Senate, Rhode Island / Co-chair of the Senate Financial & Economic Literacy Caucus)"
        , share   : "The amount of debt students are taking on reflects the ever-skyrocketing price of a college education... - J.Reed" 
      },
      {
          quote   : "A financially illiterate society is not an option."
        , author  : "(Nan J. Morrison, Council for Economic Education, President & CEO)"
        , share   : "A financially illiterate society is not an option - Nan J. Morrison" 
      },
      {
          quote   : "If you don't master financial literacy, you'll be a victim."
        , author  : "(Bradley Weeks, Teacher, Rappahannock County High School, Washington, Virginia)"
        , share   : "If you don't master financial literacy, you'll be a victim - B.Weeks"
        
      },
      {
          quote   : "Financial education for people of all ages must be a priority."
        , author  : "(Ruben Hinojosa, US House of Representatives, Texas / Co-chair of the House Financial & Economic Literacy Caucus)"
        , share   : "Financial education for people of all ages must be a priority. - R.Hinojosa"
      },
      {
          quote   : "In the face of a rapidly evolving economy and financial marketplace, it&#8217;s vital that Americans have the tools and the knowledge to make good decisions about money."
        , author  : "(Richard G. Ketchum, Financial Industry Regulatory Authority (FINRA), Chairman and Chief Executive Officer)"
        , share   : "In the face of a rapidly evolving economy and financial marketplace, it’s vital that Americans have the tools and the knowledge to make good decisions about money. - R.Ketchum"
      },
      {
          quote   : "Financial literacy is an important part of avoiding financial mistakes <br>and planning for a strong, secure financial future."     
        , author  : "(Tim Pawlenty, Financial Services Roundtable, President & CEO)"
        , share   : "Financial literacy is an important part of avoiding financial mistakes and planning for a strong, secure financial future. - T.Pawlenty"
      }
    ]
  , situation : [
      {
          quote   : "Educating our younger generations about financial issues is crucial to both their individual economic security and our country&#8217;s ongoing prosperity."
        , author  : "(John G. Stumpf, Chairman and CEO, Wells Fargo & Company)"
        , share   : "Educating our younger generations about financial issues is crucial to both their individual economic security and our country’s ongoing prosperity. - J.Stumpf"
      },
      {
          quote   : "It is so important to teach all of our children good economics so they can be successful workers, wise consumers, and informed citizens."
        , author  : "(Christina Romer, Garff B. Wilson Professor of Economics, University of California, Berkeley)"
        , share   : "It is so important to teach all of our children good economics so they can be successful workers, wise consumers, and informed citizens. - C.Romer"
      },
      {
          quote   : "100% of our students will become financial decision makers, like it or not, and the success of their decisions will be based on their economic<br> and financial literacy or lack thereof."
        , author  : "(Wendy Garcia-Buchanan, 4th Grade Teacher, 2013 Alfred P. Sloan Teaching Champion)"
        , share   : "100% of our students will become financial decision makers - W.Garcia-Buchanan"
      },
      {
          quote   : "As an educator, nothing is more powerful than teaching financial literacy."
        , author  : "(Darren Gurney, High School Economics Teacher, 2014 Alfred P. Sloan Teaching Champion)"
        , share   : "As an educator, nothing is more powerful than teaching financial literacy. - A.Sloan"
      }
    ]
  , challenge : [
      {
          quote   : "Working together, we can infuse our classrooms with the necessary foundational capabilities and make financial education a centerpiece<br> of our public and private agenda."
        , author  : "(Richard D. Fairbank, Founder, Chairman, and CEO, Capital One Financial Corporation)"
        , share   : "Working together, we can make financial education a centerpiece of our public and private agenda. - R.Fairbank"
      },
      {
          quote   : "The number one problem in today's generation and economy<br> is the lack of financial literacy."
        , author  : "(Alan Greenspan, Economist and Former Chairman of the Federal Reserve)"
        , share   : "The number one problem in today's generation and economy is the lack of financial literacy. - A.Greenspan"
      },
      {
          quote   : "Our own financial literacy is important, but we also need to teach our children<br> how to make good financial decisions."
        , author  : "(Steve Stivers, US House of Representatives, Ohio / Co-chair of the House Financial & Economic Literacy Caucus)"
        , share   : "Our own financial literacy is important, but we also need to teach our children how to make good financial decisions. - S.Stivers"
      },
  ]
  , benefits  : [
      {
          quote   : "Starting early with age-appropriate and relevant financial education and consistently reinforcing those lessons throughout the K-12 school experience can help children and youth develop positive habits and skills that can make<br> a lifetime of difference in their financial well-being."
        , author  : "(Richard Cordray, Director of the Consumer Financial Protection Bureau)"
        , share   : "Starting early with age-appropriate and relevant financial education and consistently reinforcing those lessons throughout the K-12 school experience can help children and youth develop positive habits and skills that can make a lifetime of difference in their financial well-being. - R.Cordray"
      },

      {
          quote   : "Economics education is about much more than money; it provides students with a framework for making good decisions that will help them and the country."
        , author  : "(Alan B. Krueger, Bendheim Professor of Economics and Public Affairs, Princeton University)"
        , share   : "Economics education is about much more than money - A.Krueger"
      },
      
      {
          quote   : "Economics provides a framework for better understanding our increasingly complex world.  Economic literacy is an essential part of a well-informed citizenry."
        , author  : "(Kathleen Brennan, Economics & Financial Literacy Teacher, 2013 Alfred P. Sloan Teaching Champion)"
        , share   : "Economic literacy is an essential part of a well-informed citizenry. - K.Brennan"
      },
      
      {
          quote   : "Opening young minds to the possibilities that stem from rational economic decision making, is one of the greatest gifts we can give to students.<br> They will use these skills throughout life."
        , author  : "(Deborah Surian, High School Economics Teacher, 2015 Alfred P. Sloan Teaching Champion)"
        , share   : "Opening young minds to the possibilities that stem from rational economic decision making, is one of the greatest gifts we can give to students. - D.Surian"
      },

      {
          quote   : "Gaining an understanding of how the economy works is essential for our own well-being as well as for our ability to make informed choices as citizens."
        , author  : "(Benjamin Friedman, William Joseph Maier Professor of Political Economy, Harvard University)"
        , share   : "Understanding how the economy works is essential for our own well-being - B.Friedman"
      },

      {
          quote   : "All students should graduate from high school college-and-career ready, which includes having a strong foundation in financial literacy. Incorporating financial literacy skills in K-12 education, as well as expanding learning opportunities well into adulthood, will pay off for our students&#8217; future and the future of our economy."
        , author  : "(Patty Murray, US Senate, Washington / Ranking Member on the Senate Committee on Health, Education, Labor, and Pensions)"
        , share   : "All students should graduate from high school college-and-career ready, which includes having a strong foundation in financial literacy - P.Murray"
      },

      {
          quote   : "I believe that understanding personal finance and financial literacy is the most important and life-applicable skill that students can come away with when graduating high school as these topics are one of life&#8217;s unavoidable eventualities."
        , author  : "(Matthew Gherman, High School Economics Teacher, 2015 Alfred P. Sloan Teaching Champion)"
        , share   : "I believe that understanding personal finance and financial literacy is the most important and life-applicable skill that students can come away with when graduating high school - Matthew Gherman"
      },
      
      {
          quote   : "If we could do one thing to change the trajectory of the next generation, it would be to help them become fluent in basic financial and economic principles."
        , author  : "(Andrew Ross Sorkin, New York Times Financial Columnist, CNBC Co-Anchor of &ldquo;Squawk Box&rdquo;)"
        , share   : "If we could do one thing to change the trajectory of the next generation, it would be to help them become fluent in basic financial and economic principles. - A.Sorkin"
      },

      {
          quote   : "To fully participate in society today, financial literacy is critical."
        , author  : "(Annamaria Lusardi, Denit Trust Chair of Economics and Accountancy, George Washington University School of Business)"
        , share   : "To fully participate in society today, financial literacy is critical. - A.Lusardi"
      }                 
    ]
  
}


App.stats  = {
  cost      : [
    {
        html        : "Members of the class of 2014 graduated with an average of <b>$28,950 in student loan debt.</b>"
      , href        : "http://ticas.org/sites/default/files/pub_files/classof2014.pdf"
      , share       : "The class of 2014 graduated with an average of $28,950 in student loan debt."
      , animation   : 'costIntro'
      , id          : 'no-degree'
      
    },
    {
        html        : "<b>Four in ten Millennials</b> say they are overwhelmed with debt.</b>"
      , href        : "https://www08.wellsfargomedia.com/assets/pdf/commercial/retirement-employee-benefits/perspectives/2014-millennial-study-summary.pdf"
      , share       : "Four in ten Millennials say they are overwhelmed with debt."
      , animation   : 'redPig'
      , id          : 'debt-repayment'
    },
    {
        html        : "<b>More than half of Millennials</b> say they are living paycheck to paycheck and unable to save for the future."
      , href        : "https://www08.wellsfargomedia.com/assets/pdf/commercial/retirement-employee-benefits/perspectives/2014-millennial-study-summary.pdf"
      , share       : "More than half of Millennials say they are living paycheck to paycheck and unable to save."
      , animation   : 'breakingPig'
      , id          : 'student-loan-debt'
    },
    {
        html        : "75% of credit card carrying college students were <b>unaware of late payment charges.</b>"
      , href        : "http://www.ijbssnet.com/journals/Vol_3_No_7_April_2012/3.pdf"
      , share       : "75% of credit card carrying college students were unaware of late payment charges."
      , animation   : 'clock'
      , id          : 'late-payments'
    },
    {
        html        : "<b>43% of Millennials</b> use costly non-bank borrowing methods like payday loans, pawn shops, and rent-to-own stores."
      , href        : "http://www.usfinancialcapability.org/downloads/FinancialCapabilityofYoungAdults.pdf"
      , share       : "43% of Millennials use costly non-bank borrowing methods..."
      , animation   : 'clockFaster'
      , id          : 'planning'
      
    },
    {
        html        : "Nearly one in four adults admit that that they <b>do not pay their bills on time.</b>"
      , href        : "https://www.nfcc.org/wp-content/uploads/2015/04/NFCC_2015_Financial_Literacy_Survey_FINAL.pdf"
      , share       : "Nearly one in four adults admit that that they do not pay their bills on time."
      , animation   : 'clockCrazy'
      , id          : 'bankruptcy'
      
    }
  ],
  
  situation : [
    {
        html        : "Only <b>17 states</b> require students to take a high school course in <br>Personal Finance."
      , href        : "http://www.councilforeconed.org/policy-and-advocacy/survey-of-the-states/"        
      , share       : "Only 17 states require students to take a high school course in Personal Finance"     
    },
    
    {
        html        : "And only <b>20 states</b> require students to take a high school course in Economics."
      , href        : "http://www.councilforeconed.org/policy-and-advocacy/survey-of-the-states/"                
      , share       : "Only 20 states require students to take a high school course in Economics" 
      , animation   : 'books1'
    },
    
    {
        html        : "The number of states with standardized testing in Economics has dropped <b>from 27 to 16 since 2002.</b>"
      , href        : "http://www.councilforeconed.org/policy-and-advocacy/survey-of-the-states/"                        
      , share       : "The number of states requiring student testing in Economics has dropped from 27 to 16 since 2002"
      , animation   : 'books'
    },
    
    {
        html        : "<b>Only five states</b> require a stand-alone course in Personal Finance for high school graduation."
      , href        : "http://www.councilforeconed.org/policy-and-advocacy/survey-of-the-states/"                                
      , share       : "Only five states require a stand-alone course in personal finance for high school graduation" 
      , animation   : 'books'
    }
  ],
  
  challenge : [
    {
        html        : "<b>Fewer than 20% of teachers</b> report feeling competent to teach personal finance topics."
      , href        : "http://www.nefe.org/what-we-provide/primary-research/grant-studies-teachers-preparedness-and-money-man.aspx"
      , share       : "Fewer than 20% of teachers report feeling competent to teach personal finance topics" 
      
    },
    {
        html        : "<b>More than one in six students in the United States</b> does not reach the baseline level of proficiency in financial literacy."
      , href        : "http://www.oecd.org/pisa/keyfindings/pisa-2012-results-volume-vi.htm"
      , share       : "More than 1/6 students in the U.S. does not reach the baseline level of proficiency in financial literacy" 
      , animation   : 'apple'
    },
    {
        html        : "<b>72% of parents</b> experience at least some reluctance to talk to their kids about financial matters."
      , href        : "https://corporate.troweprice.com/Money-Confident-Kids/images/emk/2015-PKM-Report-2015-FINAL.pdf"
      , share       : "72% of parents experience at least some reluctance to talk to their kids about financial matters." 
      , animation   : 'book'
    }
  ],
  
  benefits  : [
  
    {
        html        : "Students from states where a financial education course was required were more likely to display <b>positive financial behaviors and dispositions.</b>"
      , href        : "http://www.nefe.org/what-we-provide/primary-research/financial-education-mandates-report.aspx"

      , share       : "Students from states where a financial education course was required were more likely to display positive financial behaviors and dispositions." 
      , animation   : 'piggybank'
      , id          : 'why-it-matters'
    },
    {
        html        : "<b>They are more likely to save...</b>"
      , share       : "Students from states where a financial education course was required were more likely to display positive financial behaviors and dispositions." 
      , animation   : 'coin'
      , id          : 'more-likely-to-save'
    },
    {
        html        : "<b>More likely to pay off credit cards in full each month...</b>"
      , share       : "Students from states where a financial education course was required were more likely to pay off credit cards in full each month" 
      , animation   : 'coin'
      , id          : 'more-likely-to-pay'
    },
    {
        html        : "<b>Less likely to be compulsive buyers...</b>"
      , share       : "Students from states where a financial education course was required were less likely to be compulsive buyers" 
      , animation   : 'coin'
      , id          : 'less-compulsive'
    },
    {
        html        : "<b> And more likely to take reasonable financial risk.</b>"
      , share       : "Students from states where a financial education course was required were more likely to take reasonable financial risk" 
      , animation   : 'coin'
      , id          : 'more-reasonable'
    },
    {
        html        : "State financial education requirements also <b>have a meaningful impact on students&#8217; financial condition later in life.</b>"
      , href        : "https://files.ctctcdn.com/e5db0b81101/f5b36cd4-69bd-4f05-b539-cf73a91c2d73.pdf"

      , share       : "State financial education requirements have a meaningful impact on students financial condition later in life" 
      , animation   : 'coin'
      , id          : 'meaningful-impact-on-students'
    },
    {
        html        : "Students from states with required financial education courses..."
      , share       : "State financial education requirements have a meaningful impact on students’ financial condition later in life" 
      , animation   : 'coin'
      , id          : 'rigorous-financial-education'
    },
    {
        html        : "Have <b>higher credit scores...</b>"
      , share       : "State financial education requirements have a meaningful impact on students’ financial condition later in life" 
      , animation   : 'coin'
      , id          : 'better-credit-score'
    },
    {
        html        : "And a <b>lower probability of delinquency</b> as young adults."
      , share       : "State financial education requirements have a meaningful impact on students’ financial condition later in life" 
      , animation   : 'coin'
      , id          : 'low-delinquency'
    }

  ],
  
  map    : [
    {
          html          : 'xxx'
        , animation     : 'mapIntro'
        , id            : 'state-of-financial-and-economic-programs-across-the-nation'
    },
    {
          html        : "2016"
        , animation   : '2016'
        , id          : '2016'
    },
    {
          html        : "2014"
        , animation   : '2014'
        , id          : '2014'
    },
    {
          html        : "2011"
        , animation   : '2011'
        , id          : '2011'
    },
    {
          html        : "2009"
        , animation   : '2009'
        , id          : '2009'
    },
    {
          html        : "2007"
        , animation   : '2007'
        , id          : '2007'
    },
    {
          html        : "2004"
        , animation   : '2004'
        , id          : '2004'
    },
    {
          html        : "2002"
        , animation   : '2002'
        , id          : '2002'
    }
  ],
  
  act    : [
   
    
    {
        animation   : 'teachers'
      , id          : 'list-teachers'
    },
    {
        
        animation   : 'students'
      , id          : 'list-students'
    },
    {
       
        animation   : 'officials'
      , id          : 'list-policy-makers'
    }
  ]
}


App.category = "economy";
App.year_id = 0;
App.colors = {
  economy : ['#FF545C','#d3e9f8','#76bbe8','#0e70b7','#0a4a7e', '#082043'],

  finance : ['#FF545C','#eeeb6f','#c7da2e','#7eb442','#57853b', '#2a4e20']
}


App.animations = {
  
  footer    : function() {},
  map       : function() {
    
    if(scrollDir === 'down' || !scrollDir) {
      
      $('#timeline li:first').trigger('click');
      App.animations.updateMap(6);
    }
    

  },
  
  mapIntro : function() {
    
  },
  
  updateMap : function(year_id) {

    
    if(year_id == undefined) {
      App.year_id = App.year_id;
    } else {
      App.year_id = year_id; 
    }
  
    
    var colors = App.colors
    
    $.each(MapTimeline.states, function(k,v) {
      var pos       = Number(this[App.category][App.year_id][0])
        , pos2      = Number(this[App.category][App.year_id][1])
        , st        = App.usRaphael[k]
        , st2       = App.usRaphael[k  + "-pattern"];

      st.animate({fill: Raphael.color(colors[App.category][pos])}, 500);
      st.toFront();
      if(pos2) {
        st2.toFront();
      } else  {
        st.toFront();
      }

      App.map.safari();
    });
    


    
    
    
    $('#timeline li').removeClass('active');
    $('#timeline-' + App.years[App.year_id]).addClass('active');
    

    
    $.each(MapTimeline.stats, function(i) {
      var $donut = $('#donut-' + i );
      $donut.find('label').html(this[App.category]['label']);
      $donut.find('.amount span').html(Math.round(this[App.category]['values'][App.year_id]));
      var percent = (this[App.category]['values'][App.year_id] * 100) / 51;

      $('#donut-'+i+'-amount svg').remove();
      
      var color = Raphael.color(colors[App.category][i+1]);
      
      if(i == 4) {
        color = 'url(./images/dot-pattern.png)';
      }
      
      Raphael('donut-'+i+'-amount', 60,60).donutChart(30,30,30,20, [percent, 100-percent], ['',''],[color,Raphael.color('#CCC')]);
      
    });
    App.usRaphael.line.toFront();
    
  },
  
  '2002' : function() {
   
    App.animations.updateMap(0);
  },
  '2004' : function() {

    App.animations.updateMap(1);
  },
  '2007' : function() {
    
    App.animations.updateMap(2);
  },
  '2009' : function() {
    App.animations.updateMap(3);
  },
  '2011' : function() {
    App.animations.updateMap(4);
  },
  '2014' : function() {
    App.animations.updateMap(5);
  },
  '2016' : function() {
    App.animations.updateMap(6);
  },
  
  costIntro   : function() {
  },
  
  redPig      : function() {
    
    var shakedown = function() {
      
      $('#red-pig').stop(0,1).removeClass('broken').animate({
        bottom  : 180
      }, {
          duration  : 300
        , easing    : 'easeOutExpo'
        , complete  : function() {
          $('.red-coin').remove();
          var coin = $('<div class="red-coin"></div>');
          rotate(coin, Math.round(Math.random() * 360));

          coin.appendTo($('body')).css({
              bottom  : 180
            , left    : $('#red-pig').offset().left + ($('#red-pig').width() - coin.width()) / 2 - 10
          }).animate({
              bottom    : -50
            , easing    : 'easeInOutQuad'
          }, 1000)

          shakedown();
        }
      }).animate({
        bottom  : 210
      }, 600);
          
      
    }
    
    // $('#red-pig').css({
    //   bottom    : $(window).height()
    // });
    
    shakedown();


  },
  
  breakingPig : function() {
    clearInterval($('#clock').data('it'));  
    $('#clock').stop(true, true).animate({
      left      : -250
    });
    $('#red-pig').stop(1,0).animate({
      bottom      : $('#quotes').height()
    }, {
      easing      : 'easeInQuart',
      complete    : function() {
        $(this).addClass('broken');
        
      },
      duration    : 600
    });

  },
  
  clock    : function() {
    clearInterval($('#clock').data('it'));  
    var it = setInterval(clockWork,400);
    $('#clock').data('it', it);
    
    $('#clock').stop(1,0).animate({
      left      : $('#late-payments').offset().left - $('#clock').width()
    }, {
      duration  : 800
    })
   
    
    $('#red-pig').stop(1,0).animate({
      bottom    : -200
    }, {
      duration  : 900,
      easing    : 'easeInOutBack'
    });
  },
  
  clockFaster    : function() {
    clearInterval($('#clock').data('it'));   
    var it = setInterval(clockWork,10);
    $('#clock').data('it', it);
    // $('#clock').effect('shake', {times:10000, distance:3}, 300);
  },
  
  clockCrazy    : function() {
    clearInterval($('#clock').data('it'));
    var it = setInterval(clockWork,1);
    $('#clock').data('it', it);
    // $('#clock').stop(1,0).effect('shake', {times:10000, distance:10}, 150);
    
    $('#clock').stop(1,0).animate({
      left      : $('#cost .stat.active').offset().left - $('#clock').width()
    });

  },
  
  globe       : function(show) {
    
    if(show) {
      $('#globe').css({
        bottom  : -200
      }).delay(800).animate({
        bottom  : $('#quotes').height()
      }, {
        duration  : 800,
        easing    : 'easeInOutBack'
      })
    } else {
     
    }
    
  },

  
  takeAction      : function() {
  

  },
  
  act      : function(callback) {
    var callback = callback || function() {};
    $('.asset').removeClass('active');
    callback();
    
  },
  
  apple       : function(show) {
    
    if(show) {
      $('#apple').css({
        bottom  : -200
      }).delay(1100).animate({
        bottom  : $('#quotes').height() + $('#book').height()
      }, {
        duration  : 800,
        easing    : 'easeInOutBack'
      })
    } else {
      $('#apple').animate({
        bottom  : -200
      }, {
        duration  : 800,
        easing    : 'easeInOutBack'
      });
     
    }

  },
  
  book       : function(show) {
    
      
    if(show) {
      $('#book').css({
          bottom  : -200
        }).delay(900).animate({
          bottom  : $('#quotes').height() 
        }, {
          duration  : 800,
          easing    : 'easeInOutBack'
        })
        
    } else {
      $('#book').animate({
         bottom  : -200
       }, {
         duration  : 800,
         easing    : 'easeInOutBack'
       })
     
    }

     

  },
  
  coin        : function(hide) {
    
    if(hide) {
      $('#coin').hide();
    } else {
      $('#piggybank').addClass('active');
      if(scrollDir === 'down') {
        $('#coin').css({
          bottom     : 370
        }).show().animate({
          bottom    : 170
        }, {
            duration  : 900
          , easing    : 'easeInExpo'
          , complete  : function() {
            $('#piggybank').removeClass().addClass('active greedy-' + $('#benefits .stat.active').index());
            // $('#piggybank label').stop(1,0).fadeIn().fadeOut();
            $('#coin').hide();
          }
        });
      } else {
        $('#piggybank').removeClass().addClass('active greedy-' + $('#benefits .stat.active').index());
      }
      
      
    }
    
  },
  
  piggybank   : function(hide) {

    App.animations.coin(true);
    $('.asset').removeClass('active');
    $('#piggybank').removeClass();
    
    if(!hide) {
      $('#piggybank').addClass('visible active');
      // $('#visual-benefits').stop(1,1).animate({
      //         left      : ($(window).width() - $('#visual-benefits').width())/2 
      //       }, {
      //         duration  : 1000,
      //         easing    : 'easeInOutQuart',
      //         complete  : function() {
      //           
      //         }
      //       });
       
    } else {
     //      
     $('#piggybank').removeClass('visible active');
     //      // $('#piggybank').stop(1,0).animate({
     //      //          left     : -300
     //      //        }, {
     //      //          duration  : 600
     //      //        });
     // 
     //      
   }
    
  },
  
  books       : function() {
    App.animations.removeBooks(2);
    
  },
  
  books1       : function() {
    App.animations.removeBooks(2);
   
  },
  
  removeBooks : function(num, callback) {
    var callback  = callback || function() {}
      , pile      = $('#pileofbooks .book').length 
      , num       = num || pile
      
    
    for(var i = pile; i >= Math.max(pile -num, 0); i--) {
      
      var dir = i%2 ? $(window).width() : -$(window).width()
        , delay = (pile - i) * 200;
        
      $('#pileofbooks .book:eq('+i+')').stop(1,0).delay(delay).animate({
        left    : dir
        , bottom   : Math.round(Math.random($(window).height()) * 200)
      },   {
        duration : 350,
        easing   : 'easeInOutQuad',
        complete : function() {
         $(this).remove();
         
        }
      })
          

      
    }
  },
  
  teachers : function() {
    App.animations.selectCharacter('teachers');
  },
  
  students : function() {
    App.animations.selectCharacter('students');
  },
  
  officials : function() {
    
    App.animations.selectCharacter('policy-makers');
    
  },
  
  selectCharacter : function(character) {
    
    var $character  = $('#' + character)
      , $list       = $('#list-' + character)
      // , lpercent    = ($list.offset().left - $character.width() - 20) * 100 / $(window).width()
      
    // $character.data('pos', $character.css('left'));
    
    $('.character.active').removeClass('active');
    
    $character.addClass('active');  
    
  },
  
  blackboard  : function(hide, callback) {
    var callback = callback || function() {}
    // 
    // if(hide) {
    //   $('#blackboard').removeClass('visible');
    // } else {
    //   $('#blackboard').delay(500).addClass('visible');
    //   
    //   callback();
    // }
    callback();
  },
  
  student     : function() {},
  
  cost        : function(callback) {
    
    var callback  = callback  || function() {};

    $('#student').css({
       right      : -300,
       top        : 150
     }).delay(500).show().animate({
       right      : ($(window).width() - 980)/2
     }, {
       duration   : 700,
       easing     : 'easeOutQuart',
       complete   : callback
     });
    
  },
  
  situation   : function(callback) {
    
    var callback = callback || function() {};
    
    if($('#pileofbooks .book').length == 0) {
      for(var i=0;i<=10;i++) {
         var book = $('<div class="book book-' + i + '"></div>');

         $('#pileofbooks').append(book);
         book.hide().delay((i*150)).css({
             bottom   : $(window).height() + 100
           , zIndex   : 700 + i
         }).show().animate({
           bottom  : i*35
         }, {
           duration  : 400,
           easing    : 'easeOutExpo',
           complete  : function() {
             if($(this).index() == 10) {
               callback();
             } 
              
            }
   
         })


        }
     }
  },
  
  challenge   : function(callback) {
    // App.animations.blackboard(false, callback);
    App.animations.globe(true);
    App.animations.book(true);
    App.animations.apple(true);
  },
  
  benefits    : function(callback) {
    var callback = callback || function() {};
    
    $('#coin').hide();
    $('.asset').removeClass('active');
    $('#piggybank').addClass('visible');  
    callback();
  }
  
}

var deg = 0;
var hours = 0;
clockWork = function() {
  
  deg += 5;
  rotate($('#clock-minutes'), deg);
  hours = Math.floor(deg/360);
  rotate($('#clock-hours'), hours * 30);

}

var rotate = function(el, deg) {
  $(el).css({
      'transform'                 : 'rotate(' + deg + 'deg)'
    , '-ms-transform'             : 'rotate(' + deg + 'deg)'
    , '-webkit-transform'         : 'rotate(' + deg + 'deg)'
    , '-moz-transform'            : 'rotate(' + deg + 'deg)'
    , '-o-transform'              : 'rotate(' + deg + 'deg)'

  });
}
