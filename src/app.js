/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');
var teamInfo = require('team_info'); 

var displayVersion = "Release 1.0";

var nameHash = {};
var statsHash = {};
var icnHash = {};

// function for showing the parking selector
function teamDetails(window, name, stats, icnkey)
{
  // Top rectangle to blank out the page
  var rect = new UI.Rect({ 
    position: new Vector2(0, 0),
    size: new Vector2(144, 168),
    backgroundColor:'white'
  });

  var teamLogo = new UI.Image({
    position: new Vector2(33,3),
    size: new Vector2(77,77),
    backgroundColor: 'clear',
    borderColor: 'clear',
    image: 'images/TeamIcons_pbl_77_' + icnkey + '.png'
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

function gameDetails(window, gameDate, hometeam, awayteam)
{
  // scheduled game details
  // Top rectangle to blank out the page
  var rect = new UI.Rect({ 
    position: new Vector2(0, 0),
    size: new Vector2(144, 168),
    backgroundColor:'white'
  });

  
  var homeName = new UI.Text({
    position: new Vector2(0, 5),
    size: new Vector2(144, 25),
    text: hometeam,
    color:'black',
    textAlign:'center',
    backgroundColor:'white'
    
  });
  
  var vstxt = new UI.Text({
    position: new Vector2(0, 30),
    size: new Vector2(144, 25),
    text: "(home) - vs - (away)",
    color:'black',
    textAlign:'center',
    backgroundColor:'white'
    
  });
  
  var awayName = new UI.Text({
    position: new Vector2(0, 55),
    size: new Vector2(144, 25),
    text: awayteam,
    color:'black',
    textAlign:'center',
    backgroundColor:'white'
    
  });
  
  var gameDt = new UI.Text({
    position: new Vector2(0, 90),
    size: new Vector2(144, 25),
    text: gameDate,
    color:'black',
    textAlign:'center',
    backgroundColor:'white'
    
  });
 
  window.add(rect);
  window.add(homeName);
  window.add(vstxt);
  window.add(awayName);
  window.add(gameDt);
}

function mainScreen(window)
{
  // Top rectangle to blank out the page
  var rect = new UI.Rect({ 
    position: new Vector2(0, 0),
    size: new Vector2(144, 168),
    backgroundColor:'white'
  });

  var AUDLLogo = new UI.Image({
    position: new Vector2(10,20),
    size: new Vector2(120,108),
    backgroundColor: 'clear',
    borderColor: 'clear',
    image: 'images/AUDLLogo.png'
  });
  
  window.add(rect);
  window.add(AUDLLogo);
}


function versionScreen(window)
{
  // Top rectangle to blank out the page
  var rect = new UI.Rect({ 
    position: new Vector2(0, 0),
    size: new Vector2(144, 168),
    backgroundColor:'white'
  });

  var DSLogo = new UI.Image({
    position: new Vector2(0,0),
    size: new Vector2(144,167),
    backgroundColor: 'clear',
    borderColor: 'clear',
    image: 'images/DorkSquad2.png'
  });
  
  var versionTxt = new UI.Text({
    position: new Vector2(0, 0),
    size: new Vector2(80, 25),
    text: displayVersion,
    color:'white',
    textAlign:'center',
  });
  
  window.add(rect);
  window.add(DSLogo);
  window.add(versionTxt);
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

var detOptionsMenu = [
  {
    title: "Team Details"
  },
  {
    title: "Players"
  },
  {
    title: "Games"
  },
  {
    title: "Schedule"
  }
]

// ref: http://stackoverflow.com/a/1293163/2343
// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
function CSVToArray( strData, strDelimiter ){
  // Check to see if the delimiter is defined. If not,
  // then default to comma.
  strDelimiter = (strDelimiter || ",");

  // Create a regular expression to parse the CSV values.
  var objPattern = new RegExp(
    (
      // Delimiters.
      "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

      // Quoted fields.
      "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

      // Standard fields.
      "([^\"\\" + strDelimiter + "\\r\\n]*))"
    ),
    "gi"
  );


  // Create an array to hold our data. Give the array
  // a default empty first row.
  var arrData = [[]];

  // Create an array to hold our individual pattern
  // matching groups.
  var arrMatches = null;


  // Keep looping over the regular expression matches
  // until we can no longer find a match.
  while (arrMatches = objPattern.exec( strData )){

    // Get the delimiter that was found.
    var strMatchedDelimiter = arrMatches[ 1 ];

    // Check to see if the given delimiter has a length
    // (is not the start of string) and if it matches
    // field delimiter. If id does not, then we know
    // that this delimiter is a row delimiter.
    if (
      strMatchedDelimiter.length &&
      strMatchedDelimiter !== strDelimiter
    ){

      // Since we have reached a new row of data,
      // add an empty row to our data array.
      arrData.push( [] );

    }

    var strMatchedValue;

    // Now that we have our delimiter out of the way,
    // let's check to see which kind of value we
    // captured (quoted or unquoted).
    if (arrMatches[ 2 ]){

      // We found a quoted value. When we capture
      // this value, unescape any double quotes.
      strMatchedValue = arrMatches[ 2 ].replace(
        new RegExp( "\"\"", "g" ),
        "\""
      );

    } else {

      // We found a non-quoted value.
      strMatchedValue = arrMatches[ 3 ];

    }


    // Now that we have our value string, let's add
    // it to the data array.
    arrData[ arrData.length - 1 ].push( strMatchedValue );
  }

  // Return the parsed data.
  return( arrData );
}


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
            nameHash[i + idx] = titleText;
            statsHash[i + idx] = subText;
            icnHash[i + idx] = myStringArray[i].nm;
            
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
            nameHash[iE + idx] = titleTextE;
            statsHash[iE + idx] = subTextE;
            icnHash[iE + idx] = myStringArrayE[iE].nm;
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
            nameHash[iMW + idx] = titleTextMW;
            statsHash[iMW + idx] = subTextMW;
            icnHash[iMW + idx] = myStringArrayMW[iMW].nm;
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
            nameHash[iS + idx] = titleTextS;
            statsHash[iS + idx] = subTextS;
            icnHash[iS + idx] = myStringArrayS[iS].nm;
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
    //teamDetails(detailsWindows, "San Jose Spiders", "W: 5 | L: 0 | PD: 25", "SJ");
    teamDetails(detailsWindows, nameHash[event.itemIndex], statsHash[event.itemIndex], icnHash[event.itemIndex]);
    detailsWindows.show();
  });
});


// First Screen
var main = new UI.Window();
mainScreen(main);
main.show();

main.on('click', 'up', function(e) {
  
  var menu = new UI.Menu({
  sections: [{
    title: 'Select Team Details',
    items: detOptionsMenu
    }]
  });

  menu.on('select', function(e) {
    if (e.itemIndex === 0)
      {
        // Team Details
        var teamDetMenu = new UI.Menu();
        for (var i = 0; i < teamInfo.teams.length; i++) {
          var teamName = teamInfo.teams[i].name;
          teamDetMenu.item(0, i, { title: " " + teamName });
        }

        teamDetMenu.show();

        teamDetMenu.on('select', function(e) {
          
          var TDRU = "http://www.ultimate-numbers.com/rest/view/team/" + teamInfo.teams[e.itemIndex].cloudId; 
          ajax(
          {
            url: TDRU,
            type: 'json'
          },
          function(data)
          {
            console.log('data url ' + TDRU);
            // Show a card with clicked item details
            var teamDetailCard = new UI.Card({
              title: data.name,
              subtitle: "Games Played: " + data.numberOfGames,
              body: "First Game: " + data.firstGameDate + '  ' + "Latest Game: " + data.lastGameDate,
              style: "small"
            });
            // Show the new Card
            teamDetailCard.show();
            
            }
          );
          console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
          console.log('The item is titled "' + e.item.title + '"');
        });
        
      } else if (e.itemIndex === 1) {
        // Players
        var teamPlayMenu = new UI.Menu();
        for (var i = 0; i < teamInfo.teams.length; i++) {
          var teamName = teamInfo.teams[i].name;
          teamPlayMenu.item(0, i, { title: " " + teamName });
        }

        teamPlayMenu.show();

        teamPlayMenu.on('select', function(e) {
          
          var TPRU = "http://www.ultimate-numbers.com/rest/view/team/" + teamInfo.teams[e.itemIndex].cloudId + "/players"; 
          ajax(
          {
            url: TPRU,
            type: 'json'
          },
          function(data)
          {
            console.log('data url ' + TPRU);
            // Show a card with clicked item details
            
            var teamPlayDetMenu = new UI.Menu();
            for (var i = 0; i < data.length; i++) {
              teamPlayDetMenu.item(0, i, { title: data[i].name, subtitle: "#" + data[i].number + " pos: " + data[i].position });
            }
            // no select action required.
            teamPlayDetMenu.show();
          });
          console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
          console.log('The item is titled "' + e.item.title + '"');
        });
      } else if (e.itemIndex === 2) {
        // Games
        var teamGameMenu = new UI.Menu();
        for (var ii = 0; ii < teamInfo.teams.length; ii++) {
          var teamName2 = teamInfo.teams[ii].name;
          teamGameMenu.item(0, ii, { title: " " + teamName2 });
        }

        teamGameMenu.show();
        teamGameMenu.on('select', function(e) {
          
          var TGRU = "http://www.ultimate-numbers.com/rest/view/team/" + teamInfo.teams[e.itemIndex].cloudId + "/games"; 
          ajax(
          {
            url: TGRU,
            type: 'json'
          },
          function(data)
          {
            console.log('data url ' + TGRU);
            // Show a card with clicked item details
            
            var teamGameDetMenu = new UI.Menu();
            
            var keyMap = {};
            var keysList = [];
            for (var i = 0; i < data.length; i++) {
              keyMap[data[i].msSinceEpoch] = i;
              console.log("keyMap " + data[i].msSinceEpoch + " to " + i);
              keysList.push(data[i].msSinceEpoch);
            }
            keysList.sort();
            // we want newest first
            keysList.reverse();
            
            var section = {
              title: e.item.title
            };
            teamGameDetMenu.section(0, section);
            
            for (var j = 0; j < data.length; j++) {
              var i = keyMap[keysList[j]];
              console.log("in map: j:" + j + " and i:" + i);
              var finalTxt = "NA";
              if (data[i].ours > data[i].theirs)
                {
                  finalTxt = "W";
                } else if (data[i].ours == data[i].theirs) {
                  finalTxt = "T";
                } else if (data[i].ours < data[i].theirs) {
                  finalTxt = "L";
                }
              teamGameDetMenu.item(0, j, { title: finalTxt + " vs. " + data[i].opponentName, subtitle: data[i].date + "  score:" + data[i].ours + " - " + data[i].theirs, scrollable: true });
            }
            // no select action required.
            teamGameDetMenu.show();
          });
          console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
          console.log('The item is titled "' + e.item.title + '"');
        });
      } else if (e.itemIndex === 3) 
      {
        // Google Doc with my API Key. 
        var GDOC = "https://docs.google.com/spreadsheets/export?id=1Qkup3uHxKgsuLgOJQ-L9S-YoTa5zNp3mu4SPk9abvKY&exportFormat=csv&key=AIzaSyD51aJRxs-vxk5QpyuSgSg7YsmFBU3aATQ";
      
        console.log("you want a schedule...");
        var scheduleMenu = new UI.Menu();
        
        var req = new XMLHttpRequest();
        req.open('GET', GDOC, true);
        req.send();
        req.onload = function(e) {
          console.log("in onload");
          if (req.readyState == 4) {
            console.log("in state 4");
            if(req.status == 200) {
              
              console.log("in status 200");
              console.log(req.responseText);
      
              console.log("start string replace");
              var resultsObj = CSVToArray(req.responseText,',');
              // set as 1 to skip headings.. was going to check for "Date"
              for (var k = 1; k < resultsObj.length; k++) {
                if (resultsObj[k][0] === "")
                {
                  // skip
                } else {
                  scheduleMenu.item(0, (k - 1), { title: resultsObj[k][0], subtitle: resultsObj[k][5] + " v " + resultsObj[k][6], scrollable: true });
                }
              }
              
              //show results
              scheduleMenu.show();
                          
              scheduleMenu.on('select', function(e) {
                // scheduled game details
                var picked = (e.itemIndex + 1);
                var gameDate = resultsObj[picked][0] + " " + resultsObj[picked][1] + resultsObj[picked][2] + " " + resultsObj[picked][3];
                var hometeam = resultsObj[picked][5];
                var awayteam = resultsObj[picked][6];
                
                var gameDetailsWindow = new UI.Window();
                //teamDetails(detailsWindows, "San Jose Spiders", "W: 5 | L: 0 | PD: 25", "SJ");
                gameDetails(gameDetailsWindow, gameDate, hometeam, awayteam);
                gameDetailsWindow.show();
              });
              
            } else {
                console.log(req.statusText);
            }
          }
        };
        
      }
  });
  
  menu.show();
});



main.on('longClick', 'select', function(e) {
  var dsWindow = new UI.Window();
  versionScreen(dsWindow);
  dsWindow.show();
});

main.on('longClick', 'up', function(e) {
  var milliseconds = (new Date).getTime();
  var AUDLURL = "http://ec2-54-86-111-95.compute-1.amazonaws.com:4001/Web/Standings?callback=asdf&_=" + milliseconds;

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
        console.log("print found team name");
        
        var myStringArray = response.West;
        var arrayLength = myStringArray.length;
        for (var i = 0; i < arrayLength; i++) {
            var titleText = myStringArray[i].name;
            var subText = "W: " + myStringArray[i].wins + " L: " + myStringArray[i].losses + " PD: " + myStringArray[i].plmn;
            //var iconText = "http://ec2-54-86-111-95.compute-1.amazonaws.com:4001/Logos/TeamIcons_" + myStringArray[i].nm + ".png";
            var iconText = "images/TeamIcons_pbl_50_" + myStringArray[i].nm + ".png";
            var obj = {};
          
            scoresMenu.item(0, i, { title: " " + titleText, subtitle: " " + subText, icon: iconText });
        }
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
  
  card.title('AUDL');
  card.subtitle('Legal');
  card.body('All Images copyrighted by the American Ultimate Disc League and respective teams. Statistics provided by REST api of ultimate-numbers.com. Schedule from Google Docs. Created by isaac.johnson@gmail.com');
  card.style('small');
  card.scrollable('true');
  card.show();
});


//add subscreens for individual invoice details
main.on('click', 'select', function(e){
  displayMenu.show();
});

displayMenu.on('click', 'back', function(e){
  displayMenu.hide();
});
