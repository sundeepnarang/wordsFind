/**
 * Created by Sundeep on 3/9/2016.
 */

$(function(){
   $("form").submit(function(e){

       $.ajax({
           type: "POST",
           url: "/?"+$("form").serialize(),
           success: function(data)
           {
               $("pre").text(data.join(", ")); // show response from the php script.
           }
       });

       e.preventDefault(); // avoid to execute the actual submit of the form.
   })
});