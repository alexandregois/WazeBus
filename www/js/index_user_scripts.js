/*jshint browser:true */
/*global $ */(function()
{
 "use strict";
 /*
   hook up event handlers 
 */
 function register_event_handlers()
 {
    
    
     /* button  #btnBuscarEndereco */
    $(document).on("click", "#btnBuscarEndereco", function(evt)
    {
         /*global activate_page */
         activate_page("#pageTipoOnibus"); 
    });
    
    }
 document.addEventListener("app.Ready", register_event_handlers, false);
})();
