function formattedDateDb(date) {
    var d = new Date(date || Date.now()),
        year = d.getFullYear(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate();
        

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function formattedDateRangetoDb(idate){
    var dyear = idate.slice(6,12);
    //console.log(dyear);
    var dday = idate.slice(3,5);
    //console.log(dday);
    var dmonth = idate.slice(0,2);
    //console.log(dmonth);

    return dyear + "-" + dmonth + "-" + dday;
}


function datasource_modcam_range(date, array, sex)
{
    var range_array = new Array();

    var dyear = date.slice(0,4);
    var dmonth = date.slice(5,7);
    var dday = date.slice(8,10);

    //console.log(dyear);
    //console.log(dmonth);
    //console.log(dday);
    
    var ihour = 0;
    var icounter = 0;
    var i = 0;


    for(ihour=0; ihour < 24; ihour++){	
        var adate = new Date(dyear, dmonth, dday, ihour, 0, 0, 0);
        var gotdata = false;

        for(icounter=0; icounter < array.length;icounter++){
            if(array[icounter].IHOUR == ihour){
                if(sex == 'f')
                    range_array.push({ time: adate, Female: parseInt(array[icounter].HEADCOUNT) });
                if(sex == 'm')
                    range_array.push({ time: adate, Male: parseInt(array[icounter].HEADCOUNT) });
                gotdata = true;
                break;
            }
        }

        if(!gotdata){
            if(sex == 'f')
               range_array.push({ time: adate, Female: 0 });
            if(sex == 'm')
                range_array.push({ time: adate, Male: 0 });
        }
    }

    return range_array;
}

function emptydatasource_modcam_range(date, sex)
{
    var range_array = new Array();

    var dyear = date.slice(0,4);
    var dmonth = date.slice(5,7);
    var dday = date.slice(8,10);

    //console.log(dyear);
    //console.log(dmonth);
    //console.log(dday);
    
    var ihour = 0;
    var icounter = 0;
    var i = 0;


    for(ihour=0; ihour < 24; ihour++){	
        var adate = new Date(dyear, dmonth, dday, ihour, 0, 0, 0);

        if(sex == 'f')
            range_array.push({ time: adate, Female: 0 });
        if(sex == 'm')
            range_array.push({ time: adate, Male: 0 });
    }

    return range_array;
}

//{ time: new Date("December 05, 2014 18:00:00"), reqs: 107 },