// App.js

Dropzone.autoDiscover = false;

function init() {
    let dz = new Dropzone("#dropzone", {
        url: "/",
        maxFiles: 1,
        addRemoveLinks: true,
        dictDefaultMessage: "Some Message",
        autoProcessQueue: false
    });
    
    dz.on("addedfile", function() {
        if (dz.files[1]!=null) {
            dz.removeFile(dz.files[0]);        
        }
    });

    dz.on("complete", function (file) {
        let imageData = file.dataURL;
        
        var url = "http://127.0.0.1:5000/classify_image";

        $.post(url, {
            image_data: file.dataURL
        },function(data, status) {
            console.log(data);
            if (!data || data.length==0) {
                $("#resultHolder").hide();
                $("#divClassTable").hide();                
                $("#error").show();
                return;
            }
            let players = ["adityanath yogi", "amit shah", "arvind kejriwal", "Bhagwant Singh Mann", "Bhajan Lal Sharma", "Bhupendrabhai Patel", "Conrad Sangma", "Eknath Shinde", "Hemant Soren", "Himanta Biswa Sarma", "Lalduhoma", "M. K. Stalin", "Mamata Banerjee", "Manik Saha", "manohar Lal Khattar", "Mohan Yadav", "N. Biren Singh", "N. Rangaswamy", "narendra modi", "Naveen Patnaik", "Neiphiu Rio", "Nitish Kumar", "Pema Khandu", "Pinarayi Vijayan", "Pramod Sawant", "Prem Singh Tamang", "Pushkar Singh Dhami", "Revanth Reddy", "Siddaramaiah", "sukhvinder Singh Sukhu", "vishnudeo sai", "Y. S. Jagan Mohan Reddy"];
            
            let match = null;
            let bestScore = -1;
            for (let i=0;i<data.length;++i) {
                let maxScoreForThisClass = Math.max(...data[i].class_probability);
                if(maxScoreForThisClass>bestScore) {
                    match = data[i];
                    bestScore = maxScoreForThisClass;
                }
            }

            if (match) {
                $("#error").hide();
                $("#resultHolder").show();
                $("#divClassTable").show();
                $("#resultHolder").html($(`[data-player="${match.class}"]`).html());
                let classDictionary = match.class_dictionary;
                for(let personName in classDictionary) {
                    let index = classDictionary[personName];
                    let proabilityScore = match.class_probability[index];
                    let elementName = "#score_" + personName.replace(/[. ]/g, '_');
                    console.log(elementName);
                    $(elementName).html(proabilityScore);
                }
            }
            // dz.removeFile(file);            
        });
    });

    $("#submitBtn").on('click', function (e) {
        dz.processQueue();		
    });
}

$(document).ready(function() {
    console.log( "ready!" );
    $("#error").hide();
    $("#resultHolder").hide();
    $("#divClassTable").hide();

    init();
});