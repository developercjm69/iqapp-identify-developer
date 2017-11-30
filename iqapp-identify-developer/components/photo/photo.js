'use strict';

app.photoView = kendo.observable({});

(function (parent) {
    var tries = 0,
        errorResult = function (e) {
            if (e != undefined)
            {
                return;
                //console.log("There has been a connection error!.");
                //alert(e.reason);
            }
            else
            {
                return;
            }
            
        },
        loginResult = function (e) {
            //console.log("loginResult");
            console.log(e.reason);
            tries += 1;

            if (tries >= 3) {
                alert("Please check IQ Credentials on the Settings screen and try again.");
                return;
            }

            if (e.loggedIn == true) {
                photoModel.processBarcodeResult();
            } else {
                errorResult(e);
                app.mobileApp.navigate("#:back");
                //app.mobileApp.navigate('components/home.html');
            }
        },
        getImageName = function () {
            var photoName = app.photoView.photoModel.get("params.itemId") + "-";

            // get right now
            var d = new Date();
            var day = d.getDate();
            if (day.length < 2) day = '0' + day; // add leading zero if needed
            var month = (d.getMonth() + 1).toString();
            if (month.length < 2) month = '0' + month; // ditto

            var year = d.getFullYear();

            var dateString = day.toString() + month.toString() + year.toString() + "-" + d.getTime().toString();
            console.log(dateString);
            photoName = photoName + dateString + ".jpg";

            return photoName;
        },
        updateFileImageUrl = function (uriBatch) {
            console.log("updateFileImageUrl");

            var originalUrl = app.photoView.photoModel.get("params.imageurl");
            var inventoryid = app.photoView.photoModel.get("params.inventoryid");

            //var photourl = originalUrl + uriBatch;

            var photourl = "";
            if (originalUrl.length == 0) {
                photourl = uriBatch;
            } else {
                photourl = originalUrl + '|' + uriBatch;
            }

            var dta = [{
                "inventoryid": inventoryid.toString(),
                "imageurl": photourl
            }];

            var fullUri = app.settings.urls.updateImageUrlById;
            //alert(fullUri);
            alert(JSON.stringify(dta))

            $.ajax({
                url: fullUri,
                contentType: 'application/json',
                type: 'POST',
                headers: {
                    'ApprendaSessionToken': app.settings.apprendaToken
                },
                data: JSON.stringify(dta),
                success: function (s) {
                    // put in check, returns success with error message right now
                    console.log("ImageUrl updated successfully");
                    alert("URLs uploaded successfully!");
                    app.mobileApp.hideLoading();

                    // here we can modify something in UI display, navigate back, etc.
                    console.log(s);
                    app.mobileApp.navigate("#:back");
                },
                error: function (e) {
                    console.log("ImageUrl update error");
                    console.log(e);
                    app.mobileApp.hideLoading();
                }
            });
        },
        uploadSequencer = function (sequence, buildString, status) {
            console.log("sequencer hit: " + sequence + "/" + buildString);
            if (status.result == "complete") {
                updateFileImageUrl(buildString);
            } else if (status.result == "error") {
                errorResult(status.messsage);
            } else {
                sequence += 1;
                uploadFileSequence(sequence, buildString);
            }
        },
        uploadFileSequence = function (sequence, buildString) {
            console.log("starting uploadFileSequence: " + sequence + "/" + buildString);

            console.log(app.settings.photoList.length);

            if (sequence >= app.settings.photoList.length) {
                uploadSequencer(sequence, buildString, { result: "complete", message: "Sequence complete" });
                return;
            }

            // key is from eh@telerik account
            var CLIENT_ID = app.appSettingsView.appSettingsModel.params.dropboxApi;

            // debug code to ensure we have account
            if (CLIENT_ID == null || CLIENT_ID == "" || CLIENT_ID == undefined) {
                CLIENT_ID = "12ch1mb0b0qxpz4";
            }

            var urlOptions = {
                download: true,
                downloadHack: true
            };

            var data = app.settings.photoList[sequence];
                        console.log(data);

                        var accessToken = "";
                        authenticateWithCordova();


            window.resolveLocalFileSystemURL(data.fileName,
                function (fileEntry) {
                    fileEntry.file(function (file) {
                        var reader = new FileReader();
                        reader.onloadend = function (z) {
                            var res = this.result;
                            var binResult = res.substr(res.indexOf(',') + 1);

                            // data > blob
                            var byteCharacters = atob(binResult);
                            var byteNumbers = new Array(byteCharacters.length);
                            for (var i = 0; i < byteNumbers.length; i++) {
                                byteNumbers[i] = byteCharacters.charCodeAt(i);
                            }
                            var byteArray = new Uint8Array(byteNumbers);
                            var blob = new Blob([byteArray], { type: "image/jpeg" });

                            // get timestamped name
                            var photoName = getImageName();
 


                            var dbx = new Dropbox({ clientId: CLIENT_ID });

                            client.authDriver(new Dropbox.AuthDriver.Cordova());
                            client.authenticate(function (error, dbclient) {
                    
                                if (error) {
                                    uploadSequencer(sequence, buildString, { result: "error", message: "Error authenticating with DropBox.  Please try to login again." });
                                    app.mobileApp.hideLoading();
                                    return;
                                }

                                dbclient.writeFile(photoName, blob, function (e, s) {
                                    if (e) {
                                        uploadSequencer(sequence, buildString, { result: "error", message: "Error writing file to Dropbox." });
                                        app.mobileApp.hideLoading();
                                        return;
                                    }

                                    console.log("writeFile.success");
                                    dbclient.makeUrl(s.path, urlOptions, function (urlError, url) {
                                        if (urlError) {
                                            uploadSequencer(sequence, buildString, { result: "error", message: "Error getting share url from Dropbox." });
                                            app.mobileApp.hideLoading();
                                            return;
                                        }
                                        console.log("dbclient.makeUrl success");

                                        var buildPlus = "";
                                        if (sequence == 0) {
                                            buildPlus = url.url;
                                        } else {
                                            buildPlus = buildString + '|' + url.url;
                                        }

                                        //var buildPlus = buildString + '|' + url.url;
                                        uploadSequencer(sequence, buildPlus, { result: "continue", message: "" });
                                    });
                                })
                            });
                        };
                        reader.readAsDataURL(file);
                    });
                },
                function (fileFail) {
                    console.log("simulator could not resolve local file system")
                    uploadSequencer(sequence, buildString, { result: "error", message: fileFail });
                    app.mobileApp.hideLoading();
                });
        },
        padNumber = function (num, length) {
            var resultString = '' + num;
            while (resultString.length < length) {
                resultString = '0' + resultString;
            }

            return resultString;
        },
        photoModel = kendo.observable({
            newItem: {
                ItemNumber: '1',
                itemDescription: 'NS',
                itemId: '2'

            },
            params: {
                itemId: "NS",
                itemDescription: "NS",
                imageSrc: null,
                inventoryid: null,
                imageurl: null,
                deleteItemId: null
            },
            //photoList: app.settings.photoList,

            singlePhotoData: null,
            selectedPhoto: null,
            //** Process the bacode result ***//
            processBarcodeResult: function () {
                var fullUri = app.settings.urls.getById + app.settings.tempSettings.barcodeScanId;
                if (app.settings.apprendaToken == null) {
                    app.iqAuth.loginTwo(loginResult);
                } else {
                    console.log("auth token exists, trying inventory api for id " + app.settings.tempSettings.barcodeScanId);
                    $.ajax({
                        url: fullUri,
                        contentType: 'application/json',
                        type: 'GET',
                        headers: {
                            'ApprendaSessionToken': app.settings.apprendaToken
                        },
                        success: function (s) {
                            console.log(s);

                            // format poid and poline for leading zero requirements
                            var paddedPoid = padNumber(s.poid, 4);
                            var paddedPoline = padNumber(s.poline, 4);

                            var spanid = document.getElementById('itemId');
                            spanid.innerText = spanid.textContent = paddedPoid + "-" + paddedPoline;
                            //photoModel.set("params.itemId", paddedPoid + "-" + paddedPoline);
                            photoModel.set("params.itemNumber", s.item);

                            var span = document.getElementById('itemNumber');
                            span.innerText = span.textContent = s.item;
                            //photoModel.newItem.ItemNumber = s.item.trim();

                            var spanDesc = document.getElementById('itemDescription');
                            spanDesc.innerText = spanDesc.textContent = s.itemdesc;
                            //photoModel.set("params.itemDescription", s.itemdesc);

                            photoModel.set("params.inventoryid", s.inventoryid);
                            photoModel.set("params.imageurl", s.imageurl);

                            app.settings.photoList = [];

                        },
                        error: function (e) {
                            console.log(e);
                            //alert(JSON.stringify(e));
                        }
                    });
                }
            },
            init: function (e) {
                // make large image zoomable
                $("#zoomable").panzoom({
                    minScale: 0.5,
                    maxScale: 3
                });

                $("#photo-list").kendoTouch({
                    hold: function (e) {
                        var itemId = $(e.event.target).parents("li").attr("data-uid");
                        console.log(e);
                        photoModel.params.deleteItemId = itemId;

                        $("#confirm-delete-modal").data("kendoMobileModalView").open();
                    }
                });
            },
            beforeShow: function (e) {
                console.log("beforeShow");
                //**photoList.length = 0;
                tries = 0;
                photoModel.processBarcodeResult();

                $("#file-info-div").show();
                $("#photo-list-div").hide();


                $(".km-state-active").removeClass("km-state-active");
            },
            uploadClick: function (e) {
                $(".km-state-active").removeClass("km-state-active");

                if (app.settings.photoList.length == 0) {
                    alert("No pictures to upload.");
                    return;
                } else {
                    app.mobileApp.showLoading();
                    uploadSequencer(-1, "", { result: "continue" });
                }
            },
            pictureClick: function (e) {
                $(".km-state-active").removeClass("km-state-active");

                // Get quality every time we take photo.  If no setting saved, default to full size.
                var qualMod = Number(app.appSettingsView.appSettingsModel.params.fileSize);
                if (qualMod == NaN || qualMod == "") qualMod = 0;
                qualMod += 1;
                var qualityValue = 100 / qualMod;

                if (window.navigator.simulator === undefined) {
                     var options = {
                        quality: qualityValue, 
                        destinationType: 1,
                        encodingType: 0,
                        sourceType: 1,
                        targetWidth: 2560, // we can tweak width/height based on determined quality if desired
                        targetHeight: 1920
                    };

                    navigator.camera.getPicture(function (data) {
                        var image = document.getElementById('lastImage');

                        if (data.indexOf("file") == 0) { // fileUrl response
                            if (app.settings.photoList.length == 0) {
                                $("#file-info-div").hide();
                                $("#photo-list-div").show();
                            }

                            var widthMeasure = (app.settings.photoList.length + 1) * 100 + 5;
                            var scr = $("#photo-scroll-container");
                            scr.width(widthMeasure);

                            app.settings.photoList.push({ fileName: data });
                            photoModel.selectedPhoto = data;
                            image.src = data;

                        } else { // base64 response
                            alert("Need file-based, not image data based, for proper memory functionality.  Only one image can be stored with this method.");
                            image.src = "data:image/jpeg;base64," + data;
                            photoModel.singlePhotoData = data;
                        }
                    }, function (error) {
                        console.log(JSON.string(error));
                        //alert(JSON.stringify(error));
                    }, options);
                } else {
                    // simulator code, can remove when finished testing
                    var image = document.getElementById('lastImage');
                    //var image = new Image();
                    var widthMeasure = (app.settings.photoList.length + 1) * 100 + 5;
                    var scr = $("#photo-scroll-container");
                    scr.width(widthMeasure);

                    var serverImage = "images/server_room" + Math.floor(Math.random() * 3) + ".jpg";
                    app.settings.photoList.push({ fileName: serverImage });
                    photoModel.selectedPhoto = serverImage;
                    image.src = serverImage;

                    //if (app.settings.photoList.length == 0) {
                        $("#file-info-div").hide();
                        $("#photo-list-div").show();
                    //}

                  }
            },
            //scanClick: function (e) { // not implemented, hidden on UI currently
            //    console.log("scan not implemented");
            //    console.log(e);
            //    $(".km-state-active").removeClass("km-state-active");
            //},
            imageSelect: function (e) {
                var image = document.getElementById('lastImage');
                console.log("imageSelect");
                console.log(e);

                var fileName;
                if (e.dataItem === undefined) {
                    fileName = e.data.selectedPhoto;
                } else {
                    fileName = e.dataItem.fileName;
                }

                image.src = fileName;
                photoModel.selectedPhoto = fileName;
            },
            confirmDelete: function (e) {
                console.log("confirmDelete");
                if (e.button[0].innerText === "Yes") {
                    var itemId = photoModel.params.deleteItemId;
                    var pl = $("#photo-list").data("kendoMobileListView");

                    var raw = pl.dataSource.data();

                    for (var i = 0; i < raw.length; i++) {
                        var curTest = raw[i];
                        console.log(curTest);
                        if (curTest.uid === itemId) {
                            pl.dataSource.remove(curTest);
                        }
                    }

                    // clean up for image delete
                    raw = pl.dataSource.data();
                    var image = document.getElementById('lastImage');

                    if (raw.length == 0) {
                        image.src = null;
                    } else {
                        var first = raw[0];
                        image.src = first.fileName;
                    }
                }

                $("#confirm-delete-modal").data("kendoMobileModalView").close();
            }
        });

    parent.set('photoModel', photoModel);
})(app.photoView);
