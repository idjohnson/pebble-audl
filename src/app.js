/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');

// function for showing the parking selector
function teamDetails(window, name, stats, icnkey)
{
  console.log("teamDetails: name: " + name);
  console.log("teamDetails: stats: " + stats);
  console.log("teamDetails: icnkey: " + icnkey);
  // Top rectangle to blank out the page
  var rect = new UI.Rect({ 
    position: new Vector2(0, 0),
    size: new Vector2(144, 168),
    backgroundColor:'white'
  });

  var teamLogo = new UI.Image({
    position: new Vector2(33,3),
    size: new Vector2(50,50),
    backgroundColor: 'clear',
    borderColor: 'clear',
    image: 'images/TeamIcons_pbl_50_' + icnkey + '.png'
  });
  
  var teamName = new UI.Text({
    position: new Vector2(0, 80),
    size: new Vector2(144, 25),
    text: name,
    color:'black',
    textAlign:'center',
    backgroundColor:'white'
    
  });
  
  var teamStats = new UI.Text({
    position: new Vector2(0, 105),
    size: new Vector2(144, 25),
    text: stats,
    color:'black',
    textAlign:'center',
    backgroundColor:'white'
    
  });
 
  window.add(rect);
  window.add(teamLogo);
  window.add(teamName);
  window.add(teamStats);
  
}

var optionMenu= [
  {
    title: "West"
  },
  {
    title: "East"
  },
  {
    title: "Midwest"
  },
  {
    title: "South"
  },
  {
    title: "- All -"
  }
];

// Create the Menu, supplying the list of choices
var displayMenu = new UI.Menu({
  sections: [{
    title: 'Pick Division',
    items: optionMenu
  }]
});

displayMenu.on('select', function(event) {
  
  var milliseconds = (new Date).getTime();
  var AUDLURL = "http://ec2-54-86-111-95.compute-1.amazonaws.com:4001/Web/Standings?callback=asdf&_=" + milliseconds;

  var scoresMenu = new UI.Menu();
  
  var idx = 0;
  
  var req = new XMLHttpRequest();
  req.open('GET', AUDLURL, true);
  req.onload = function(e) {
    if (req.readyState == 4) {
      if(req.status == 200) {
        
        var re = /^....../i;
        var str = req.responseText;
        var newstr = str.replace(re, '');
        var re2 = /..$/i;
        var newstr2 = newstr.replace(re2, '');
        
        var response = JSON.parse(newstr2);
        
        if ((event.itemIndex === 0)||(event.itemIndex === 4))
        {
          // Show West
          var myStringArray = response.West;
          var arrayLength = myStringArray.length;
          for (var i = 0; i < arrayLength; i++) {
            var titleText = myStringArray[i].name;
            var subText = "W: " + myStringArray[i].wins + " L: " + myStringArray[i].losses + " PD: " + myStringArray[i].plmn;
            var iconText = "images/TeamIcons_pbl_50_" + myStringArray[i].nm + ".png";
            scoresMenu.item(0, (i + idx), { title: " " + titleText, subtitle: " " + subText, icon: iconText });
          
          }
          if (event.itemIndex === 4) {
            idx += arrayLength;
          }
        }
        if ((event.itemIndex === 1)||(event.itemIndex === 4))
        {
          // Show East
          var myStringArrayE = response.East;
          var arrayLengthE = myStringArrayE.length;
          for (var iE = 0; iE < arrayLengthE; iE++) {
            var titleTextE = myStringArrayE[iE].name;
            var subTextE = "W: " + myStringArrayE[iE].wins + " L: " + myStringArrayE[iE].losses + " PD: " + myStringArrayE[iE].plmn;
            var iconTextE = "images/TeamIcons_pbl_50_" + myStringArrayE[iE].nm + ".png";
            scoresMenu.item(0, (iE + idx), { title: " " + titleTextE, subtitle: " " + subTextE, icon: iconTextE });
          
          }
         // console.log(" showing " + event.itemIndex + " " + idx + " with array length " + arrayLengthE);
          if (event.itemIndex === 4) {
            idx += arrayLengthE;
          }          
         // console.log(" showing " + event.itemIndex + " " + idx + " with array length " + arrayLengthE);

        }
        if ((event.itemIndex === 2)||(event.itemIndex === 4))
        {
          // Show Midwest
          var myStringArrayMW = response.Midwest;
          var arrayLengthMW = myStringArrayMW.length;
          for (var iMW = 0; iMW < arrayLengthMW; iMW++) {
            var titleTextMW = myStringArrayMW[iMW].name;
            var subTextMW = "W: " + myStringArrayMW[iMW].wins + " L: " + myStringArrayMW[iMW].losses + " PD: " + myStringArrayMW[iMW].plmn;
            var iconTextMW = "images/TeamIcons_pbl_50_" + myStringArrayMW[iMW].nm + ".png";
            scoresMenu.item(0, (iMW + idx), { title: " " + titleTextMW, subtitle: " " + subTextMW, icon: iconTextMW });
          
          }
          if (event.itemIndex === 4) {
            idx += arrayLengthMW;
          }
        }
        if ((event.itemIndex === 3)||(event.itemIndex === 4))
        {
          // Show South
          var myStringArrayS = response.South;
          var arrayLengthS = myStringArrayS.length;
          for (var iS = 0; iS < arrayLengthS; iS++) {
            var titleTextS = myStringArrayS[iS].name;
            var subTextS = "W: " + myStringArrayS[iS].wins + " L: " + myStringArrayS[iS].losses + " PD: " + myStringArrayS[iS].plmn;
            var iconTextS = "images/TeamIcons_pbl_50_" + myStringArrayS[iS].nm + ".png";
            scoresMenu.item(0, (iS + idx), { title: " " + titleTextS, subtitle: " " + subTextS, icon: iconTextS });
          
          }
          if (event.itemIndex === 4) {
            idx += arrayLengthS;
          }
        }
      }
    }
  };
  req.send(null);
  scoresMenu.show();
  
  var dmSection = event.itemIndex;
  scoresMenu.on('select', function(event) {
    console.log('user picked ' + event.itemIndex + ' and dmSection was ' + dmSection);
    
  
    var detailsWindows = new UI.Window();
    teamDetails(detailsWindows, "San Jose Spiders", "W: 5 | L: 0 | PD: 25", "SJ");
    detailsWindows.show();
  });
});


var main = new UI.Card({
  title: 'Pebble.js',
  icon: 'images/menu_icon.png',
  subtitle: 'Hello World!',
  body: 'Press any button.'
});

main.show();

main.on('click', 'up', function(e) {
  var menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Pebble.js',
        icon: 'images/menu_icon.png',
        subtitle: 'Can do Menus'
      }, {
        title: 'Second Item',
        subtitle: 'Subtitle Text'
      }]
    }]
  });
  menu.on('select', function(e) {
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
  });
  menu.show();
});

main.on('longClick', 'select', function(e) {
  
  var milliseconds = (new Date).getTime();
  var AUDLURL = "http://ec2-54-86-111-95.compute-1.amazonaws.com:4001/Web/Standings?callback=asdf&_=" + milliseconds;
  
  var sections = [];
  var items = [];

  var scoresMenu = new UI.Menu();
  
  var req = new XMLHttpRequest();
  req.open('GET', AUDLURL, true);
  req.onload = function(e) {
    console.log("in onload");
    if (req.readyState == 4) {
      console.log("in state 4");
      if(req.status == 200) {
        
        console.log("in status 200");
        console.log(req.responseText);

        console.log("start string replace");
        var re = /^....../i;
        var str = req.responseText;
        var newstr = str.replace(re, '');
        var re2 = /..$/i;
        var newstr2 = newstr.replace(re2, '');
        
        console.log("done with string replace");
        var response = JSON.parse(newstr2);
        console.log("parsed json");
        var aTeamName = response.West[0].name;
        console.log("print found team name");
        
        var myStringArray = response.West;
        var arrayLength = myStringArray.length;
        for (var i = 0; i < arrayLength; i++) {
            var titleText = myStringArray[i].name;
            var subText = "W: " + myStringArray[i].wins + " L: " + myStringArray[i].losses + " PD: " + myStringArray[i].plmn;
            //var iconText = "http://ec2-54-86-111-95.compute-1.amazonaws.com:4001/Logos/TeamIcons_" + myStringArray[i].nm + ".png";
            var iconText = "images/TeamIcons_pbl_50_" + myStringArray[i].nm + ".png";
            var obj = {};
          
             //main.item(0, i, { title: titleText, subtitle: subText, icon: icon });
             //scoresMenu.item(0, i, { title: " " + titleText, subtitle: " " + subText });
             scoresMenu.item(0, i, { title: " " + titleText, subtitle: " " + subText, icon: iconText });
          
          /*
            obj['title'] = myStringArray[i].name;
            obj['subtitle'] =  "W: " + myStringArray[i].wins + " L: " + myStringArray[i].losses + " PD: " + myStringArray[i].plmn;
            obj['icon'] = "http://ec2-54-86-111-95.compute-1.amazonaws.com:4001/Logos/TeamIcons_" + myStringArray[i].nm + ".png";
            items.push(obj);
 */
            //Do something
        }
 //       sections.push(items); 
         
        
        console.log(response);
        console.log(aTeamName);

      } else {
        console.log("Error");
      }
    }
  }
  req.send(null);
  
  scoresMenu.show();
  
});


main.on('select', function(e) {
  console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
  console.log('The item is titled "' + e.item.title + '"');
});
main.show();
  
main.on('click', 'down', function(e) {
  var card = new UI.Card();
  card.title('A Card');
  card.subtitle('Is a Window');
  card.body('The simplest window type in Pebble.js.');
  card.show();
});


//add subscreens for individual invoice details
main.on('click', 'select', function(e){
  displayMenu.show();
});

displayMenu.on('click', 'back', function(e){

  console.log("heading back now...");

  displayMenu.hide();
});
