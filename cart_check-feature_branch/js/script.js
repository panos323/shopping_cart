$(document).ready(function() {

    $.ajax({
        type: "GET" ,
        url: "items.xml" ,
        dataType: "xml" ,
        success: function(xml) {
            //function for xml values
            dataToDivs(xml,'smartphone_alpha','.smartphones.alpha');
            dataToDivs(xml,'smartphone_beta','.smartphones.beta');
            dataToDivs(xml,'smartphone_gama','.smartphones.gama');
            dataToDivs(xml,'laptop_delta','.laptops.delta');
            dataToDivs(xml,'laptop_epsilon','.laptops.epsilon');
            dataToDivs(xml,'laptop_zita','.laptops.zita');

            //insert buttons to divs
            insertBtn('.priceStyle');

            //add clicked items to basket
            addItemToBasket();

            //bring button text to previus text after mouseleave
            clearButtonText();

            //remove item from basket
            removeCartItem();

            //on save button click pass data to console and refresh page
            passDataXML();

         },//success
        error:function(xhr,error) {
            console.log(xhr);
            console.log(error);
        }//error
    });

}); //PAGE LOADED


var totalPrice = 0;


/*-----------------pass data from xml to divs-----------------------*/
function dataToDivs(xml,name,className) {
    var brandXml = $(xml).find(name).find('brand').text();
    var modelXml = $(xml).find(name).find('model').text();
    var descXml = $(xml).find(name).find('description').text();
    var priceXml = $(xml).find(name).find('price').text();
    
    $(className).append('<h3 class="brandStyle">' + brandXml + '</h3>');
    $(className).append('<h4>' + modelXml + '</h4>');
    $(className).append('<p>' + descXml + '</p>');
    $(className).append('<p class="priceStyle">' + priceXml + '</p>');
}
/*-----------------pass data from xml to divs-----------------------*/


//insert button
function insertBtn(element) {
    $( "<button  class='addBtn'>Add to Cart <i class='fas fa-cart-plus'></i></button>" ).insertAfter( $(element) );
}

//on button click add items to basket
function addItemToBasket() {
    $(".addBtn").on("click", function(e) {
        e.preventDefault();
        $(this).html("Added");
        
        //take text for brand,model,price from divs
        var brandName = $(this).prevAll().eq(3).text();
        var modelName = $(this).prevAll().eq(2).text();
        var brandPrice = $(this).prevAll().eq(0).text();

        //append text to the basket
        $("#itemsInBasket").append("<div class='itemsCont'><h4>Brand: " + brandName + "<span class='removeItem'>&times</span></h4><p>Model: " + modelName + "</p><p class='priceField'>Price: " + brandPrice + "</p><hr></div>");

        //calculate totalPrice
        calcTotal(brandPrice);
    
    }); //on click 
};//function

//calculate totalPrice
function calcTotal(brandPrice) {
        var price = brandPrice.replace(/[^0-9\.]+/g, "");

        //set total price
        totalPrice += parseInt(price);
        if (totalPrice <= 100) { //calculate for a price without discount
            var totalFixed = totalPrice.toFixed(2);
            $("#totalPrice").html(totalFixed + "$");
            $(".discOrdering").css("color","red");
        } else { //calculate for a price with discount
            //discount 10%
            var discountTenPer = (totalPrice / 100) * 10;
            //final price with discount
            var finalPrice = totalPrice - discountTenPer;                       
            var fixedFinalPrice = finalPrice.toFixed(2);
            $("#totalPrice").html(fixedFinalPrice + "$");
            $(".discOrdering").css("color","green");
        }

        if (totalPrice > 0) {
            displayBuyBtn();

        } 
}; //function

//bring button text to previus text after mouseleave
function clearButtonText() {
    $(".addBtn").on("mouseout", function(e) {
        $(this).html("Add to Cart <i class='fas fa-cart-plus'></i>");
    });
};

//if remove-icon is clicked,remove that item from cart
function removeCartItem() {
   $(document).on("click", ".removeItem", function() {

    //take price of  item that ll be removed
    var removedPrice = $(this).closest("div").find(".priceField").text();
    var removedPriceNum = removedPrice.replace(/[^0-9\.]+/g, "");

    //remove product
    var product = $(this).closest("div").remove();
    product.empty();

    //function that calculate basket if items are removed
    calcTotalIfRemovedItems(removedPriceNum);

   });//click
}//function

//function that calculate basket if items are removed
function calcTotalIfRemovedItems(removedPriceNum) {
    totalPrice -= parseInt(removedPriceNum);
    if (totalPrice <= 100) { //calculate for a price without discount         
        var totalFixed = totalPrice.toFixed(2);
        $("#totalPrice").html(totalFixed + "$");
        $(".discOrdering").css("color","red");  
    } else  { //calculate for a price with discount
        $("#totalPrice").html(totalPrice + "$");
        $(".discOrdering").css("color","green");
    }

    //hide buy button if all products are deleted from cart
    if ($(".itemsCont").length == 0 || totalPrice == 0) {
        hiddeBuyBtn();
    }//if

}//function

//appear buy button
function displayBuyBtn() {
    $("#buyBtn").css("display","inline");
}

//hide buy button
function hiddeBuyBtn() {
    $("#buyBtn").css("display","none");
}

//on save button click pass data to console and refresh page
function passDataXML() {
    $("#buyBtn").one("click", function() {
    var details =  $(".itemsCont").children("p").text();
    var total_price =  $("#totalPrice").text();
    //pass values to xml document
    var xmlDoc = jQuery.parseXML("<total_price>"+total_price+"<details>"+details+"</details></total_price>");
    console.log(xmlDoc);


     //pass variables to local storage
    var xml = new XMLSerializer().serializeToString(xmlDoc);
    localStorage.setItem("myDocument", xml);

     var xml = localStorage.getItem("myDocument");
     var restoredDom = new DOMParser().parseFromString(xml, "text/xml");

 
    //refrsh page after succesful button submit
     alert("Your order is set");
     document.location.reload();


    });//click
};


