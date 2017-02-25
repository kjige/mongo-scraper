$(document).ready(function(){

    // Whenever someone clicks notes button
    $(document).on("click", ".notes-btn", function() {

        // Empty the notes from the note section
        $(".notes").empty();

        // Save the id from the p tag
        var thisId = $(this).attr("data-id");

        // Now make an ajax call for the Article
        $.ajax({
            method: "GET",
            url: "/notes/" + thisId
        })
            // With that done, add the note information to the page
            .done(function(data) {

                // console.log("HERE " + JSON.stringify(data));
         
                // The title of the article
                $(".notes").append("<h4>" + data.title + "</h4>");
            
                // If there's a note in the article
                if (data.notes.length > 0) {

                    data.notes.map(function(note, i){
                    
                        // Display previous notes with delete button
                        $(".notes").append("<div class='row form-inline'>" + note.noteBody + "<button data-noteId=" + note.noteId + " data-Id=" + thisId + " class='btn btn-danger btn-sm pull-right delete-note'>Delete</button></div>");

                    });
                }

                // A textarea to add a new note body
                $(".notes").append("<textarea id='bodyinput' name='body'></textarea>");

                // A button to submit a new note, with the id of the article saved to it
                $(".notes").append("<button data-id='" + data._id + "' id='save-note' name='newnote'>Save Note</button>");

            });
        });

        // When you click the save-note button
        $(document).on("click", "#save-note", function() {
        
            // Grab the id associated with the article from the submit button
            var thisId = $(this).attr("data-id");

            // Run a POST request to change the note, using what's entered in the inputs
            $.ajax({

                method: "POST",
                url: "/notes/" + thisId,
                data: {

                    // Value taken from note textarea
                    notesBody: $("#bodyinput").val()

                }

            }).done(function(data) {

                if (data === true){
                    
                    window.location.replace("/saved");
                    
                } else {console.log(data);}
            });

        });

        $(document).on("click", ".delete-article-btn", function(){

            var thisId = $(this).attr("data-id");
            
            $.ajax({
                
                method: "PUT",
                url: "/saved/remove/" + thisId
            
            }).done(function(data) {
                
                if (data===true){ 
                    
                    window.location.replace("/saved");
                
                } else { console.log(data); }
            
            });
        });

         $(document).on("click", ".delete-note", function(){

            var thisId = $(this).attr("data-Id");
            var noteId = $(this).attr("data-noteId");
            
            $.ajax({
                
                method: "PUT",
                url: "/note/remove/" + thisId + "/" + noteId
            
            }).done(function(data) {
                
                if (data===true){ 
                    
                    window.location.replace("/saved");
                
                } else { console.log(data); }
            
            });
        });
});