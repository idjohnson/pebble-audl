/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');


var optionMenu= [
  {
    title: "Set Parking Spot",
    subtitle: "Set displayed stall"
  },
  {
    title: "Set Locked",
    subtitle: "Did you lock it?"
  },
  {
    title: "GPS Address",
    subtitle: "GPS to google"
  },
  {
    title: "IP Address",
    subtitle: "IP to Google"
  },
  {
    title: "GPS Coords",
    subtitle: "Show GPS Coordinates"
  },
  {
    title: "About",
    subtitle: "About this App"
  }
];

// Create the Menu, supplying the list of choices
var displayMenu = new UI.Menu({
  sections: [{
    title: 'Address List',
    items: optionMenu
  }]
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

main.on('click', 'select', function(e) {
  
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
          var iconText = "images/TeamIcons_pbl_60_SJ.png";
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
  
  

//for (var x = 0; x < 3; x++) {
//  main.item(0, x, { title: 'Item ' + x });
//}
scoresMenu.show();
  
});

 //  var menu = new UI.Menu({
 //   sections
 // });
  main.on('select', function(e) {
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
  });
  main.show();
  
  /*
        
  ajax(
    {
      url: AUDLURL,
      type: 'json'
    },
    function(data, status, request) {
      console.log('Quote of the day is: ' + data.West[0].name);
    },
    function(error, status, request) {
      console.log('The ajax request failed: ' + error);
    },
    function asdf(data,stat,request) {
      console.log('in asdf function');
    }
  );
  */
  /*
  var wind = new UI.Window();
  var textfield = new UI.Text({
    position: new Vector2(0, 50),
    size: new Vector2(144, 30),
    font: 'gothic-24-bold',
    text: 'Text Anywhere!',
    textAlign: 'center'
  });
  wind.add(textfield);
  wind.show();
  */
//});

main.on('click', 'down', function(e) {
  var card = new UI.Card();
  card.title('A Card');
  card.subtitle('Is a Window');
  card.body('The simplest window type in Pebble.js.');
  card.show();
});
