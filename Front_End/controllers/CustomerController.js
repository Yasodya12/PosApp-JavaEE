let newCusID;

//customer fields
const cusIDF = $('#cid');
const cusNameF = $('#Name');
const cusAddressF = $('#Address');
const cusContactF = $('#contact');

//buttons
const btnAdd = $("#btnAdd");
const tblCustomers = $("#tblCustomers");
const btnUpdate = $("#btnUpdate");
const btnDelete = $("#btnDelete");
const btnClear = $("#btnClear");



addCustomersToTable();
//id increment
function incrementCusId(currentID) {
    /*if (currentID==='no'){
        cusId='C00-001';
        cusIDF.val(cusId);
    }else {
        let number =parseInt(currentID.slice(4), 10);
        number++;
        cusId = "C00-" + number.toString().padStart(3, "0");
        console.log(cusId);
        cusIDF.val(cusId);
    }*/
}
//incrementCusId('no');

function clearCustomerFields() {
    //cusIDF.val("");
    cusNameF.val("");
    cusNameF.focus();
    cusAddressF.val("");
    cusContactF.val("");

}

function addCustomersToTable() {
    //get All customers
    //Ajax
    $.ajax({
        url:'http://localhost:8080/Back_End_Web_exploded/customer',
        success:function (res) {
            //console.log(res);
            tblCustomers.empty();

            console.log()
            incrementCustomerID(res[res.length-1].id);
            cusIDF.val(newCusID);

            for (let i = 0; i < res.length; i++) {
                let row = $('<tr> <td>'+ res[i].id +'</td> <td>'+ res[i].name +'</td> <td>'+ res[i].address +'</td> <td>'+ res[i].contact +'</td> </tr>');
                tblCustomers.append(row);
            }
        },
        error:function (error) {
            console.log(error.status);
        }
    })
}

btnAdd.click(function (){
    const customerForm = $("#customerForm").serialize();
    if (validateFields()){
        $.ajax({
            url:'http://localhost:8080/Back_End_Web_exploded/customer',
            data:customerForm,
            method:"POST",
            success:function (res) {
                addCustomersToTable();
                clearCustomerFields();
                //incrementCusId(cusId);
                console.log(res.state);
            },error:function (error){
                console.log(error.status)
            }
        })
    }
});

tblCustomers.dblclick(function (event){

    btnUpdate.prop('disabled',false);
    btnDelete.prop('disabled',false);
    btnAdd.prop('disabled',true);

    let selectedCustomerRow = event.target.closest("tr");

    cusIDF.val(selectedCustomerRow.cells[0].textContent);
    cusNameF.val(selectedCustomerRow.cells[1].textContent);
    cusAddressF.val(selectedCustomerRow.cells[2].textContent);
    cusContactF.val(selectedCustomerRow.cells[3].textContent);

});


btnUpdate.click(function (){

    //Update Customers
    if (confirm("Are you sure you want to Update this Customer?")) {
        let cusID = cusIDF.val();
        let cusName = cusNameF.val();
        let cusAddress = cusAddressF.val();
        let cusContact = cusContactF.val();

        let cusOb={id:cusID,name:cusName,address:cusAddress,salary:cusContact}
        JSON.stringify(cusOb);
        $.ajax({
            url:'http://localhost:8080/Back_End_Web_exploded/customer',
            method:'put',
            contentType:"application/json",
            data:JSON.stringify(cusOb),
            success:function (res) {
                addCustomersToTable();
                clearCustomerFields();
                //incrementCusId(cusId);
                console.log(res.state);
            },error:function (error){
                console.log(error.status)
            }
        });
    }
});

btnDelete.click(function (){
    //Deleting a Customer
    if (confirm("Are you sure you want to delete this Customer?")) {
        let cusID = cusIDF.val();

        $.ajax({
            url:'http://localhost:8080/Back_End_Web_exploded/customer?cusID='+cusID,
            method: "delete",
            success:function (res) {
                addCustomersToTable();
                clearCustomerFields();
                //incrementCusId(cusId);
                console.log(res.state);
            },error:function (error){
                console.log(error.status)
            }
        });
    }
});

btnClear.click(function (){
    clearCustomerFields();
});

function incrementCustomerID(currentCustomID) {
    const parts = currentCustomID.split('-');
    const numberPart = parseInt(parts[1], 10);
    const incrementedNumber = numberPart + 1;
    const newNumberPart = String(incrementedNumber).padStart(3, '0');
    newCusID= `C00-${newNumberPart}`;
}


//Regex Validations
$('#cid, #Name, #Address, #contact').keyup(function (event){
    console.log(event.key)

    if (event.key ==='Tab'){
        event.preventDefault();
    }
});

cusNameF.keyup(function (event){


    if (/^[A-Za-z]+$/.test(cusNameF.val())){

        cusNameF.css('border-color', '#dee2e6');

        if (event.key ==='Enter'){
            cusAddressF.focus();
        }

    }else {
        cusNameF.css('border-color', 'red');
    }

});

cusAddressF.keyup(function (event){
    if (/^[A-Za-z\s.'-]+$/.test(cusAddressF.val())){
        cusAddressF.css('border-color', '#dee2e6');
        if (event.key ==='Enter'){

            cusContactF.focus();
        }
    }else {
        cusAddressF.css('border-color', 'red');
    }

});

cusContactF.keyup(function (event){

    if (/^(?:\+94|0)(?:\d{9}|\d{2}-\d{7})$/.test(cusContactF.val())){
        cusContactF.css('border-color', '#dee2e6');

        if (event.key ==='Enter'){
            addCustomer();
        }
    }else {
        cusContactF.css('border-color', 'red');
    }
});

function validateFields(){
    if (!/^[A-Za-z]+$/.test(cusNameF.val())){
        cusNameF.focus();
        cusNameF.css('border-color', 'red');
        return false;
    }
    if (!/^[A-Za-z\s.'-]+$/.test(cusAddressF.val())){
        cusAddressF.focus();
        cusAddressF.css('border-color', 'red');
        return false;
    }
    if (!/^(?:\+94|0)(?:\d{9}|\d{2}-\d{7})$/.test(cusContactF.val())){
        cusContactF.focus();
        cusContactF.css('border-color', 'red');
        return false;
    }

    cusNameF.css('border-color', '#dee2e6');
    cusAddressF.css('border-color', '#dee2e6');
    cusContactF.css('border-color', '#dee2e6');
    return true;
}
