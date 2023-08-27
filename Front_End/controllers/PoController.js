let selectCusIds = $('#customerIds');
let selectItemIds = $('#itemIds');
let totalField = $('#maxTot');
let orderTable = $('#allOrderTable');

let selectedCustomerID;
let total = 0;
let cartItems = [];
let orderID;

function nextOrderID() {

}

loadCustomerOptionIds();
loadItemOptionIds();
loadAllOrders();

function loadCustomerOptionIds() {
    /*selectCusIds.empty();
    selectCusIds.append($('<option selected>Select_ID</option>'));

    for (let index in customerList) {
        let option = $('<option value="'+index+'"> '+customerList[index].cid+' </option>');
        selectCusIds.append(option);
    }*/

    $.ajax({
        url: 'http://localhost:8080/Back_End_Web_exploded/customer',
        success: function (res) {
            selectCusIds.empty();
            selectCusIds.append($('<option selected>Select_ID</option>'));

            for (let i = 0; i < res.length; i++) {
                let option = $('<option>' + res[i].id + '</option>');
                selectCusIds.append(option);
            }
        },
        error: function (error) {
            console.log(error.status);
        }
    })
}

function loadItemOptionIds() {

    $.ajax({
        url: 'http://localhost:8080/Back_End_Web_exploded/item',
        success: function (res) {
            selectItemIds.empty();
            selectItemIds.append($('<option selected>Select_ID</option>'));

            for (let i = 0; i < res.length; i++) {
                let option = $('<option>' + res[i].code + '</option>');
                selectItemIds.append(option);
            }
        },
        error: function (error) {
            console.log(error.status);
        }
    })

    /*selectItemIds.empty();
    selectItemIds.append($('<option selected>Select_ID</option>'));

    for (let index in itemList) {
        let option = $('<option value="'+index+'"> '+itemList[index].iId+' </option>');
        selectItemIds.append(option);
    }*/
}

//Date formatter
/*
let date=new Date();

let fullDay = date.getDay();
let fullMonth = date.getMonth()+1;
let fullYear = date.getFullYear();

let dateFormatter=`${fullDay}-${fullMonth}-${fullYear}`;

$('#dtf').val(dateFormatter);*/

/*function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    $('#dtf').val(`${year}-${month}-${day}`);
}*/

function clearPoFields() {
    $('#itemIds option:contains("Select_ID")').prop('selected', true);
    $('#poItemDesc').val("");
    $('#poItemQtyOnHand').val("");
    $('#poItemUP').val("");
    $('#poItemQty').val("");
}

selectCusIds.click(function () {
    let selectedCusID = $("#customerIds :selected").text();

    if (selectedCusID !== "Select_ID") {
        console.log(selectedCusID);

        $.ajax({
            url: 'http://localhost:8080/Back_End_Web_exploded/placeOrder?option=customer&id=' + selectedCusID,
            success: function (res) {
                selectedCustomerID = res.id;
                $('#poCustomerName').val(res.name);
            },
            error: function (error) {
                console.log(error.status);
            }
        })

    }

});

selectItemIds.click(function () {
    let selectedItemID = $("#itemIds :selected").text();

    if (selectedItemID !== "Select_ID") {
        console.log(selectedItemID);

        $.ajax({
            url: 'http://localhost:8080/Back_End_Web_exploded/placeOrder?option=items&id=' + selectedItemID,
            method: "get",
            success: function (res) {

                $('#poItemDesc').val(res.desc);
                $('#poItemQtyOnHand').val(res.qty);
                $('#poItemUP').val(res.price);

            },
            error: function (error) {
                console.log(error.status);
            }
        })

    }
    /*$('#poItemDesc').val(itemListElement.desc);
    $('#poItemQtyOnHand').val(itemListElement.qty);
    $('#poItemUP').val(itemListElement.unitP);*/

});

$('#btnAddToCart').click(function () {

    if (qtyValidate()) {

        console.log(qtyValidate())

        let bItemId = $("#itemIds :selected").text();
        let desc = $('#poItemDesc').val();
        let unitPrice = $('#poItemUP').val();
        let buyingQty = $('#poItemQty').val();

        total += unitPrice * buyingQty;

        let cart = $("#pOTBody");
        let tr = $('<tr> <td>' + bItemId + '</td> <td>' + desc + '</td> <td>' + buyingQty + '</td> <td>' + unitPrice + '</td></tr>');
        cart.append(tr);
        console.log(total);
        totalField.val(total);
    }

});

//
$('#pOTBody').dblclick(function (event) {
    if (confirm("Do You Want to delete item ?")) {
        event.target.closest("tr").remove();
    }
});

function getAllCartData() {
    let cart = $('#pOTBody tr');

    cart.each(function () {
        let rowData = {};

        let cells = $(this).find('td');

        rowData["id"] = $(cells[0]).text();
        rowData["desc"] = $(cells[1]).text();
        rowData["qty"] = $(cells[2]).text();
        rowData["up"] = $(cells[3]).text();

        cartItems.push(rowData);
    });

    console.log(cartItems);
}

$('#purchaseOrder').click(function () {

    let orderID = $('#currentOrderID').val();
    let date = $('#dtf').val();
    getAllCartData();
    let order = {
        orderID: orderID,
        date: date,
        amount: total,
        customer: selectedCustomerID,
        details: cartItems
    }

    $.ajax({
        url: 'http://localhost:8080/Back_End_Web_exploded/placeOrder',
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(order),
        success: function (res) {
            updateItems()
        },
        error: function (error) {
            console.log(error.status);
        }
    })

});

function updateItems() {
    $.ajax({
        url: 'http://localhost:8080/Back_End_Web_exploded/placeOrder',
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(cartItems),
        success: function (res) {

        },
        error: function (error) {
            console.log(error.status);
        }
    })
}


function qtyValidate() {

    if (/^\d+$/.test($('#poItemQty').val())) {
        let qtyOnHand = $('#poItemQtyOnHand').val();
        $('#poItemQty').css("border-color", 'white');

        if (qtyOnHand >= Number($('#poItemQty').val())) {
            $('#poItemQty').css("border-color", 'white');
            return true;
        } else {
            $('#poItemQty').css("border-color", 'red');
            return false;
        }

    } else {
        $('#poItemQty').css("border-color", 'red');
        return false;
    }
}


function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}
$('#dtf').val(getCurrentDate());

function loadAllOrders() {
    $.ajax({
        url:'http://localhost:8080/Back_End_Web_exploded/placeOrder?option=orders',
        success:function (res) {
            //allOrderTable
            orderTable.empty();

            incrementOrderID(res[res.length-1].id);
            $('#currentOrderID').val(orderID);

            for (let i = 0; i < res.length; i++) {
                let row = $('<tr> <td>'+ res[i].id +'</td> <td>'+ res[i].date +'</td> <td>'+ res[i].name +'</td> <td>'+ res[i].total +'</td> </tr>');
                orderTable.append(row);
            }
        },
        error:function (error) {
            console.log(error.status);
        }
    })
}


function incrementOrderID(currentOrderID) {
    const parts = currentOrderID.split('-');
    const number = parseInt(parts[1], 10);
    const incrementedNumber = number + 1;
    const newID = String(incrementedNumber).padStart(3, '0');
    orderID = `O-${newID}`;
}
