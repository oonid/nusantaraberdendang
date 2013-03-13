/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var myMedia = null;
var mediaTimer = null;
var mediaState = 0;
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    updateMedia: function(songUrl) {
    	if(myMedia != null) {
    		myMedia.release();
    	}
    	function extractFilename(path) {
  		  if (path.substr(0, 12) == "C:\\fakepath\\")
  		    return path.substr(12); // modern browser
  		  var x;
  		  x = path.lastIndexOf('/');
  		  if (x >= 0) // Unix-based path
  		    return path.substr(x+1);
  		  x = path.lastIndexOf('\\');
  		  if (x >= 0) // Windows-based path
  		    return path.substr(x+1);
  		  return path; // just the filename
  		}
       	document.getElementById('audio_title').innerHTML = extractFilename(songUrl);
    	myMedia = new Media(songUrl,
    				function() { // success callback
    					console.log("Media instance success.");
    				},
    				function() { // error callback
    					console.log("Media error");
    				},
    				function(status) {
    					///console.log("status: "+status);
    					mediaState = status;
    					if(status == Media.MEDIA_NONE) {
    						console.log("MEDIA_NONE");
    					} else if(status == Media.MEDIA_STARTING) {
    						console.log("MEDIA_STARTING");
//    				       	document.getElementById('audio_position').innerHTML = 'loading';
//    				   		document.getElementById('play').innerHTML = "P A U S E";
    						$('#play .ui-btn-text').text("P A U S E");
    					} else if(status == Media.MEDIA_RUNNING) {
    						console.log("MEDIA_RUNNING");
//    					   	document.getElementById('play').innerHTML = "P A U S E";
    						$('#play .ui-btn-text').text("P A U S E");
    					} else if(status == Media.MEDIA_PAUSED) {
    						console.log("MEDIA_PAUSED");
//    			    		document.getElementById('play').innerHTML = "P L A Y";
    						$('#play .ui-btn-text').text("P L A Y");
    					} else if(status == Media.MEDIA_STOPPED) {
    						console.log("MEDIA_STOPPED");
//    				       	document.getElementById('audio_position').innerHTML = '<3';
//    			    		document.getElementById('play').innerHTML = "P L A Y";
    						$('#play .ui-btn-text').text("P L A Y");
    					} else {
    						console.log("MEDIA_UNKNOWN");
    					}
    				});
    },
    updatePlayAudio: function(songUrl) {
    	app.updateMedia(songUrl);
    	app.playAudio();
    },
    playAudio: function() {
    	if(myMedia == null) { // init without selecting song
    		this.updateMedia("/android_asset/www/audio/01_Bungong_Jeumpa.m4a");
    	}
    	if(mediaState != Media.MEDIA_STARTING && mediaState != Media.MEDIA_RUNNING) {
    		myMedia.play();
    		// Update myMedia position every second
            if (mediaTimer == null) {
                mediaTimer = setInterval(function() {
                    // get myMedia position
                    myMedia.getCurrentPosition(
                        // success callback
                        function(position) {
                            if (mediaState == 2 && position > -1) {
//                            	document.getElementById('audio_position').innerHTML = position + '/' + myMedia.getDuration() + ' secs.';
                            	$('#audio_position').attr("min", 0);
                            	$('#audio_position').attr("max", myMedia.getDuration());
                            	$('#audio_position').val(position);
                            	$('#audio_position').slider('refresh');
                            }
                        },
                        // error callback
                        function(e) {
                            console.log("Error getting pos=" + e);
//                        	document.getElementById('audio_position').innerHTML = "Error: " + e;
                        }
                    );
                }, 1000);
            }
    	} else {
    		myMedia.pause();
    	}
    },
    stopAudio: function() {
    	$('#audio_position').attr("min", 0);
    	$('#audio_position').attr("max", myMedia.getDuration());
    	$('#audio_position').val(0);
    	$('#audio_position').slider('refresh');
    	myMedia.stop();
    	clearInterval(mediaTimer);
    	mediaTimer = null;
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        //var parentElement = document.getElementById(id);
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');

        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};
