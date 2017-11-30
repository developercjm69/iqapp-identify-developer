'use strict';

function SaveInventoryByInventoryID(pinventoryid, pitemid, pitemnumber, pmfgr, pmfgrid, pconditioncode,
                                     pserialnumber, pweight, pwarehouse, plocation, pcountrycode,
                                     userdefined1, userdefined2, userdefined3, userdefined4, userdefined5) {
    //let's check the itemid 
    if (pitemid != null) {
        alert("If the api existed, then save would be complete.");
    }
    // let's check the itemnumber and mfgr
    if (pitemnumber != null && pmfgr != null) {
        alert("If the api existed, then save would be complete.");
    }
    alert("If the api existed, then save would be complete.");
    return;
};
function authenticateWithCordova() {
    var dbx = new Dropbox({ clientId: CLIENT_ID });
    dbx.authenticateWithCordova(AuthSuccess, AuthFail);
    return accessToken;

}

function AuthSuccess(accessToken) {
    localStorage.accessToken = accessToken
}

function AuthFail() {
    alert("Auth Fail");
};
function GetDropboxFileMetaData(pfileid, paccessToken) {
    var fullUri = "https://api.dropboxapi.com/2/files/get_file_metadata"

    var dta = {
        "file": "id:"+pfileid,
        "actions": []
    }
        
        
     $.ajax({
        url: fullUri,
        contentType: 'application/json',
        data: dta,
        type: 'POST',
        async: false,
        headers: {
            'Authorization': "Bearer "+paccessToken,
        },
        success: function (s) {
            console.log("Save was a success.");
            console.log(s);
            app.settings.tempsettings.SaveSuccess = true;
            app.settings.tempsettings.Preview_Url = s.preview_url;
        },
        error: function (e) {
            console.log("The inventoryid is " + pinventoryid);
            console.log("The itemnumber is " + pitemnumber);
            console.log("The mfgr is " + pmfgr);
            console.log("There was an error during the save.");
            console.log(e);
        }
    });

}

// Parses the url and gets the access token if it is in the urls hash

function getAccessTokenFromUrl() {

    return utils.parseQueryString(window.location.hash).access_token;

}

// If the user was just redirected from authenticating, the urls hash will

// contain the access token.

function isAuthenticated() {

    return !!getAccessTokenFromUrl();

}

function UpdateInventoryByItemnumberAndMfgr (pinventoryid, pitemnumber, pmfgr) {
    //this function save the itemnumber and mfgr all at the same time
    if (pitemnumber == null && pmfgr == null) {
        console.log("pitemnumber or pmfgr is null")
        return;
    }

    var fullUri = app.settings.urls.UpdateItemnumberAndMfgrById
    //"<mfgr>" + pmfgr + "</mfgr>" +

    var dta = "<request>" +
                "<inventories>" +
                    "<inventory>" +
                        "<inventoryid>" + pinventoryid + "</inventoryid>" +
                        "<itemnumber>" + pitemnumber + "</itemnumber>" +
                        "<mfgr>" + pmfgr + "</mfgr>" +
                   "</inventory>" +
                "</inventories>" +
              "</request>";

    $.ajax({
        url: fullUri,
        contentType: 'application/xml',
        data: dta,
        type: 'POST',
        async: false,
        headers: {
            'ApprendaSessionToken': app.settings.apprendaToken
        },
        success: function (s) {
            console.log("Save was a success.");
            console.log(s);
            app.settings.tempsettings.SaveSuccess = true;
        },
        error: function (e) {
            console.log("The inventoryid is " + pinventoryid);
            console.log("The itemnumber is " + pitemnumber);
            console.log("The mfgr is " + pmfgr);
            console.log("There was an error during the save.");
            console.log(e);
        }
    });

};
function UpdateConditionCodeByInventoryId(pinventoryid, pconditioncode) {
    //this function saves the Condition Code in the inventory record
    var fullUri = app.settings.urls.UpdateConditionCodeByInventoryId;

    var dta = "<request>" +
               "<option>1</option>"+
               "<updatehistory>1</updatehistory>" +
               "<inventories>"+
                    "<inventory>"+
                        "<inventoryid>" + pinventoryid + "</inventoryid>" +
                        "<conditioncode>" + pconditioncode + "</conditioncode>" +
                    "</inventory>" +
                "</inventories>" +
              "</request>";

    $.ajax({
        url: fullUri,
        contentType: 'application/xml',
        data: dta,
        type: 'POST',
        headers: {
            'ApprendaSessionToken': app.settings.apprendaToken
        },
        success: function (s) {
            app.settings.tempsettings.SaveSuccess = true;
            console.log("Save was a success.");
            console.log(s);
        },
        error: function (e) {
            console.log("The inventoryid is " + pinventoryid);
            console.log("The condition code is " + pconditioncode);
            console.log("There was an error during the Condition Code save.");
            console.log(e);
        }
    });

};
function UpdateWeightByInventoryId(pinventoryid, pweight) {
    //this function saves the weight value for the inventory record
    var fullUri = app.settings.urls.UpdateWeightByInventoryId

    var dta =  "<Inventories>"+
                    "<Inventory>"+
                        "<inventoryid>" + pinventoryid + "</inventoryid>" +
                        "<weight>" + pweight + "</weight>" +
                    "</Inventory>"+
                "</Inventories>";

    $.ajax({
        url: fullUri,
        contentType: 'application/xml',
        data: dta,
        type: 'POST',
        headers: {
            'ApprendaSessionToken': app.settings.apprendaToken
        },
        success: function (s) {
            app.settings.tempsettings.SaveSuccess = true;
            console.log("Save was s success.");
            console.log(s);
        },
        error: function (e) {
            console.log("The inventoryid is "+pinventoryid);
            console.log("The weight is "+pweight);
            console.log("There was an error during Weight save.");
            console.log(e);
        }
    });

};
function UpdateWarehouseByInventoryId(pinventoryid, pwarehouse) {
    //this function save the warehouse value for the inventory record
    var fullUri = app.settings.urls.UpdateWarehouseByInventoryId

    var dta = "<request>" +
                "<inventories>" +
                    "<inventory>"+
                        "<inventoryid>" + pinventoryid + "</inventoryid>" +
                        "<warehouse>" + pwarehouse + "</warehouse>" +
                    "</inventory>"+
                "</inventories>"+
              "</request>";

    $.ajax({
        url: fullUri,
        contentType: 'application/xml',
        data: dta,
        type: 'POST',
        headers: {
            'ApprendaSessionToken': app.settings.apprendaToken
        },
        success: function (s) {
            app.settings.tempsettings.SaveSuccess = true;
            console.log("Save was a success.");
            console.log(s);
        },
        error: function (e) {
            console.log("The inventoryid is "+pinventoryid);
            console.log("The warehouse is "+pwarehouse);
            console.log("There was an error during Warehouse save.");
            console.log(e);
        }
    });

};
function UpdateLocationByInventoryId(pinventoryid, plocation) {
    //this function save the warehouse value for the inventory record
    var fullUri = app.settings.urls.UpdateLocationByInventoryId

    var dta = "<request>" +
                "<inventories>"+
                    "<inventory>"+
                        "<inventoryid>" + pinventoryid + "</inventoryid>" +
                        "<location>" + plocation + "</location>" +
                    "</inventory>"+
                "</inventories>"+
              "</request>";

    $.ajax({
        url: fullUri,
        contentType: 'application/xml',
        data: dta,
        type: 'POST',
        headers: {
            'ApprendaSessionToken': app.settings.apprendaToken
        },
        success: function (s) {
            app.settings.tempsettings.SaveSuccess = true;
            console.log("Save was a success.");
            console.log(s);
        },
        error: function (e) {
            console.log("The inventoryid is "+pinventoryid);
            console.log("The location is "+plocation);
            console.log("There was an error during the save.");
            console.log(e);
        }
    });

};
function UpdateCountryCodeByInventoryId(pinventoryid, pcountrycode) {
    //this function save the countrycode value for the inventory record
    var fullUri = app.settings.urls.UpdateCountryCodeByInventoryId

    var dta = "<request>" +
                    "<inventories>"+
                        "<inventory>"+
                            "<inventoryid>" + pinventoryid + "</inventoryid>" +
                            "<countrycode>" + pcountrycode + "</countrycode>" +
                        "</inventory>"+
                    "</inventories>" +
              "</request>";

    $.ajax({
        url: fullUri,
        contentType: 'application/xml',
        data: dta,
        async: false,
        type: 'POST',
        headers: {
            'ApprendaSessionToken': app.settings.apprendaToken
        },
        success: function (s) {
            app.settings.tempsettings.SaveSuccess = true;
            console.log("Save was a success.");
            console.log(s);
        },
        error: function (e) {
            console.log("The inventoryid is " + pinventoryid);
            console.log("The country is " + pcountrycode);
            console.log("There was an error during the save.");
            console.log(e);
        }
    });

};
function UpdateSerialnumberByInventoryId(pinventoryid, pserialnumber) {
    //this function save the serial number value for the inventory record
    var fullUri = app.settings.urls.UpdateSerialnumberByInventoryId

    var dta = "<request>" +
                    "<inventories>" +
                        "<inventory>"+
                            "<inventoryid>" + pinventoryid + "</inventoryid>" +
                            "<serialnumber>" + pserialnumber + "</serialnumber>" +
                        "</inventory>"+
                    "</inventories>"+
              "</request>";

    $.ajax({
        url: fullUri,
        contentType: 'application/xml',
        data: dta,
        type: 'POST',
        headers: {
            'ApprendaSessionToken': app.settings.apprendaToken
        },
        success: function (s) {
            app.settings.tempsettings.SaveSuccess = true;
            console.log("Save was a success.");
            console.log(s);
        },
        error: function (e) {
            console.log("The inventoryid is "+pinventoryid);
            console.log("The serial number is "+pserialnumber);
            console.log("There was an error during the Serial Number save.");
            console.log(e);
        }
    });

};
function UpdateUserdefined1ByInventoryId(pinventoryid, puserdefined1) {
    //this function save the warehouse value for the inventory record
    var fullUri = app.settings.urls.UpdateUserdefined1ByInventoryId

    var dta = "<request>" +
                 "<inventories>" +
                    "<inventory>" +
                        "<inventoryid>" + pinventoryid + "</inventoryid>" +
                        "<userdefined1>" + puserdefined1 + "</userdefined1>" +
                    "</inventory>" +
                 "</inventories>" +
              "</request>";

    $.ajax({
        url: fullUri,
        contentType: 'application/xml',
        data: dta,
        type: 'POST',
        headers: {
            'ApprendaSessionToken': app.settings.apprendaToken
        },
        success: function (s) {
            app.settings.tempsettings.SaveSuccess = true;
            console.log("Save was a success.");
            console.log(s);
        },
        error: function (e) {
            console.log("The inventoryid is " + pinventoryid);
            console.log("The userdefined1 is " + puserdefined1);
            console.log("There was an error during the userdefined1 save.");
            console.log(e);
        }
    });

};
function UpdateUserdefined2ByInventoryId(pinventoryid, puserdefined2) {
    //this function save the warehouse value for the inventory record
    var fullUri = app.settings.urls.UpdateUserdefined2ByInventoryId

    var dta = "<request>" +
                 "<inventories>" +
                    "<inventory>" +
                        "<inventoryid>" + pinventoryid + "</inventoryid>" +
                        "<userdefined2>" + puserdefined2 + "</userdefined2>" +
                    "</inventory>" +
                 "</inventories>" +
              "</request>";

    $.ajax({
        url: fullUri,
        contentType: 'application/xml',
        data: dta,
        type: 'POST',
        headers: {
            'ApprendaSessionToken': app.settings.apprendaToken
        },
        success: function (s) {
            app.settings.tempsettings.SaveSuccess = true;
            console.log("Save was a success.");
            console.log(s);
        },
        error: function (e) {
            console.log("The inventoryid is " + pinventoryid);
            console.log("The userdefined2 is " + puserdefined2);
            console.log("There was an error during the userdefined2 save.");
            console.log(e);
        }
    });

};
function UpdateUserdefined3ByInventoryId(pinventoryid, puserdefined3) {
    //this function save the warehouse value for the inventory record
    var fullUri = app.settings.urls.UpdateUserdefined3ByInventoryId

    var dta = "<request>" +
                 "<inventories>" +
                    "<inventory>" +
                        "<inventoryid>" + pinventoryid + "</inventoryid>" +
                        "<userdefined3>" + puserdefined3 + "</userdefined3>" +
                    "</inventory>" +
                 "</inventories>" +
              "</request>";

    $.ajax({
        url: fullUri,
        contentType: 'application/xml',
        data: dta,
        type: 'POST',
        headers: {
            'ApprendaSessionToken': app.settings.apprendaToken
        },
        success: function (s) {
            app.settings.tempsettings.SaveSuccess = true;
            console.log("Save was a success.");
            console.log(s);
        },
        error: function (e) {
            console.log("The inventoryid is " + pinventoryid);
            console.log("The userdefined3 is " + puserdefined3);
            console.log("There was an error during the userdefined3 save.");
            console.log(e);
        }
    });

};
function UpdateUserdefined4ByInventoryId(pinventoryid, puserdefined4) {
    //this function save the warehouse value for the inventory record
    var fullUri = app.settings.urls.UpdateUserdefined4ByInventoryId

    var dta = "<request>" +
                 "<inventories>" +
                    "<inventory>" +
                        "<inventoryid>" + pinventoryid + "</inventoryid>" +
                        "<userdefined4>" + puserdefined4 + "</userdefined4>" +
                    "</inventory>" +
                 "</inventories>" +
              "</request>";

    $.ajax({
        url: fullUri,
        contentType: 'application/xml',
        data: dta,
        type: 'POST',
        headers: {
            'ApprendaSessionToken': app.settings.apprendaToken
        },
        success: function (s) {
            app.settings.tempsettings.SaveSuccess = true;
            console.log("Save was a success.");
            console.log(s);
        },
        error: function (e) {
            console.log("The inventoryid is " + pinventoryid);
            console.log("The userdefined4 is " + puserdefined4);
            console.log("There was an error during the userdefined4 save.");
            console.log(e);
        }
    });

};
function UpdateUserdefined5ByInventoryId(pinventoryid, puserdefined5) {
    //this function save the warehouse value for the inventory record
    var fullUri = app.settings.urls.UpdateUserdefined5ByInventoryId

    var dta = "<request>" +
                 "<inventories>" +
                    "<inventory>" +
                        "<inventoryid>" + pinventoryid + "</inventoryid>" +
                        "<userdefined5>" + puserdefined5 + "</userdefined5>" +
                    "</inventory>" +
                 "</inventories>" +
              "</request>";

    $.ajax({
        url: fullUri,
        contentType: 'application/xml',
        data: dta,
        type: 'POST',
        headers: {
            'ApprendaSessionToken': app.settings.apprendaToken
        },
        success: function (s) {
            app.settings.tempsettings.SaveSuccess = true;
            console.log("Save was a success.");
            console.log(s);
        },
        error: function (e) {
            console.log("The inventoryid is " + pinventoryid);
            console.log("The userdefined5 is " + puserdefined5);
            console.log("There was an error during the userdefined5 save.");
            console.log(e);
        }
    });

}