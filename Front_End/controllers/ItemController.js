//buttons
const btnItemAdd = $("#btnItemAdd");
const tblItems = $("#tblItemBody");
const btnItemUpdate = $("#btnItemUpdate");
const btnItemDelete = $("#btnItemDelete");
const btnItemClear = $("#btnItemClear");


//Item fields
const itemIdF = $('#Iid');
const itemDescF = $('#ItemDesc');
const itemPF = $('#UPrice');
const itemQtyF = $('#Qty');

let newItemID;

addItemsToTable();


function clearItemFields() {
    //itemIdF.val("");
    itemDescF.val("");
    itemPF.val("");
    itemQtyF.val("");

    itemDescF.focus();
}

function addItemsToTable() {
    $.ajax({
        url:'http://localhost:8080/Back_End_Web_exploded/item',
        success:function (res) {
            console.log(res);
            tblItems.empty();

            console.log()
            incrementItem(res[res.length-1].code);
            itemIdF.val(newItemID);

            for (let i = 0; i < res.length; i++) {
                let row = $('<tr> <td>'+ res[i].code +'</td> <td>'+ res[i].name +'</td> <td>'+ res[i].qtyOnHand +'</td> <td>'+ res[i].unitPrice +'</td> </tr>');
                tblItems.append(row);
            }

        },
        error:function (error) {
            console.log(error.status);
        }
    })
}

btnItemAdd.click(function (){

    if (validateItemFields()){
        const itemForm = $("#itemForm").serialize();
        $.ajax({
            url:'http://localhost:8080/Back_End_Web_exploded/item',
            data:itemForm,
            method:'POST',
            success:function (res) {
                console.log(res);
                addItemsToTable();
                clearItemFields();
            },
            error:function (error) {
                console.log(error)
            }
        })
    }
});

tblItems.dblclick(function (event){

    btnItemUpdate.prop('disabled',false);
    btnItemDelete.prop('disabled',false);
    btnItemAdd.prop('disabled',true);

    let selectedItemRow = event.target.closest("tr");

    itemIdF.val(selectedItemRow.cells[0].textContent);
    itemDescF.val(selectedItemRow.cells[1].textContent);
    itemPF.val(selectedItemRow.cells[2].textContent);
    itemQtyF.val(selectedItemRow.cells[3].textContent);

});

btnItemUpdate.click(function (){

    if (confirm("Are you sure you want to Update this Item?")) {

        let iID = itemIdF.val();
        let itemDesc = itemDescF.val();
        let itemPrice = itemPF.val();
        let itemQty = itemQtyF.val();

        let itemOB={code:iID,name:itemDesc,qty:itemQty,price:itemPrice}

        $.ajax({
            url:'http://localhost:8080/Back_End_Web_exploded/item',
            method:'put',
            contentType:"application/json",
            data: JSON.stringify(itemOB),
            success:function (res) {
                console.log(res)
                addItemsToTable();
                clearItemFields();
            },
            error:function (error) {
                console.log(error)
            }
        })

    }
});

btnItemDelete.click(function (){

    if (confirm("Are you sure you want to delete this Customer?")) {
        let iID = itemIdF.val();

        $.ajax({
            url:'http://localhost:8080/Back_End_Web_exploded/item?itemID='+iID,
            method:'delete',
            success:function (res) {
                console.log(res)
                addItemsToTable();
                clearItemFields();
            },
            error:function (error) {
                console.log(error)
            }
        })
    }

});


btnItemClear.click(function (){
    clearItemFields();
});

function incrementItem(currentCustomID) {
    const parts = currentCustomID.split('-');
    const numberPart = parseInt(parts[1], 10);
    const incrementedNumber = numberPart + 1;
    const newNumberPart = String(incrementedNumber).padStart(3, '0');
    newItemID= `I00-${newNumberPart}`;
}


//regex for item fields
const itemNameRegex = /^[a-zA-Z0-9\s]+$/;
const itemPriceRegex = /^\d+(\.\d{1,2})?$/;
const itemQuantityRegex = /^\d+$/;

$('#Iid,#ItemDesc,#UPrice,#Qty').keyup(function (event){
    console.log(event.key)

    if (event.key ==='Tab'){
        event.preventDefault();
    }
});

itemDescF.keyup(function (event){


    if (itemNameRegex.test(itemDescF.val())){

        itemDescF.css('border-color', '#dee2e6');

        if (event.key ==='Enter'){
            itemPF.focus();
        }

    }else {
        itemDescF.css('border-color', 'red');
    }

});

itemPF.keyup(function (event){
    if (itemPriceRegex.test(itemPF.val())){
        itemPF.css('border-color', '#dee2e6');
        if (event.key ==='Enter'){

            itemQtyF.focus();
        }
    }else {
        itemPF.css('border-color', 'red');
    }

});

itemQtyF.keyup(function (event){

    if (itemQuantityRegex.test(itemQtyF.val())){
        itemQtyF.css('border-color', '#dee2e6');

        if (event.key ==='Enter'){
            addItem();
        }
    }else {
        itemQtyF.css('border-color', 'red');
    }
});

function validateItemFields(){
    if (!itemNameRegex.test(itemDescF.val())){
        itemDescF.focus();
        itemDescF.css('border-color', 'red');
        return false;
    }
    if (!itemPriceRegex.test(itemPF.val())){
        cusAddressF.focus();
        cusAddressF.css('border-color', 'red');
        return false;
    }
    if (!itemQuantityRegex.test(itemQtyF.val())){
        cusContactF.focus();
        cusContactF.css('border-color', 'red');
        return false;
    }

    cusNameF.css('border-color', '#dee2e6');
    cusAddressF.css('border-color', '#dee2e6');
    cusContactF.css('border-color', '#dee2e6');
    return true;
}
